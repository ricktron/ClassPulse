# ClassPulse

Local-first classroom observation and participation notebook for teachers. This repository is the **ClassPulse** app and product docs; an optional **starter_repo/** tree preserves generic Forge-style operating workflows for reuse.

## Quick start

```bash
npm install
npm run dev
```

## Scripts

| Script        | Purpose                          |
|---------------|----------------------------------|
| `npm run dev` | Vite dev server                    |
| `npm run build` | Production build + PWA assets  |
| `npm run preview` | Serve production build locally |
| `npm run typecheck` | Project references typecheck |
| `npm run lint`    | ESLint (flat config)         |
| `npm run test`    | Vitest (jsdom + fake-indexeddb) |

## Where to read next

1. [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) — what ClassPulse is.  
2. [`docs/V1_SCOPE.md`](docs/V1_SCOPE.md) — true v1 vs later.  
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — local-first layout.  
4. [`DECISIONS.md`](DECISIONS.md) — durable commitments.  
5. [`docs/SLICE_PLAN.md`](docs/SLICE_PLAN.md) — how bounded implementation chats should land.

Human/agent rules: [`AGENTS.md`](AGENTS.md). Current status: [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

## PWA notes

- `vite-plugin-pwa` generates the service worker on **`npm run build`** (disabled in dev by default).  
- Install surfaces on iPad Safari benefit from future dedicated PNG touch icons; the manifest currently references `favicon.svg` as a deliberate lightweight baseline.

## Starter seed

[`starter_repo/`](starter_repo/) is a non-authoritative **optional** process library copied from Project Forge. ClassPulse product truth lives under `docs/` and `DECISIONS.md` at the repository root.
