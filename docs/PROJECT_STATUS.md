# Project status

**Last updated:** 2026-04-15  
**Phase:** Bootstrap complete; **Slice 1** (persisted shell `activeMode`) shipped; **Slice 2** (explicit session lifecycle) shipped. **Governance parity lane:** repo-native agent OS (startup checklist, closeout, receipts / handoff, sanity runbook, journal) landed — see `docs/ai/` and `docs/WORKFLOWS/`.

## What exists today

- Vite + React + TypeScript app with a **minimal live shell** (`AppShell`).  
- Dexie **IndexedDB** database `classpulse` with schema version **1** (`sessions`, `settings`).  
- `SessionRecord` carries `endedAt?: string`; active sessions have no `endedAt`.  
- `isActiveSession` and `resolveActiveSession` helpers in `src/domain/session.ts` make primary-session selection explicit and deterministic.  
- Shell shows a **clear empty state** (no-active-session message + "Start session" button) when no active session exists.  
- Teacher can **start a new session** (creates a `SessionRecord`, `activeMode` defaults to `participation`).  
- Teacher can **end the active session** (sets `endedAt`; shell returns to empty state).  
- Mode strip is **disabled** when there is no active session.  
- PWA manifest + Workbox service worker emitted on **`npm run build`**.  
- Vitest tests: 35 passing across 7 files — UI shell, session lifecycle + domain helpers, database initialization, and additional coverage as the tree grows.  
- GitHub Actions workflow running install, typecheck, lint, test, and build.

## What is intentionally not built yet

- JSON import/export flows.  
- Google Workspace backup or OAuth.  
- Reports, analytics, transcripts, hall-pass integrations.  
- Assessment completion timestamps (scheduled post–true v1 per `DECISIONS.md` D7).
- Session list / multi-session dashboard.
- Event/participation capture per session.

## Next focus

**Slice 3** — JSON export + confirmed import replace: implement the v1 backup contract (see [`docs/SLICE_PLAN.md`](SLICE_PLAN.md)).

## Agent operating model (repo-native)

- **Startup:** [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](ai/AGENT_STARTUP_CHECKLIST.md)  
- **Closeout:** [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](WORKFLOWS/POST_CHAT_CLOSEOUT.md)  
- **Handoff / receipts:** [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](WORKFLOWS/AGENT_HANDOFF_STANDARD.md), [`docs/ai/AGENT_HANDOFF.md`](ai/AGENT_HANDOFF.md), [`docs/ai/run_receipts/`](ai/run_receipts/)  
- **Verification defaults:** [`docs/RUNBOOK_SanityChecks.md`](RUNBOOK_SanityChecks.md)  
- **Process journal (optional):** [`docs/AI_DEV_JOURNAL.md`](AI_DEV_JOURNAL.md)

## Optional references

[`starter_repo/`](../starter_repo/) remains an **optional**, **non-authoritative** seed library — not the ClassPulse operating source of truth.
