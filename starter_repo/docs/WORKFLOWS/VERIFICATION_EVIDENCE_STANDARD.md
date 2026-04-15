# Verification evidence standard (starter)

**Purpose:** Define what counts as proof by change type so "done" claims are inspectable.

Core rule: stronger claims require stronger evidence.

## Evidence ladder

| Rung | Examples | Typical use |
|------|----------|-------------|
| L0 — Repo inspection | Read edited files, confirm links/paths exist | Docs-only changes |
| L1 — Deterministic search | `rg` checks for symbols/paths/single-source rules | Refactors, routing checks |
| L2 — Local checks | Lint, typecheck, unit tests | Code-path changes |
| L3 — Build/integration | Build, smoke tests, integration flows | Multi-surface changes |
| L4 — Data/schema proof | Migration apply/sanity, generated contract checks | Schema/auth/contract-sensitive work |

Higher rungs generally include lower-rung expectations where relevant.

## Minimums by change type

- Docs-only: L0, plus L1 for new/changed path references.
- Code-path: at least L2 for touched surfaces.
- Multi-surface or release-sensitive: L2 + L3.
- Schema/auth/contract-sensitive: L4 with explicit rollback note.

## What does not count

- Model self-assurance without checks.
- Stale logs not tied to edited paths.
- "Should pass" statements without evidence.

## Partial or unverified status

- Partial: list what ran, what passed, and what was not run with reason.
- Unverified: state plainly that checks were not run.
- Waived: include who/what waived and why.

## Related docs

- [AI_TOOL_ROUTING.md](AI_TOOL_ROUTING.md)
- [TICKET_INTAKE_STANDARD.md](TICKET_INTAKE_STANDARD.md)
- [../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md)
- [../templates/AI_REVIEW_PACKET_TEMPLATE.md](../templates/AI_REVIEW_PACKET_TEMPLATE.md)
