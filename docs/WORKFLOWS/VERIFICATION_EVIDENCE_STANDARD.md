# Verification evidence standard (ClassPulse)

**Purpose:** Define what counts as proof by change type so “done” claims are inspectable.

Core rule: stronger claims require stronger evidence.

## Evidence ladder

| Rung | Examples | Typical use |
|------|----------|-------------|
| L0 — Repo inspection | Read edited files, confirm links / paths exist | Docs-only changes |
| L1 — Deterministic search | `rg` checks for symbols / paths / single-source rules | Refactors, routing checks |
| L2 — Local checks | Lint, typecheck, unit tests | Code-path changes |
| L3 — Build / integration | Production build, broader smoke | Multi-surface changes |

Higher rungs generally include lower-rung expectations where relevant.

ClassPulse default L2 + L3 for code changes: `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` (or documented waiver with reason).

## Minimums by change type

- Docs-only: L0, plus L1 for new or changed path references.  
- Code-path: at least L2 for touched surfaces.  
- Multi-surface or release-sensitive: L2 + L3.

## What does not count

- Model self-assurance without checks.  
- Stale logs not tied to edited paths.  
- “Should pass” statements without evidence.

## Partial or unverified status

- **Partial:** list what ran, what passed, and what was not run with reason.  
- **Unverified:** state plainly that checks were not run.  
- **Waived:** include who / what waived and why.

## Related docs

- [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md)  
- [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md)  
- [`AGENTS.md`](../../AGENTS.md)
