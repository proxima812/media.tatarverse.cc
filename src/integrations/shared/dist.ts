/**
 * Утилиты для интеграций, которые генерируют файлы в `dist/`.
 *
 * Все генерируемые артефакты стартера (robots.txt, ai.txt, site.webmanifest,
 * ключ IndexNow) пишутся на хуке `astro:build:done`. Так интеграция получает
 * конфигурацию явно, через аргументы, и не зависит от того, в каком инстансе
 * модуля ее выполнил Vite.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Пишет файл в каталог сборки. Возвращает путь относительно `dist/`. */
export async function emitFile(
	dir: URL,
	relativePath: string,
	contents: string,
): Promise<string> {
	const outDir = fileURLToPath(dir);
	const target = path.join(outDir, relativePath);

	await fs.mkdir(path.dirname(target), { recursive: true });
	await fs.writeFile(target, contents, "utf-8");

	return relativePath;
}

/** Существует ли файл в каталоге сборки. */
export async function distFileExists(
	dir: URL,
	relativePath: string,
): Promise<boolean> {
	try {
		await fs.stat(path.join(fileURLToPath(dir), relativePath));
		return true;
	} catch {
		return false;
	}
}
