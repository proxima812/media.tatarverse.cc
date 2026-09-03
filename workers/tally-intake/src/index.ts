/**
 * Принимает вебхук Tally с заявкой на странице /add, проверяет подпись и
 * дергает GitHub `workflow_dispatch` - дальше issue создает сам workflow
 * (см. .github/workflows/tally-submission.yml и
 * docs/superpowers/plans/2026-09-03-tally-submission-intake.md).
 *
 * Токен GitHub, который тут лежит, умеет только запускать этот workflow
 * (право `Actions: Read and write`, без `contents`/`issues`) - создание
 * issue выполняется встроенным токеном самого workflow-запуска, а не этим.
 */

export interface Env {
	readonly TALLY_SIGNING_SECRET: string;
	readonly GITHUB_TOKEN: string;
	readonly GITHUB_OWNER: string;
	readonly GITHUB_REPO: string;
	readonly GITHUB_WORKFLOW_ID: string;
	readonly GITHUB_REF: string;
}

interface TallyField {
	readonly key: string;
	readonly label: string;
	readonly value: unknown;
}

interface TallyWebhookPayload {
	readonly createdAt?: string;
	readonly data?: {
		readonly submissionId?: string;
		readonly responseId?: string;
		readonly formId?: string;
		readonly formName?: string;
		readonly createdAt?: string;
		readonly fields?: readonly TallyField[];
	};
}

async function verifyTallySignature(
	secret: string,
	rawBody: string,
	signatureHeader: string | null,
): Promise<boolean> {
	if (!signatureHeader) return false;

	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
	const expected = base64FromBuffer(mac);

	return timingSafeEqual(expected, signatureHeader);
}

function base64FromBuffer(buffer: ArrayBuffer): string {
	let binary = "";
	for (const byte of new Uint8Array(buffer)) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let mismatch = 0;
	for (let i = 0; i < a.length; i++) {
		mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return mismatch === 0;
}

function flattenFields(fields: readonly TallyField[]): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const field of fields) {
		result[field.label || field.key] = field.value;
	}
	return result;
}

async function dispatchWorkflow(env: Env, dispatchPayload: unknown): Promise<Response> {
	return fetch(
		`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${env.GITHUB_WORKFLOW_ID}/dispatches`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${env.GITHUB_TOKEN}`,
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				"User-Agent": "tally-intake-worker",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ref: env.GITHUB_REF,
				inputs: { payload: JSON.stringify(dispatchPayload) },
			}),
		},
	);
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== "POST") {
			return new Response("Method not allowed", { status: 405 });
		}

		const rawBody = await request.text();

		const signatureValid = await verifyTallySignature(
			env.TALLY_SIGNING_SECRET,
			rawBody,
			request.headers.get("Tally-Signature"),
		);
		if (!signatureValid) {
			return new Response("Invalid signature", { status: 401 });
		}

		let payload: TallyWebhookPayload;
		try {
			payload = JSON.parse(rawBody);
		} catch {
			return new Response("Invalid JSON", { status: 400 });
		}

		const submissionId = payload.data?.submissionId ?? payload.data?.responseId;
		const fields = payload.data?.fields;
		if (!submissionId || !fields) {
			return new Response("Payload missing submissionId or fields", { status: 400 });
		}

		const dispatchPayload = {
			submissionId,
			formId: payload.data?.formId,
			formName: payload.data?.formName,
			submittedAt: payload.data?.createdAt ?? payload.createdAt,
			fields: flattenFields(fields),
		};

		const githubResponse = await dispatchWorkflow(env, dispatchPayload);
		if (!githubResponse.ok) {
			const errorText = await githubResponse.text();
			console.error(`GitHub dispatch failed: ${githubResponse.status} ${errorText}`);
			// 502, не 200 - чтобы Tally повторил доставку позже (дедуп по
			// submissionId на стороне workflow это переживет).
			return new Response("Upstream dispatch failed", { status: 502 });
		}

		return new Response("OK", { status: 202 });
	},
};
