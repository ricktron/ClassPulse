# Architecture — ClassPulse

## Goals

- **Local-first:** classroom reliability beats cloud convenience for the live shell.  
- **Slice-friendly:** small, verifiable changes with obvious file homes.  
- **PWA-ready:** service worker + Web App Manifest produced on production builds.

## Runtime stack

| Layer        | Choice                         | Notes |
|--------------|--------------------------------|-------|
| UI           | React + TypeScript             | Functional components, strict typing. |
| Bundler      | Vite 7.x                       | Pinned while `vite-plugin-pwa` peers omit Vite 8; upgrade when the plugin publishes compatible peers. |
| Client data  | Dexie on IndexedDB             | Primary working store for v1. |
| PWA          | `vite-plugin-pwa`              | Disabled in dev by default; emits SW on `npm run build`. |
| Tests        | Vitest + Testing Library       | `fake-indexeddb` for Node-based IDB tests. |

**React Router** is intentionally omitted until a slice proves multi-route navigation materially simplifies teacher workflows.

## Repository layout

```
src/
  domain/        # Types, enums, and cross-cutting contracts
  db/            # Dexie database + helpers
  features/      # Vertical slices (UI + behaviors), e.g. shell/
  test/          # Shared test setup
```

Future slices should add **feature folders** under `src/features/<slice>/` rather than growing a monolithic `components/` tree without intent.

## Data model (current scaffold)

Current Dexie schema version: **3**.

Tables:

- `sessions` — one row per class meeting (`SessionRecord`), including persisted `activeMode` and optional `endedAt`.  
- `settings` — keyed documents, including `schemaVersion`.  
- `participationEvents` — append-only quick-capture participation rows keyed to a session.  
- `behaviorEvents` — append-only quick-capture behavior rows keyed to a session.

The standard app runtime currently starts with an **empty local store** and presents an explicit empty state until the teacher starts a session. `seedSampleDataIfEmpty()` exists as an explicit helper for tests and controlled dev/demo paths; it is **not** part of the normal runtime bootstrap.

Production import/export flows still follow the contract in `docs/V1_SCOPE.md`: JSON is authoritative, and import replaces local data after explicit confirmation.

## Service boundaries

- **No network dependency** for the core shell.  
- Optional future connectors (e.g. Google Workspace backup) must remain **adapters** behind stable local interfaces, not silent primary storage.

## Build outputs

- `npm run build` emits optimized static assets under `dist/` plus Workbox-generated service worker files for offline caching of the shell.
