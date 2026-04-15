# Project status

**Last updated:** 2026-04-15  
**Phase:** Repository bootstrap complete — scaffold + docs spine + CI baseline.

## What exists today

- Vite + React + TypeScript app with a **minimal live shell** (`AppShell`).  
- Dexie **IndexedDB** database `classpulse` with schema version **1** (`sessions`, `settings`).  
- Sample seed session when the DB is empty (development clarity only).  
- PWA manifest + Workbox service worker emitted on **`npm run build`**.  
- Vitest tests covering UI shell rendering and database initialization/seed idempotency.  
- GitHub Actions workflow running install, typecheck, lint, test, and build.

## What is intentionally not built yet

- Mode buttons are **read-only** UI placeholders (no writes from the strip).  
- JSON import/export flows.  
- Google Workspace backup or OAuth.  
- Reports, analytics, transcripts, hall-pass integrations.  
- Assessment completion timestamps (scheduled post–true v1 per `DECISIONS.md` D7).

## Next focus

See **Slice 1** in [`docs/SLICE_PLAN.md`](SLICE_PLAN.md): wire mode navigation to Dexie with explicit persistence rules and tests.

## Optional references

Generic AI/process docs live under [`starter_repo/`](../starter_repo/) and are **non-authoritative** for ClassPulse product decisions.
