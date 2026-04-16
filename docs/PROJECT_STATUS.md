# Project status

**Last updated:** 2026-04-16  
**Phase:** Bootstrap complete; **Slice 1** (persisted shell `activeMode`) shipped; **Slice 2** (explicit session lifecycle) shipped.

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
- Vitest tests: 17 passing across 3 files — UI shell, session lifecycle + domain helpers, database initialization.  
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

## Optional references

Generic AI/process docs live under [`starter_repo/`](../starter_repo/) and are **non-authoritative** for ClassPulse product decisions.
