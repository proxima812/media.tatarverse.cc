import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from PIL import Image
import logos


def image_bytes():
    output = io.BytesIO()
    Image.new("RGB", (96, 64), "green").save(output, "JPEG")
    return output.getvalue()


class LogoTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.cards = self.root / "src/data/cards"
        self.cards.mkdir(parents=True)
        self.card = self.cards / "example-media.md"
        self.original = b'---\nname: Example\nurl: https://example.org\nfacts: [One, Two, Three]\n---\nKeep body exactly.\n'
        self.card.write_bytes(self.original)
        self.folder = self.root / ".cache/review"

    def scan_fixture(self):
        def fetch(url):
            if url == "https://example.org":
                return b'<link rel="icon" href="/logo.png"><meta property="og:image" content="/cover.png">', url
            return image_bytes(), url
        with patch.object(logos, "fetch", side_effect=fetch), patch.object(logos.time, "sleep"):
            logos.scan(self.root, self.folder, [], 0)
        report = json.loads((self.folder / "report.json").read_text())
        selection = self.root / "selection.json"
        selection.write_text(json.dumps({"report": report["id"], "selected": {
            "example-media": report["cards"][0]["candidates"][0]["key"]}}))
        return selection

    def test_candidate_priority_and_platform_icons(self):
        source = b'''<meta property="og:image" content="/cover.jpg">
<link rel="icon" href="/favicon.ico"><img alt="Logo" src="/logo.png">
<script type="application/ld+json">{"@graph":[{"logo":{"url":"/brand.png"}}]}</script>'''
        candidates = list(logos.discover(source, "https://example.org/about"))
        self.assertEqual(candidates[0], ("structured-logo", "https://example.org/brand.png"))
        self.assertEqual(len(candidates), 4)
        self.assertNotIn("icon", [kind for kind, _ in logos.discover(source, "https://t.me/channel")])

    def test_scan_apply_and_repeat_preserve_content(self):
        selection = self.scan_fixture()
        self.assertEqual(self.card.read_bytes(), self.original)
        self.assertFalse((self.root / "src/assets").exists())
        logos.apply(self.root, self.folder, selection)
        inserted = b'logo: "../../assets/images/logo/example-media.png"\n'
        self.assertEqual(self.card.read_bytes().replace(inserted, b''), self.original)
        destination = self.root / "src/assets/images/logo/example-media.png"
        with Image.open(destination) as image:
            self.assertEqual(image.format, "PNG")
        self.assertEqual(next(self.folder.glob("backup-*/*.md")).read_bytes(), self.original)
        logos.apply(self.root, self.folder, selection)
        self.assertEqual(len(list(self.folder.glob("backup-*"))), 1)

    def test_changed_card_rejected(self):
        selection = self.scan_fixture()
        self.card.write_bytes(self.original + b"Changed\n")
        with self.assertRaisesRegex(ValueError, "changed since scan"):
            logos.apply(self.root, self.folder, selection)
        self.assertFalse((self.root / "src/assets").exists())

    def test_existing_asset_rejected(self):
        selection = self.scan_fixture()
        destination = self.root / "src/assets/images/logo/example-media.png"
        destination.parent.mkdir(parents=True)
        destination.write_bytes(b"Existing original")
        with self.assertRaisesRegex(ValueError, "overwrite"):
            logos.apply(self.root, self.folder, selection)
        self.assertEqual(destination.read_bytes(), b"Existing original")
        self.assertEqual(self.card.read_bytes(), self.original)

    def test_changed_candidate_rejected(self):
        selection = self.scan_fixture()
        (self.folder / "images/example-media-0.png").write_bytes(b"Changed")
        with self.assertRaisesRegex(ValueError, "Candidate changed"):
            logos.apply(self.root, self.folder, selection)

    def test_crlf_empty_logo(self):
        self.original = self.original.replace(b'facts:', b'logo: null # pending\nfacts:').replace(b'\n', b'\r\n')
        self.card.write_bytes(self.original)
        selection = self.scan_fixture()
        logos.apply(self.root, self.folder, selection)
        actual = self.card.read_bytes()
        self.assertIn(b'logo: "../../assets/images/logo/example-media.png"\r\n', actual)
        self.assertNotIn(b'\n', actual.replace(b'\r\n', b''))

    def test_invalid_image(self):
        with self.assertRaises(Exception):
            logos.png_image(b'<html>Access denied</html>')
        output = io.BytesIO()
        Image.new("RGB", (16, 16)).save(output, "PNG")
        with self.assertRaisesRegex(ValueError, "smaller"):
            logos.png_image(output.getvalue())

    def test_wrong_repository(self):
        selection = self.scan_fixture()
        with self.assertRaisesRegex(ValueError, "different scan or repository"):
            logos.apply(self.root / "other", self.folder, selection)

    def test_write_failure_rolls_back(self):
        selection = self.scan_fixture()
        replace = os.replace

        def fail_card_write(source, target):
            if str(source).endswith(".md.tmp"):
                raise OSError("Disk failure")
            return replace(source, target)

        with patch.object(logos.os, "replace", side_effect=fail_card_write):
            with self.assertRaisesRegex(OSError, "Disk failure"):
                logos.apply(self.root, self.folder, selection)
        self.assertEqual(self.card.read_bytes(), self.original)
        self.assertFalse((self.root / "src/assets/images/logo/example-media.png").exists())


if __name__ == "__main__":
    unittest.main()
