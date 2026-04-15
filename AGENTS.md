# AGENTS.md

Binding guidance for **humans** and **AI coding assistants** working on **ClassPulse**.

## Read this first (ordered)

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md)  
2. [`docs/V1_SCOPE.md`](docs/V1_SCOPE.md)  
3. [`DECISIONS.md`](DECISIONS.md)  
4. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)  
5. [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md)  

Optional generic workflows (non-product): [`starter_repo/docs/ai/AGENT_STARTUP_CHECKLIST.md`](starter_repo/docs/ai/AGENT_STARTUP_CHECKLIST.md) and [`starter_repo/docs/WORKFLOWS/`](starter_repo/docs/WORKFLOWS/).

## Source-of-truth hierarchy (ClassPulse)

When sources conflict, prefer:

1. Checked-in product and governance docs in **this repo** (`docs/*`, `README.md`, `AGENTS.md`).  
2. **Locked decisions** in [`DECISIONS.md`](DECISIONS.md).  
3. **Explicit slice contracts** and implementation notes captured per slice (see [`docs/SLICE_PLAN.md`](docs/SLICE_PLAN.md)).  
4. Planning notes from chats or local folders **only after** they are distilled into repo docs.  
5. External inspiration — non-authoritative.

If chat planning conflicts with checked-in baseline, **follow the locked product baseline in repo docs** and record the resolution in `DECISIONS.md` / relevant `docs/*` file.

## Hard rules

- **Proof before done:** run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` (or document why a command is N/A) before claiming a slice is complete.  
- **Local-first default:** IndexedDB via Dexie is the live working store; do not introduce Supabase (or other cloud) as primary storage without a new `DECISIONS.md` entry and architecture update.  
- **Smallest safe change:** avoid drive-by refactors and scope creep; keep slices bounded.  
- **No silent reduction:** do not delete meaningful docs or contracts without stating why.

## Stack expectations

- **React + TypeScript + Vite** for the UI.  
- **Dexie** for IndexedDB access.  
- **Vitest + Testing Library** for unit/UI tests (with `fake-indexeddb` where needed).  
- **npm** as the canonical package manager unless `package.json` / lockfiles in-repo say otherwise.

## Definition of done (slice-level)

Work is done when behavior matches the slice contract, verification commands have been run (with evidence), durable docs/decisions are updated if contracts changed, and `docs/PROJECT_STATUS.md` reflects reality.
