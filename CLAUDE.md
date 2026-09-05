# CLAUDE.md

Правила этого репозитория - в [`AGENTS.md`](./AGENTS.md).

Специализированные скиллы - в `.agents/skills/starter-*/SKILL.md`
(Claude Code видит их через симлинки в `.claude/skills/`).

## Agent skills

### Issue tracker

Issues живут в GitHub Issues репозитория `proxima812/media.tatarverse.cc` (через `gh` CLI). См. `docs/agents/issue-tracker.md`.

### Triage labels

Дефолтный словарь: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. См. `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` и `docs/adr/` в корне репозитория. См. `docs/agents/domain.md`.
