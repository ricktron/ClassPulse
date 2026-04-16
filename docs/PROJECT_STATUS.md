# Project status

**Last updated:** 2026-04-15  
**Phase:** Bootstrap complete; **Slice 1** (persisted shell `activeMode`) shipped.

## What exists today

- Vite + React + TypeScript app with a **minimal live shell** (`AppShell`).  
- Dexie **IndexedDB** database `classpulse` with schema version **1** (`sessions`, `settings`).  
- Sample seed session when the DB is empty (development clarity only); default `activeMode` is **Participation**.  
- PWA manifest + Workbox service worker emitted on **`npm run build`**.  
- Vitest tests covering UI shell rendering, mode persistence, and database initialization/seed idempotency.  
- GitHub Actions workflow running install, typecheck, lint, test, and build.

## What is intentionally not built yet

- Session lifecycle beyond a single primary row (create/end, session list).  
- JSON import/export flows.  
- Google Workspace backup or OAuth.  
- Reports, analytics, transcripts, hall-pass integrations.  
- Assessment completion timestamps (scheduled post–true v1 per `DECISIONS.md` D7).

## Next focus

**Slice 1 (mode strip → Dexie)** is implemented: interactive strip, `sessions.activeMode` persistence, reload restores mode. Next: **Slice 2** session lifecycle (see [`docs/SLICE_PLAN.md`](SLICE_PLAN.md)).

## Optional references

Generic AI/process docs live under [`starter_repo/`](../starter_repo/) and are **non-authoritative** for ClassPulse product decisions.
