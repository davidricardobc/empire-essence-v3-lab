## [ERR-20260719-001] playwright_check_missing_dependency

**Logged**: 2026-07-19T18:31:00Z
**Priority**: low
**Status**: pending
**Area**: tests

### Summary
Playwright visual smoke check could not run because this project does not have `playwright` installed.

### Error
```text
Error: Cannot find module 'playwright'
```

### Context
- Command attempted: local Node script requiring `playwright` to inspect `/catalogo`.
- Project: Empire Essence V3 lab.

### Suggested Fix
Use existing validation commands for now. Add a dedicated visual smoke dependency/script only if visual regression checks become part of the project workflow.

### Metadata
- Reproducible: yes
- Related Files: package.json

---

## [ERR-20260818-001] git_push_https_auth

**Logged**: 2026-08-18T14:52:43-05:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
`git push origin main` failed because the HTTPS remote could not request GitHub credentials in the non-interactive OpenClaw shell.

### Error
```text
fatal: could not read Username for 'https://github.com': No such device or address
```

### Context
- Command attempted: `git push origin main`
- Project: Empire Essence V3 lab
- Remote: `https://github.com/davidricardobc/empire-essence-v3-lab.git`
- Environment: non-interactive shell without a configured Git credential helper for GitHub HTTPS.

### Suggested Fix
Use the locally stored GitHub token through a temporary credential path or configure `gh auth setup-git` without printing or storing secrets in the repo.

### Metadata
- Reproducible: yes
- Related Files: none

---

## [ERR-20260731-002] playwright_available_outside_project

**Logged**: 2026-07-31T17:49:00Z
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary
`require("playwright")` failed inside the Empire Essence V3 repo because Playwright is not a project dependency, but it is available from the OpenClaw workspace Node environment.

### Error
```text
Error: Cannot find module 'playwright'
```

### Context
- Command attempted: local visual QA script from the product repo.
- Project: Empire Essence V3 lab.
- Resolution used: run the Node script from `/home/ricardo/.openclaw/workspace`, where Playwright resolves correctly.

### Suggested Fix
For ad hoc visual QA, run Playwright scripts from the OpenClaw workspace. Add Playwright to the project only if visual smoke tests become a committed project workflow.

### Metadata
- Reproducible: yes
- Related Files: package.json

---

## [ERR-20260731-003] pkill_self_match

**Logged**: 2026-07-31T17:49:00Z
**Priority**: low
**Status**: resolved
**Area**: infra

### Summary
A `pkill -f` restart command can match its own shell command and terminate the wrapper before cleanup finishes.

### Error
```text
Command exited with code -1 after matching the active shell process.
```

### Context
- Command attempted: stop a local Next.js dev server for Empire Essence V3.
- Resolution used: list PIDs with `ps` and stop those concrete PIDs with `kill`.

### Suggested Fix
Avoid broad `pkill -f` patterns in this workspace. Use `ps` plus explicit PIDs, or a pattern that cannot match the command itself.

### Metadata
- Reproducible: yes
- Related Files: none

---

## [ERR-20260731-004] next_dev_cache_move_race

**Logged**: 2026-07-31T17:49:00Z
**Priority**: medium
**Status**: resolved
**Area**: tests

### Summary
Moving `.next/dev` immediately after stopping `next dev` can fail if Next telemetry still touches an `_events_*.json` file.

### Error
```text
mv: cannot stat '.next/dev/_events_75156.json': No such file or directory
```

### Context
- Command attempted: move generated `.next/dev` cache before validation.
- Impact: `npm run typecheck` later read stale corrupted dev types until `.next/dev` was moved again after all Next processes exited.

### Suggested Fix
After stopping `next dev`, confirm no matching Next/telemetry processes remain, then move `.next/dev`. If the move races, check process state and retry before running typecheck.

### Metadata
- Reproducible: yes
- Related Files: .next/dev, tsconfig.json

---

## [ERR-20260731-001] next_dev_generated_types_cache

**Logged**: 2026-07-31T17:02:00Z
**Priority**: medium
**Status**: pending
**Area**: tests

### Summary
`npm run typecheck` failed because `.next/dev/types/validator.ts` was corrupted while `next dev` was running.

### Error
```text
.next/dev/types/validator.ts(143,1): error TS1434: Unexpected keyword or identifier.
.next/dev/types/validator.ts(145,8): error TS1005: ';' expected.
.next/dev/types/validator.ts(146,1): error TS1128: Declaration or statement expected.
```

### Context
- Command attempted: `npm run typecheck` in Empire Essence V3 lab.
- `tsconfig.json` includes `.next/dev/types/**/*.ts`, so generated dev types are part of TypeScript validation.
- The generated file contained a broken fragment (`peof handler>`), likely produced while the dev server was writing cache files.

### Suggested Fix
Before typecheck/build validation, stop `next dev` or move `.next/dev` to a recoverable `/tmp` location. Re-run `npm run typecheck` after the generated cache is clean.

### Metadata
- Reproducible: unknown
- Related Files: tsconfig.json, .next/dev/types/validator.ts

---

## [ERR-20260719-004] python_not_available_for_doc_patch

**Logged**: 2026-07-20T01:22:00Z
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
Attempted to use `python` for a simple documentation replacement, but Python is not available in this environment.

### Error
```text
/bin/bash: line 1: python: command not found
```

### Context
- Command attempted: replace `Commit: Pendiente` in the autonomous cron log after creating Job 04 commit.
- Project: Empire Essence V3 lab.

### Suggested Fix
Use `apply_patch` for small documentation edits instead of Python one-liners.

### Metadata
- Reproducible: yes
- Related Files: docs/autonomous-24h-cron-log.md

---

## [ERR-20260719-003] printf_leading_dash

**Logged**: 2026-07-19T23:49:00Z
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
`printf` failed when the format string started with `-`, because Bash interpreted it as an option.

### Error
```text
/bin/bash: line 1: printf: - : invalid option
printf: usage: printf [-v var] format [arguments]
```

### Context
- Command attempted: append a heartbeat note line beginning with `-` into the daily note.
- Project: OpenClaw workspace heartbeat maintenance.

### Suggested Fix
Use `printf '%s\n' 'text starting with dash'` when appending bullet lines.

### Metadata
- Reproducible: yes
- Related Files: none

---

## [ERR-20260719-002] rg_permission_denied

**Logged**: 2026-07-19T18:40:00Z
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
`rg` failed because the OpenClaw Codex bundled `codex-path/rg` binary returned permission denied.

### Error
```text
/home/ricardo/.openclaw/npm/node_modules/@openclaw/codex/node_modules/@openai/codex-linux-x64/vendor/x86_64-unknown-linux-musl/codex-path/rg: Permission denied
```

### Context
- Command attempted: project source search in Empire Essence V3 lab.
- Fallback used: `grep` and `find`.
- Recurrence: happened again on 2026-08-12 while searching Wompi env variables; `find` + `grep` fallback worked.
- Recurrence: happened again on 2026-08-18 while verifying the production deployment; `find` + `grep` fallback worked.

### Suggested Fix
Repair executable permissions for the bundled `rg` or route searches to the system `grep/find` fallback when this environment issue appears.

### Metadata
- Reproducible: unknown
- Related Files: none

---
