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
  db/            # Dexie database + seed helpers
  features/      # Vertical slices (UI + behaviors), e.g. shell/
  test/          # Shared test setup
```

Future slices should add **feature folders** under `src/features/<slice>/` rather than growing a monolithic `components/` tree without intent.

## Data model (scaffold)

Version **1** Dexie schema:

- `sessions` — one row per class meeting (`SessionRecord`).  
- `settings` — keyed documents, including `schemaVersion`.

The scaffold seeds a **sample session** only when the database is empty so first-run UX is intelligible. Production import/export flows **replace** local state per `docs/V1_SCOPE.md`.

## Service boundaries

- **No network dependency** for the core shell.  
- Optional future connectors (e.g., Google Workspace backup) must remain **adapters** behind stable local interfaces — not silent primary storage.

## Build outputs

- `npm run build` emits optimized static assets under `dist/` plus Workbox-generated service worker files for offline caching of the shell.
