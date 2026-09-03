# Прием заявок из формы Tally в GitHub Issue

**Дата:** 2026-09-03
**Спека:** -

## Зачем

Форма на странице «Добавить проект» (компонент `TallyForm.astro`) сейчас
складывает ответы только внутри Tally - их нужно открывать в отдельном
интерфейсе руками. Нужно, чтобы каждая заявка сама
появлялась в GitHub Issues репозитория media.tatarverse.cc, откуда ее обычным
образом берет в работу человек (или агент по `starter-card-review`) и
доводит до карточки. Правка карточки автоматом не публикуется - решение,
что это за проект, какая у него категория и теги, остается за человеком.

## Архитектура

```
Tally (форма D4G9EE)
  → webhook, подписан HMAC (Tally-Signature)
  → Cloudflare Worker (workers/tally-intake/)
      - проверяет подпись
      - пересылает fields[] почти как есть (key, label, type, value,
        options) - НЕ схлопывает в label → value, у полей с выбором
        (чекбоксы, дропдаун) value это id варианта, текст только в options
      - POST /repos/proxima812/media.tatarverse.cc/actions/workflows/
             tally-submission.yml/dispatches  (workflow_dispatch)
  → GitHub Actions (.github/workflows/tally-submission.yml)
      - парсит payload
      - если issue с этим submissionId уже есть - выходит (дедуп на случай
        повторной доставки вебхука Tally)
      - рендерит каждое поле по форме данных (options → текст варианта,
        массив объектов с url/name → ссылка на файл, иначе как есть) и
        прикладывает сырой JSON под спойлер на случай, если рендер ошибся
      - создает Issue с меткой card-submission, needs-review
```

Worker - отдельный деплой (`wrangler deploy`), не часть `astro build`: в
`astro.config.mjs`/`package.json` scripts не заводится, живет как
самостоятельный маленький проект внутри репозитория.

GitHub API дергает **только** `workflow_dispatch` - у токена, который лежит в
Worker, нет прав на запись в контент или создание issue напрямую. Issue
создает сам workflow встроенным `GITHUB_TOKEN` экшена (у него `issues: write`
только на время запуска). Так токен, доступный из Cloudflare, скомпрометировать
менее опасно - им нельзя ничего закоммитить, только запустить один конкретный
workflow.

## Что меняем

- Создать: `workers/tally-intake/src/index.ts` - Worker: проверка подписи
  Tally, сборка payload, вызов `workflow_dispatch`.
- Создать: `workers/tally-intake/wrangler.toml` - конфигурация Worker
  (`name = "tally-intake"`, без кастомного домена в v1 - воркер висит на
  `*.workers.dev`).
- Создать: `workers/tally-intake/package.json`, `tsconfig.json` - независимый
  от корневого `package.json`, свои зависимости (`wrangler` как dev-зависимость
  только внутри этой папки).
- Создать: `workers/tally-intake/README.md` - как задеплоить, какие секреты
  завести (`wrangler secret put TALLY_SIGNING_SECRET`, `wrangler secret put
  GITHUB_TOKEN`), где взять подписывающий ключ в настройках Tally-вебхука.
- Создать: `.github/workflows/tally-submission.yml` - `workflow_dispatch` c
  единственным строковым инпутом `payload` (JSON целиком одной строкой - у
  `workflow_dispatch.inputs` нет типа "объект", поэтому вложенные поля идут
  внутри одной JSON-строки и парсятся уже в шаге экшена, не в YAML-выражении).
- Изменить: `.agents/skills/starter-card-review/SKILL.md` - добавить абзац:
  заявки из формы приходят как Issue с меткой `card-submission` и проходят
  тот же чеклист перед тем, как стать файлом в `src/data/cards/`.
- Разовая ручная настройка вне репозитория (не код, отметить в README воркера):
  - в Tally: Integrations → Webhooks → URL воркера, включить подпись,
    сохранить signing secret;
  - в GitHub: fine-grained PAT, доступ только к этому репозиторию, разрешение
    `Actions: Read and write` и больше ничего.
  - Метки `card-submission`/`needs-review` заводить руками не нужно -
    workflow создает их сам первым прогоном (идемпотентно, игнорирует 422
    "уже существует").

## Чего не трогаем

- `TallyForm.astro` и страницы `add.mdx` (ru и en) - без изменений,
  вебхук настраивается в самой Tally, не в коде встраивания формы.
- Схему `src/content.config.ts` и `src/data/cards/` - воркер и экшен не
  пишут туда ничего и не создают файлы карточек. Ни один файл в `src/`
  этой правкой не появляется.
- Основной `bun run verify`/`build` - Worker не участвует в сборке Astro,
  собственных проверок типов сайта не задевает.
- Права GitHub-токена, лежащего в Worker: только `Actions: Read and write`,
  без `contents`/`issues` - осознанное ограничение блast radius, не расширять
  без явной причины.

## Шаги

- [x] Шаг 1: `.github/workflows/tally-submission.yml` - `workflow_dispatch`,
      `actions/github-script`: парсинг `payload`, ленивое создание меток
      `card-submission`/`needs-review`, поиск существующего issue по
      `submissionId` (через скрытый HTML-маркер в теле), создание issue при
      отсутствии дубля. Не задеплоен на GitHub - файл лежит в рабочей копии,
      дойдет до репозитория обычным коммитом/push.
- [x] Шаг 2: `workers/tally-intake/` - Worker на `fetch`-хэндлере: проверка
      `Tally-Signature` (HMAC-SHA256 через Web Crypto, сравнение
      constant-time), сборка плоского объекта из `data.fields`, вызов
      `POST .../dispatches` с `Authorization: Bearer <GITHUB_TOKEN>`.
- [x] Шаг 3 (частично): локальный прогон - `wrangler dev` + `curl` с
      HMAC-подписанным телом. Проверено: без подписи → 401, неверная
      подпись → 401, верная подпись → доходит до вызова GitHub API (лог
      воркера показывает реальный ответ GitHub, `401 Bad credentials`, так
      как `GITHUB_TOKEN` в `.dev.vars` еще не задан). Не проверено: реальный
      `workflow_dispatch` - нужен PAT и push workflow-файла в GitHub, это
      затрагивает сам репозиторий, делается отдельным шагом с подтверждением.
- [x] Шаг 4: `wrangler deploy` -
      https://tally-intake.kamil-mirikhan.workers.dev, секреты
      `TALLY_SIGNING_SECRET`/`GITHUB_TOKEN` заведены через `wrangler secret
      put`. Прод проверен вручную: неверная подпись - 401, верная -
      202 + реальный workflow_dispatch (issue #1, закрыт как тестовый после
      проверки), повторная отправка того же submissionId - без дубля issue
      даже против закрытого issue.
- [x] Шаг 5 (частично): `.github/workflows/tally-submission.yml` уже на
      `main` (запушен), `GITHUB_TOKEN` заведен. Осталось: вписать URL воркера
      в Tally (Integrations → Webhooks) и сделать одну настоящую заявку через
      форму на `/add`, чтобы проверить путь целиком от реального вебхука
      Tally, а не от ручного curl/dispatch.
- [ ] Шаг 6: дополнить `starter-card-review` абзацем про источник `card-submission`.

## Проверка

- `wrangler dev` + `curl` с образцом payload (валидная и невалидная подпись).
- Реальная заявка через форму на `/add` → issue появился в течение секунд,
  с меткой `card-submission`, `needs-review`, без дублей при повторной
  отправке того же submissionId (симулировать повторной доставкой из Tally
  или ручным вторым вызовом `workflow_dispatch` с тем же payload).
- `bun run verify` в корне репозитория - подтвердить, что Worker и workflow
  не задели сборку сайта (ожидаемо: не задели, но проверить явно).

## Риски

- Tally ограничивает время ответа вебхука (обычно несколько секунд) - Worker
  должен ответить быстро; вызов `workflow_dispatch` - один быстрый POST, но
  если GitHub API подвиснет, воркер должен вернуть ошибку и дать Tally
  ретраить, а не зависать самому (таймаут на fetch внутри воркера).
- Повторная доставка вебхука (обычное поведение Tally при не-200 ответе) без
  дедупа по `submissionId` в экшене создаст дубль issue - дедуп в Шаге 1
  обязателен, не опциональная доработка.
- PAT с `Actions: write` в чужих руках позволяет запускать любой workflow
  репозитория с любым payload - секрет живет только в Cloudflare Worker
  secrets, не коммитится, ротация - через `wrangler secret put` заново.
- Метки `card-submission`/`needs-review` workflow создает сам первым
  прогоном - если понадобится сменить цвет/описание вручную в GitHub,
  workflow это не перезапишет (создание оборачивает 422 "уже существует").
- Первая реальная заявка (issue #2, PRPY62Q) вскрыла баг: Worker схлопывал
  поля в `label → value` и терял `options` - выбор в чекбоксах/дропдауне
  приходил как сырые id вариантов, а поле с файлом превращалось в
  `[object Object]`. Исправлено - Worker пересылает поля почти без
  изменений, рендер (включая мэппинг id → текст варианта по `options`)
  переехал в workflow, там же сырой JSON под спойлер как страховка от
  типов полей, которые эвристика не предусмотрела.
- Ссылки на загруженные файлы (`options`-подобные вложения) в Tally несут
  `accessToken` в query-параметре. Репозиторий публичный - значит ссылка
  на файл, попавшая в тело issue, публично доступна всем, у кого есть URL
  issue. Для логотипов и прочего "публичного по смыслу" контента это
  нормально; если через форму когда-нибудь начнут собирать что-то приватное
  (документы, паспортные данные), это надо будет пересмотреть отдельно -
  не сейчас.
