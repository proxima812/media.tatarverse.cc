# tally-intake

Cloudflare Worker: принимает вебхук Tally с формы на `/add`, проверяет
подпись и дергает GitHub `workflow_dispatch`, который создает issue с
заявкой. Подробности и риски - `docs/superpowers/plans/
2026-09-03-tally-submission-intake.md`.

Отдельный деплой, не часть сборки Astro (`astro build` этой папки не видит).

## Локальная разработка

```bash
cd workers/tally-intake
bun install
bun run dev   # wrangler dev, поднимает воркер локально
```

Секреты для `wrangler dev` берутся из `.dev.vars` (не коммитится - см.
`.dev.vars.example` для списка ключей). `TALLY_SIGNING_SECRET` уже задан
локально; `GITHUB_TOKEN` нужно добавить перед проверкой полного цикла
(до этого запросы честно проверяют подпись и падают на вызове GitHub API -
это ожидаемо для теста подписи).

Тест сигнатуры без реального Tally - посчитать HMAC-SHA256 тела запроса
на `TALLY_SIGNING_SECRET` и передать в заголовке `Tally-Signature`
(значение - base64 от HMAC):

```bash
node -e '
const crypto = require("crypto");
const secret = "<значение TALLY_SIGNING_SECRET>";
const body = JSON.stringify({
  data: {
    submissionId: "local-test-1",
    formId: "D4G9EE",
    formName: "media.tatarverse - авторы",
    fields: [{ key: "q1", label: "Имя", type: "INPUT_TEXT", value: "Тест" }],
  },
});
const sig = crypto.createHmac("sha256", secret).update(body).digest("base64");
console.log(JSON.stringify({ body, sig }));
'
```

Полученные `body`/`sig` - в `curl`:

```bash
curl -i http://localhost:8787 \
  -H "Tally-Signature: <sig>" \
  -H "Content-Type: application/json" \
  -d '<body>'
```

Неверная подпись - `401`. Верная, но без `GITHUB_TOKEN` - дойдет до вызова
GitHub API и вернет `502` (см. лог `wrangler dev` - там видно, что именно
ответил GitHub).

## Прод-деплой

```bash
bun run deploy
wrangler secret put TALLY_SIGNING_SECRET
wrangler secret put GITHUB_TOKEN
```

`GITHUB_TOKEN` - fine-grained PAT, доступ ограничен репозиторием
`proxima812/media.tatarverse.cc`, единственное право - `Actions: Read and
write`. Без `contents`/`issues` - создание issue делает встроенный токен
самого workflow-запуска, этому токену для этого прав не нужно.

После деплоя URL воркера (`https://tally-intake.<subdomain>.workers.dev`)
указывается в Tally: Integrations → Webhooks → URL, там же включить подпись
и сверить signing secret с тем, что лежит в `TALLY_SIGNING_SECRET`.

## Переменные

Не секреты, лежат в `wrangler.toml` `[vars]`: `GITHUB_OWNER`, `GITHUB_REPO`,
`GITHUB_WORKFLOW_ID`, `GITHUB_REF` - на какой репозиторий/workflow/ветку
дергать `workflow_dispatch`.
