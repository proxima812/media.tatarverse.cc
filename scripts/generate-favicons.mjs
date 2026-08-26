import { constants as fsConstants } from "node:fs";
import {
	access,
	copyFile,
	mkdir,
	readFile,
	stat,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const publicDir = path.resolve(process.cwd(), "public");
const svgSourcePath = path.join(publicDir, "media-tatarverse.svg");
const pngSourcePath = path.join(publicDir, "media-512x512.png");

if (!(await bothExist(svgSourcePath, pngSourcePath))) {
	console.log(
		"[favicons] Skip: media-tatarverse.svg or media-512x512.png not found in public/",
	);
	process.exit(0);
}

const pngTargets = [
	{ size: 16, filename: "favicon-16x16.png" },
	{ size: 32, filename: "favicon-32x32.png" },
	{ size: 48, filename: "favicon-48x48.png", internalOnly: true },
	{ size: 180, filename: "apple-touch-icon.png" },
	{ size: 192, filename: "android-chrome-192x192.png" },
];

const svgTarget = path.join(publicDir, "favicon.svg");
const icoTarget = path.join(publicDir, "favicon.ico");
const androidMaxTarget = path.join(publicDir, "android-chrome-512x512.png");

const trackedOutputs = [
	...pngTargets.map((target) => path.join(publicDir, target.filename)),
	svgTarget,
	icoTarget,
	androidMaxTarget,
];

const [svgStats, pngStats] = await Promise.all([
	stat(svgSourcePath),
	stat(pngSourcePath),
]);
const newestSourceMtime = Math.max(svgStats.mtimeMs, pngStats.mtimeMs);

if (await areOutputsFresh(trackedOutputs, newestSourceMtime)) {
	console.log("[favicons] Up to date");
	process.exit(0);
}

await mkdir(publicDir, { recursive: true });

for (const target of pngTargets) {
	await renderPng(
		pngSourcePath,
		path.join(publicDir, target.filename),
		target.size,
	);
}

await copyFile(pngSourcePath, androidMaxTarget);
await copyFile(svgSourcePath, svgTarget);

const icoBuffers = await Promise.all(
	[16, 32, 48].map((size) =>
		readFile(path.join(publicDir, `favicon-${size}x${size}.png`)),
	),
);

await writeFile(icoTarget, createIco(icoBuffers));
console.log(
	"[favicons] Generated from media-tatarverse.svg + media-512x512.png",
);

async function bothExist(...paths) {
	for (const candidate of paths) {
		try {
			await access(candidate, fsConstants.F_OK);
		} catch {
			return false;
		}
	}

	return true;
}

async function areOutputsFresh(paths, sourceMtimeMs) {
	for (const outputPath of paths) {
		try {
			const outputStats = await stat(outputPath);
			if (outputStats.mtimeMs < sourceMtimeMs) {
				return false;
			}
		} catch {
			return false;
		}
	}

	return true;
}

async function renderPng(inputPath, outputPath, size) {
	const proc = Bun.spawn([
		"sips",
		"-s",
		"format",
		"png",
		"-z",
		String(size),
		String(size),
		inputPath,
		"--out",
		outputPath,
	]);

	const exitCode = await proc.exited;

	if (exitCode !== 0) {
		const stderr = await new Response(proc.stderr).text();
		throw new Error(
			`Failed to render ${path.basename(outputPath)} with sips.\n${stderr}`,
		);
	}
}

function createIco(pngBuffers) {
	const headerSize = 6;
	const directoryEntrySize = 16;
	const imageDataOffset = headerSize + directoryEntrySize * pngBuffers.length;
	const iconDir = Buffer.alloc(headerSize);

	iconDir.writeUInt16LE(0, 0);
	iconDir.writeUInt16LE(1, 2);
	iconDir.writeUInt16LE(pngBuffers.length, 4);

	let currentOffset = imageDataOffset;
	const directoryEntries = pngBuffers.map((pngBuffer) => {
		const width = normalizeIcoSize(readUInt32BE(pngBuffer, 16));
		const height = normalizeIcoSize(readUInt32BE(pngBuffer, 20));
		const entry = Buffer.alloc(directoryEntrySize);

		entry.writeUInt8(width, 0);
		entry.writeUInt8(height, 1);
		entry.writeUInt8(0, 2);
		entry.writeUInt8(0, 3);
		entry.writeUInt16LE(1, 4);
		entry.writeUInt16LE(32, 6);
		entry.writeUInt32LE(pngBuffer.length, 8);
		entry.writeUInt32LE(currentOffset, 12);

		currentOffset += pngBuffer.length;
		return entry;
	});

	return Buffer.concat([iconDir, ...directoryEntries, ...pngBuffers]);
}

function readUInt32BE(buffer, offset) {
	return buffer.readUInt32BE(offset);
}

function normalizeIcoSize(size) {
	return size >= 256 ? 0 : size;
}
