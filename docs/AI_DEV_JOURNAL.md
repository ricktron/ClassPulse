# AI dev journal (ClassPulse)

**Purpose:** Append-only **reflection** on building this repo with AI — patterns that worked, steering corrections, and durable prompting rules.

**Not** a substitute for [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md) (operational snapshot) or [`DECISIONS.md`](../DECISIONS.md) (commitments).

**Raw material (not a guide):** preserve enough structured detail about **process used**, **what changed**, **what was verified**, and **what to repeat or avoid** that a lesson can be reconstructed without a transcript — without turning routine sessions into essays.

## Rules

- Append new entries at the **bottom**.  
- One entry per **meaningful** closeout session (or governance pass) unless a single session clearly covers multiple unrelated lessons (then prefer separate dated titles).  
- No raw transcript dumps; link paths and commands instead.

## Entry template

```markdown
## YYYY-MM-DD — short title

**Scope**
- ...

**What changed**
- ...

**Verified**
- `command` → outcome

**What worked**
- ...

**What needed tighter steering**
- ...

**Next time**
- ...
```

---

## 2026-04-15 — Repo-native governance spine (Forge-style operating model)

**Scope**

- Bring ClassPulse repo operating behavior up toward Project Forge parity: startup checklist, closeout, handoff/receipt flow, sanity runbook, and role separation among status, journal, decisions, receipts, and handoff — **without** product feature work or editing Forge.

**What changed**

- Added `docs/ai/` (startup checklist, failure taxonomy, `AGENT_HANDOFF.md`, `run_receipts/`) and `docs/WORKFLOWS/` (closeout, handoff standard, verification ladder, engineering session habits).  
- Added `docs/RUNBOOK_SanityChecks.md`, templates under `docs/templates/`, and strengthened root `AGENTS.md` to point at repo-native paths (not `starter_repo` as primary OS).

**Verified**

- `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` — see run receipt `docs/ai/run_receipts/2026-04-15T220000Z--governance-repo-os-parity--c8e4a1f2.md`.

**What worked**

- Keeping receipts as immutable audit inputs and treating `AGENT_HANDOFF.md` as derived keeps PM-upload narrative honest.

**What needed tighter steering**

- Avoid duplicating the full numbered startup list outside `docs/ai/AGENT_STARTUP_CHECKLIST.md`.

**Next time**

- If handoff volume grows, consider lock-safe rebuild automation; until then, manual derivation from receipts remains the contract.
