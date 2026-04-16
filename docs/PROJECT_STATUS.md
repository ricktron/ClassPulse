# Project status

**Last updated:** 2026-04-16  
**Phase:** Bootstrap complete. The local-first foundation shell is already beyond pure scaffold status: **Slice 1** (persisted shell `activeMode`), **Slice 2** (explicit session lifecycle), **Slice 3** (participation quick capture), and **Slice 4** (behavior quick capture) are shipped. **Governance parity lane:** repo-native agent OS (startup checklist, closeout, receipts / handoff, sanity runbook, journal) landed separately — see `docs/ai/` and `docs/WORKFLOWS/`.

## What exists today

- Vite + React + TypeScript app with a **minimal live shell** (`AppShell`).  
- Fixed v1 mode strip: **Sleep, Participation, Behavior, Bathroom, Notes, Assessments**.  
- Dexie **IndexedDB** database `classpulse` with schema version **3** (`sessions`, `settings`, `participationEvents`, `behaviorEvents`).  
- `SessionRecord` carries persisted `activeMode` and optional `endedAt`; `resolveActiveSession` makes primary-session selection explicit and deterministic.  
- Shell shows a **clear empty state** (no-active-session message + "Start session" button) when no active session exists.  
- Teacher can **start a new session** and **end the active session**.  
- Mode strip is **disabled** when there is no active session.  
- Teacher can persist the active mode on the live session row.  
- Participation panel can **append minimal participation events** and show a recent-events list for the active session.  
- Behavior panel can **append minimal positive / redirect events** and show a recent-events list for the active session.  
- Standard runtime starts with an **empty local store**; sample seeding exists only as an explicit helper for tests and controlled dev/demo paths.  
- PWA manifest + Workbox service worker emitted on **`npm run build`**.  
- Vitest coverage exists across the app shell, session lifecycle/domain helpers, database helpers, and participation / behavior event flows.  
- GitHub Actions workflow runs install, typecheck, lint, test, and build.

## What is intentionally not built yet

- JSON import/export flows.  
- Bathroom, Notes, and Assessments capture surfaces beyond the mode strip placeholders.  
- Teacher-editable event pack editor.  
- Google Workspace backup or OAuth.  
- Reports, analytics, transcripts, and hall-pass integrations.  
- Assessment completion timestamps (scheduled post-true-v1 per `DECISIONS.md` D7).  
- Session list / multi-session dashboard.

## Next focus

**Slice 5** — JSON export + confirmed import replace: implement the v1 backup contract so the local-first promise has a teacher-usable recovery path.

## Agent operating model (repo-native)

- **Startup:** [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](ai/AGENT_STARTUP_CHECKLIST.md)  
- **Closeout:** [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](WORKFLOWS/POST_CHAT_CLOSEOUT.md)  
- **Handoff / receipts:** [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](WORKFLOWS/AGENT_HANDOFF_STANDARD.md), [`docs/ai/AGENT_HANDOFF.md`](ai/AGENT_HANDOFF.md), [`docs/ai/run_receipts/`](ai/run_receipts/)  
- **Verification defaults:** [`docs/RUNBOOK_SanityChecks.md`](RUNBOOK_SanityChecks.md)  
- **Process journal (optional):** [`docs/AI_DEV_JOURNAL.md`](AI_DEV_JOURNAL.md)

## Optional references

[`starter_repo/`](../starter_repo/) remains an **optional**, **non-authoritative** seed library, not the ClassPulse operating source of truth.
