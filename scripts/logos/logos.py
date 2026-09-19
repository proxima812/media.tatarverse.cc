#!/usr/bin/env python3
"""Discover logo candidates; apply only the explicit selection from preview.html."""
from __future__ import annotations

import argparse
import hashlib
import html
from html.parser import HTMLParser
import io
import json
import os
from pathlib import Path
import re
import sys
import time
from datetime import datetime, timezone
from urllib.parse import quote, urljoin, urlparse, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import warnings

from PIL import Image, ImageOps
import yaml

ROOT = Path(__file__).resolve().parents[2]
MAX_BYTES = 8 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 20_000_000
PLATFORMS = ("youtube.com", "youtu.be", "t.me", "telegram.me", "vk.com", "vk.ru",
             "instagram.com", "facebook.com", "tiktok.com", "ok.ru", "dzen.ru")


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read_card(path: Path) -> tuple[bytes, dict, re.Match]:
    raw = path.read_bytes()
    text = raw.decode("utf-8")
    match = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
    if not match:
        raise ValueError(f"Missing frontmatter: {path.name}")
    data = yaml.safe_load(match[1])
    if not isinstance(data, dict):
        raise ValueError(f"Invalid frontmatter: {path.name}")
    return raw, data, match


def fetch(url: str) -> tuple[bytes, str]:
    if urlparse(url).scheme not in ("http", "https"):
        raise ValueError("Only HTTP(S) sources are supported")
    parts = urlsplit(url)
    url = urlunsplit((parts.scheme, parts.netloc.encode("idna").decode("ascii"),
                      quote(parts.path, safe="/%:@"), quote(parts.query, safe="%=&?/:+@"), ""))
    request = Request(url, headers={"User-Agent": "TatarverseLogoReview/1.0", "Accept": "*/*"})
    with urlopen(request, timeout=15) as response:
        if int(response.headers.get("Content-Length", "0")) > MAX_BYTES:
            raise ValueError("Response exceeds 8 MB")
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError("Response exceeds 8 MB")
        return data, response.url


class PageImages(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.candidates = []
        self.json_ld = []
        self.script = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self.script = ""
        if tag == "link" and any("icon" in part for part in attrs.get("rel", "").lower().split()):
            self.candidates.append(("icon", attrs.get("href")))
        if tag == "meta" and (attrs.get("property") or attrs.get("name", "")).lower() in ("og:image", "twitter:image"):
            self.candidates.append(("cover", attrs.get("content")))
        if tag == "img" and re.search(r"logo", " ".join(attrs.get(key, "") or "" for key in ("alt", "class", "id", "src")), re.I):
            self.candidates.append(("html-logo", attrs.get("src") or attrs.get("data-src")))

    def handle_data(self, data):
        if self.script is not None:
            self.script += data

    def handle_endtag(self, tag):
        if tag == "script" and self.script is not None:
            try:
                self.json_ld.append(json.loads(self.script))
            except ValueError:
                pass
            self.script = None


def structured_logos(value):
    if isinstance(value, list):
        for item in value:
            yield from structured_logos(item)
    elif isinstance(value, dict):
        logo = value.get("logo")
        for item in logo if isinstance(logo, list) else [logo]:
            if isinstance(item, str):
                yield item
            elif isinstance(item, dict):
                url = item.get("contentUrl") or item.get("url")
                if isinstance(url, str):
                    yield url
        for item in value.values():
            if isinstance(item, (dict, list)):
                yield from structured_logos(item)


def discover(source: bytes, url: str):
    page = PageImages()
    page.feed(source.decode("utf-8", errors="replace"))
    platform = any((urlparse(url).hostname or "").lower() == host or
                   (urlparse(url).hostname or "").lower().endswith("." + host) for host in PLATFORMS)
    found = [("structured-logo", logo) for value in page.json_ld for logo in structured_logos(value)]
    found += sorted(page.candidates, key=lambda item: {"html-logo": 0, "icon": 1, "cover": 2}[item[0]])
    if not platform:
        found.append(("favicon", urljoin(url, "/favicon.ico")))
    seen = set()
    for kind, candidate in found:
        if not candidate or (platform and kind in ("icon", "favicon")):
            continue
        absolute = urljoin(url, candidate)
        if urlparse(absolute).scheme in ("http", "https") and absolute not in seen:
            seen.add(absolute)
            yield kind, absolute


def png_image(data: bytes) -> tuple[bytes, tuple[int, int]]:
    with warnings.catch_warnings():
        warnings.simplefilter("error", Image.DecompressionBombWarning)
        with Image.open(io.BytesIO(data)) as image:
            if image.format not in ("PNG", "JPEG", "WEBP", "GIF", "ICO"):
                raise ValueError("Unsupported image format")
            image.load()
            if min(image.size) < 32:
                raise ValueError("Image smaller than 32 px")
            size = image.size
            result = ImageOps.exif_transpose(image).convert("RGBA")
            result.thumbnail((512, 512))
            output = io.BytesIO()
            result.save(output, "PNG")
            return output.getvalue(), size


def write_json(path: Path, value):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def preview(report: dict, folder: Path):
    escape = html.escape
    sections = []
    for card in report["cards"]:
        options = []
        for item in card["candidates"]:
            options.append(f'''<label><input type="radio" name="{escape(card['id'])}" value="{escape(item['key'])}">
<img src="{escape(item['file'])}" alt=""><span>{escape(item['kind'])} - {item['width']} x {item['height']}</span>
<a href="{escape(item['url'])}" target="_blank" rel="noreferrer">Источник изображения</a></label>''')
        errors = "\n".join(card["errors"])
        sections.append(f'''<section><h2>{escape(card['name'])}</h2><a href="{escape(card['url'])}" target="_blank" rel="noreferrer">Страница проекта</a>
<p>Проверьте принадлежность изображения проекту. Обложки и бренды платформ могут не подходить.</p>
<label><input type="radio" name="{escape(card['id'])}" value="" checked>Пропустить</label>
<div class="options">{''.join(options)}</div><details><summary>Ошибки: {len(card['errors'])}</summary><pre>{escape(errors)}</pre></details></section>''')
    page = '''<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Выбор логотипов</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:16px}section{border-top:1px solid #aaa;padding:24px 0}.options{display:flex;flex-wrap:wrap;gap:20px}label{display:flex;flex-direction:column;gap:8px;padding:12px}img{width:128px;height:128px;object-fit:contain;background:#eee}pre{white-space:pre-wrap;overflow-wrap:anywhere}button{padding:12px;position:sticky;top:8px}</style>
<h1>Кандидаты на логотипы</h1><p>По умолчанию ничего не выбрано. Выберите изображения и скачайте selection.json. Затем выполните apply из README.</p>
<button id="export">Скачать выбор</button>''' + "".join(sections) + '''<script>
document.querySelector('#export').addEventListener('click', () => {
 const selected = {};
 for (const input of document.querySelectorAll('input:checked')) if (input.value) selected[input.name] = input.value;
 const blob = new Blob([JSON.stringify({report: REPORT_ID, selected}, null, 2)], {type:'application/json'});
 const url = URL.createObjectURL(blob); const link = document.createElement('a');
 link.href = url; link.download = 'selection.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});</script></html>'''.replace('REPORT_ID', json.dumps(report["id"]))
    (folder / "preview.html").write_text(page, encoding="utf-8")


def scan(root: Path, folder: Path, ids: list[str], limit: int):
    folder.mkdir(parents=True, exist_ok=False)
    (folder / "images").mkdir()
    report = {"id": folder.name, "root": str(root.resolve()), "cards": []}
    paths = sorted((root / "src/data/cards").glob("*.md"))
    unknown = set(ids) - {path.stem for path in paths}
    if unknown:
        raise ValueError(f"Unknown card IDs: {sorted(unknown)}")
    for path in paths:
        if ids and path.stem not in ids:
            continue
        raw, data, _ = read_card(path)
        if data.get("logo"):
            continue
        if limit and len(report["cards"]) >= limit:
            break
        card = {"id": path.stem, "name": str(data["name"]), "url": str(data["url"]),
                "sha256": digest(raw), "candidates": [], "errors": []}
        print(f"Scanning {path.stem}", flush=True)
        try:
            source, final_url = fetch(card["url"])
            card["resolved_url"] = final_url
            for index, (kind, url) in enumerate(discover(source, final_url)):
                if index >= 12:
                    break
                try:
                    image, resolved = fetch(url)
                    png, (width, height) = png_image(image)
                    key = f"{path.stem}-{index}"
                    relative = f"images/{key}.png"
                    (folder / relative).write_bytes(png)
                    card["candidates"].append({"key": key, "kind": kind, "url": resolved,
                                               "file": relative, "width": width, "height": height,
                                               "sha256": digest(png)})
                except Exception as error:
                    card["errors"].append(f"{url}: {error}")
                time.sleep(0.15)
        except Exception as error:
            card["errors"].append(str(error))
        report["cards"].append(card)
        write_json(folder / "report.json", report)
        preview(report, folder)
    write_json(folder / "report.json", report)
    preview(report, folder)
    print(f"Reviewed {len(report['cards'])} cards. Preview: {folder / 'preview.html'}")


def apply(root: Path, folder: Path, selection_path: Path):
    report = json.loads((folder / "report.json").read_text())
    selection = json.loads(selection_path.read_text())
    if report["root"] != str(root.resolve()) or selection["report"] != report["id"]:
        raise ValueError("Selection/report belongs to a different scan or repository")
    cards = {card["id"]: card for card in report["cards"]}
    pending = []
    for card_id, key in selection["selected"].items():
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", card_id):
            raise ValueError("Invalid card ID")
        card = cards[card_id]
        path = root / "src/data/cards" / f"{card_id}.md"
        raw, data, match = read_card(path)
        if data.get("logo"):
            print(f"Skipping {card_id}: already has logo")
            continue
        if digest(raw) != card["sha256"]:
            raise ValueError(f"Card changed since scan: {card_id}")
        candidate = next(item for item in card["candidates"] if item["key"] == key)
        source = (folder / candidate["file"]).resolve()
        if not source.is_relative_to((folder / "images").resolve()):
            raise ValueError("Candidate outside scan images directory")
        png = source.read_bytes()
        if digest(png) != candidate["sha256"]:
            raise ValueError(f"Candidate changed since scan: {card_id}")
        png_image(png)
        destination = root / "src/assets/images/logo" / f"{card_id}.png"
        if destination.exists():
            raise ValueError(f"Refusing to overwrite {destination}")
        text = raw.decode("utf-8")
        newline = "\r\n" if "\r\n" in text else "\n"
        logo = f'logo: "../../assets/images/logo/{card_id}.png"'
        frontmatter = match[1]
        if "logo" in data:
            # Only empty scalar logo fields are replaceable without rewriting YAML.
            pattern = r'^logo:[ \t]*(?:null|~|\x27\x27|"")?[ \t]*(?:#[^\r\n]*)?\r?$'
            frontmatter, count = re.subn(pattern, logo + ("\r" if newline == "\r\n" else ""), frontmatter, flags=re.M)
            if count != 1:
                raise ValueError(f"Unsupported empty logo field: {card_id}")
        else:
            frontmatter += newline + logo
        updated = (text[:match.start(1)] + frontmatter + text[match.end(1):]).encode("utf-8")
        pending.append((path, raw, destination, png, updated))
    if not pending:
        print("Nothing to apply")
        return
    backup = folder / ("backup-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ"))
    backup.mkdir()
    for path, raw, _, _, _ in pending:
        (backup / path.name).write_bytes(raw)
    write_json(backup / "changes.json", [{"card": str(p), "logo": str(d)} for p, _, d, _, _ in pending])
    completed = []
    try:
        for path, raw, destination, png, updated in pending:
            if path.read_bytes() != raw:
                raise ValueError(f"Card changed during apply: {path.name}")
            destination.parent.mkdir(parents=True, exist_ok=True)
            with destination.open("xb") as output:
                completed.append((path, raw, destination))
                output.write(png)
            temporary = backup / (path.name + ".tmp")
            temporary.write_bytes(updated)
            os.replace(temporary, path)
    except Exception:
        for path, raw, destination in reversed(completed):
            path.write_bytes(raw)
            destination.unlink(missing_ok=True)
        raise
    print(f"Applied {len(pending)} logos. Backups: {backup}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    scan_parser = commands.add_parser("scan", help="Download candidates; leave cards unchanged")
    scan_parser.add_argument("--id", action="append", default=[], help="Card ID; repeatable")
    scan_parser.add_argument("--limit", type=int, default=0, help="Maximum cards; 0 means all")
    apply_parser = commands.add_parser("apply", help="Apply candidates explicitly selected in preview")
    apply_parser.add_argument("--report", type=Path, required=True, help="Path to report.json")
    apply_parser.add_argument("--selection", type=Path, required=True)
    args = parser.parse_args()
    if args.command == "scan":
        if args.limit < 0:
            parser.error("--limit must be non-negative")
        folder = ROOT / ".cache/logo-discovery" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        scan(ROOT, folder, args.id, args.limit)
    else:
        apply(ROOT, args.report.resolve().parent, args.selection)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, KeyError, StopIteration) as error:
        sys.exit(f"Error: {error}")
