# Project status

**Last updated:** 2026-04-17 (Slice 8 assessments shell MVP lane)  
**Phase:** Bootstrap complete. The local-first foundation shell is already beyond pure scaffold status: **Slice 1** (persisted shell `activeMode`), **Slice 2** (explicit session lifecycle), **Slice 3** (participation quick capture), **Slice 4** (behavior quick capture), **Slice 5** (JSON export + confirmation-gated full replace import), **Slice 6** (bathroom quick capture: out/back events, Dexie `bathroomEvents`, backup parity), **Slice 7** (session-scoped free-form notes on `SessionRecord.sessionNotes`, `NotesPanel`, local persistence + backup parity), and **Slice 8** (assessments shell MVP: session-scoped check-for-understanding pass/fail capture via Dexie `assessmentEvents`, backup parity; no completion timestamps per `DECISIONS.md` D7) are shipped. **Governance parity lane:** repo-native agent OS (startup checklist, closeout, receipts / handoff, sanity runbook, journal) landed separately — see `docs/ai/` and `docs/WORKFLOWS/`.

## What exists today

- Vite + React + TypeScript app with a **minimal live shell** (`AppShell`).  
- Fixed v1 mode strip: **Sleep, Participation, Behavior, Bathroom, Notes, Assessments**.  
- Dexie **IndexedDB** database `classpulse` with schema version **5** (`sessions`, `settings`, `participationEvents`, `behaviorEvents`, `bathroomEvents`, `assessmentEvents`).  
- `SessionRecord` carries persisted `activeMode`, optional `endedAt`, and optional `sessionNotes` (Slice 7); `resolveActiveSession` makes primary-session selection explicit and deterministic.  
- Shell shows a **clear empty state** (no-active-session message + "Start session" button) when no active session exists.  
- Teacher can **start a new session** and **end the active session**.  
- Mode strip is **disabled** when there is no active session.  
- Teacher can persist the active mode on the live session row.  
- Participation panel can **append minimal participation events** and show a recent-events list for the active session.  
- Behavior panel can **append minimal positive / redirect events** and show a recent-events list for the active session.  
- Bathroom panel can **append minimal out (depart) / back (return) events** and show a recent-events list for the active session.  
- Notes panel offers **free-form session notes** for the active session (plain textarea, debounced save to the session row).  
- Assessments panel (Slice 8 MVP) can **append minimal check-for-understanding pass / fail events** keyed to the active session and show a recent-checks list; no completion timestamps.  
- Shell includes **JSON export** of all device-local Dexie rows (`sessions`, `settings`, `participationEvents`, `behaviorEvents`, `bathroomEvents`, `assessmentEvents`) and **JSON import** that **replaces** the local store only after an explicit in-app destructive confirmation (no merge).  
- Standard runtime starts with an **empty local store**; sample seeding exists only as an explicit helper for tests and controlled dev/demo paths.  
- PWA manifest + Workbox service worker emitted on **`npm run build`**.  
- Vitest coverage exists across the app shell, session lifecycle/domain helpers, database helpers, and participation / behavior event flows.  
- GitHub Actions workflow runs install, typecheck, lint, test, and build.

## Locked product guidance baseline

- Canonical v1 guidance now lives in:
  - `docs/contracts/classpulse_v1_data_model_and_session_lifecycle.md`
  - `docs/contracts/classpulse_v1_event_tag_contract.md`
- These contracts lock the current planning baseline:
  - local save without required login
  - optional Google-connected backup/export
  - session-first data model
  - explicit session closure
  - backgrounding as checkpoint only
  - small fixed starter event/tag vocabulary
- The currently shipped shell predates parts of that contract baseline in one important way: it still persists separate `participationEvents`, `behaviorEvents`, `bathroomEvents`, and (as of Slice 8) `assessmentEvents`. Future slices should converge toward the canonical contract rather than treating the current split as final.

## What is intentionally not built yet

- Google-connected backup/export flows or OAuth.  
- Class/course roster model aligned to the new contract baseline.  
- Rich assessments beyond the Slice 8 quick check-for-understanding signal (no rubrics, standards alignment, or student-keyed capture yet).  
- Teacher-editable event pack editor.  
- Reports, analytics, transcripts, and hall-pass integrations.  
- Assessment completion timestamps (scheduled post-true-v1 per `DECISIONS.md` D7).  
- Session list / multi-session dashboard.

## Next focus

With **Slice 8 — Assessments shell MVP** shipped, the next bounded product focus is open for Control Tower selection. Optional **Google-connected backup/export** remains the named longer-term durability layer (`DECISIONS.md` D10) and lands **after** local JSON backup/restore without changing v1 replace semantics. Convergence of `participationEvents` / `behaviorEvents` / `bathroomEvents` / `assessmentEvents` toward a unified `ObservationEvent` remains a tracked later-convergence item (not an active slice).

The project is **ready for a separate Control Tower orchestration chat** when the operator wants it; **implementation lanes still follow checked-in repo truth**, not chat memory. Links live under **Agent operating model** below.

## Process posture (strategy alignment)

- **Governance parity** (startup checklist, closeout, receipts, handoff standard, sanity runbook) is treated as **complete and sufficient for now**.  
- **Optional governance automation** (e.g. scripted handoff rebuild locks) stays **deferred** — **do not reopen** that lane unless receipt/handoff automation is **clearly** worth the complexity.  
- Prefer **fresh bounded slice chats** for new implementation work, aligned to `docs/SLICE_PLAN.md`.  
- **External research** is **advisory only** until distilled into repo docs (see `AGENTS.md` source-of-truth hierarchy).

## Agent operating model (repo-native)

- **Startup:** [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](ai/AGENT_STARTUP_CHECKLIST.md)  
- **Control Tower (orchestration):** [`docs/WORKFLOWS/CONTROL_TOWER.md`](WORKFLOWS/CONTROL_TOWER.md) · opening checklist [`docs/templates/CONTROL_TOWER_CHECK_TEMPLATE.md`](templates/CONTROL_TOWER_CHECK_TEMPLATE.md)  
- **Closeout:** [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](WORKFLOWS/POST_CHAT_CLOSEOUT.md)  
- **Handoff / receipts:** [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](WORKFLOWS/AGENT_HANDOFF_STANDARD.md), [`docs/ai/AGENT_HANDOFF.md`](ai/AGENT_HANDOFF.md), [`docs/ai/run_receipts/`](ai/run_receipts/)  
- **Verification defaults:** [`docs/RUNBOOK_SanityChecks.md`](RUNBOOK_SanityChecks.md)  
- **Process journal (optional):** [`docs/AI_DEV_JOURNAL.md`](AI_DEV_JOURNAL.md)

## Optional references

[`starter_repo/`](../starter_repo/) remains an **optional**, **non-authoritative** seed library, not the ClassPulse operating source of truth.
