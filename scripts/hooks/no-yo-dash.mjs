#!/usr/bin/env node
/**
 * PreToolUse hook: запрещает «е» и длинные тире в тексте, который пишет агент.
 *
 * Правило: только «е» вместо «е», только дефис «-» вместо «-», «-», «-», «-».
 * Проверяется то, что агент собирается записать (Write/Edit/NotebookEdit),
 * а не то, что уже лежит в репозитории.
 */

const FORBIDDEN = [
	{ re: /[ёЁ]/g, name: "ё/Ё", fix: "пиши «е»/«Е»" },
	{ re: /[—–‒―]/g, name: "длинное тире", fix: "пиши обычный дефис «-»" },
];

/** Поля с текстом у разных инструментов записи. */
const TEXT_FIELDS = ["content", "new_string", "new_source"];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
	raw += chunk;
});
process.stdin.on("end", () => {
	let payload;
	try {
		payload = JSON.parse(raw);
	} catch {
		process.exit(0); // непонятный ввод - не мешаем работать
	}

	const input = payload?.tool_input ?? {};

	// Файлы, которые описывают само правило и обязаны содержать эти символы.
	const path = String(input.file_path ?? input.notebook_path ?? "");
	if (/no-yo-dash\.mjs$/.test(path)) process.exit(0);

	const text = TEXT_FIELDS.map((field) => input[field])
		.filter((value) => typeof value === "string")
		.join("\n");
	if (!text) process.exit(0);

	const problems = [];
	for (const { re, name, fix } of FORBIDDEN) {
		const hits = text.match(re);
		if (hits) problems.push(`${name} - ${hits.length} шт., ${fix}`);
	}
	if (problems.length === 0) process.exit(0);

	console.log(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: "PreToolUse",
				permissionDecision: "deny",
				permissionDecisionReason: `Запрещенные символы в тексте: ${problems.join("; ")}. Перепиши и повтори запись.`,
			},
		}),
	);
	process.exit(0);
});
