## [ERR-20260719-001] npm_run_lint

**Logged**: 2026-07-19T04:15:00-05:00
**Priority**: high
**Status**: resolved
**Area**: config

### Summary
`npm run lint` failed because ESLint tried to scan a missing generated `.artifacts` directory.

### Error
```text
Error: ENOENT: no such file or directory, scandir '/mnt/c/CODEX/Empire Essence V3/empire-essence-v3-lab/.artifacts'
```

### Context
- Command/operation attempted: `npm run lint`
- Environment: Empire Essence V3 lab on WSL path backed by Windows filesystem.
- Impact: preproduction validation could fail even when source files are valid.

### Suggested Fix
Keep generated/transient folders explicitly ignored in `eslint.config.mjs`.

### Metadata
- Reproducible: yes
- Related Files: eslint.config.mjs

### Resolution
- **Resolved**: 2026-07-19T04:16:00-05:00
- **Notes**: Added explicit ignores for `.artifacts`, build outputs and dependency folders.

---
