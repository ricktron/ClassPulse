# Control Tower lane (ClassPulse)

**Purpose:** Repo-native **orchestration** for ClassPulse work across chats — **not** a coding lane. Control Tower reads checked-in truth, aligns bounded slices, and records outcomes through receipts and handoff without inventing scope.

**Lighter than Forge:** No standing bureaucracy. Same proof-before-done expectations as [`AGENTS.md`](../../AGENTS.md) and [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md) when Control Tower sessions touch the tree.

---

## What Control Tower is

- A **coordination lane** that picks, sequences, or **confirms** the **smallest safe next** bounded slice (see [`docs/SLICE_PLAN.md`](../SLICE_PLAN.md), [`DECISIONS.md`](../../DECISIONS.md)).
- A **reader** of repo hierarchy: canon docs → locked decisions → slice contracts → runbooks/status → distilled notes. See source order in [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](../ai/AGENT_STARTUP_CHECKLIST.md) and hierarchy in [`AGENTS.md`](../../AGENTS.md).
- A **consumer** of immutable receipts and the derived [`docs/ai/AGENT_HANDOFF.md`](../ai/AGENT_HANDOFF.md), plus [`docs/PROJECT_STATUS.md`](../PROJECT_STATUS.md), to understand what already happened and what was verified.

## What Control Tower is not

- **Not** where application features are implemented (use bounded **implementation** slice chats; follow [`docs/WORKFLOWS/ENGINEERING_SESSION_HABITS.md`](ENGINEERING_SESSION_HABITS.md)).
- **Not** where major direction or new decision locks are invented midstream (that belongs in **strategy** lane, captured in `DECISIONS.md` / scope docs when agreed).
- **Not** authoritative for product truth by itself — **checked-in files** win on conflict.
- **Not** a prompt library or substitute for reading the repo.

---

## Lanes at a glance

| Lane | Role | Authority |
|------|------|-----------|
| **Strategy** | Major direction, tradeoffs, **locking** commitments | Updates `DECISIONS.md`, scope/brief when choices are durable |
| **Research / analysis** | External scan, competitive notes, technical spikes **as input** | **Advisory** until distilled into repo canon (see [`AGENTS.md`](../../AGENTS.md) hierarchy) |
| **Control Tower** | Orchestration: confirm next slice, guard scope, absorb slice reports | **Orchestration only** — defers to repo + receipts |
| **Bounded implementation** | Execute one slice contract; ship code/docs/tests with proof | Slice contract + `DECISIONS.md` + contracts |

**Research cannot silently override** locked decisions. If research implies a change, the path is: document the finding → **strategy or explicit decision update** → then implementation — not “ship from chat.”

---

## Operating loop (practical)

1. **Read** — `AGENTS.md`, `DECISIONS.md`, `docs/PROJECT_BRIEF.md`, `docs/V1_SCOPE.md`, `docs/PROJECT_STATUS.md`, `docs/SLICE_PLAN.md`, latest relevant receipts under `docs/ai/run_receipts/`, then `docs/ai/AGENT_HANDOFF.md`.
2. **Reconcile** — If chat memory or pasted text conflicts with the tree, **the tree wins** unless a real error is found; then fix docs with a small, explicit change (and decision entry if commitments move).
3. **Choose next slice** — Prefer the **smallest** increment that matches locked sequencing (e.g. **Slice 5** JSON export + confirmed import replace per `DECISIONS.md` D14). Do **not** broaden scope “because it is convenient.”
4. **Charter the slice** — Point implementers at the slice row in `SLICE_PLAN.md`, contracts, and optional kickoff copy from [`docs/templates/SLICE_INTAKE_TEMPLATE.md`](../templates/SLICE_INTAKE_TEMPLATE.md).
5. **Research posture** — Control Tower may **recommend** follow-up research, **defer** it, or **reject** it as out of phase. Findings never bypass `DECISIONS.md` / scope.
6. **Close** — When Control Tower’s own session is meaningful (docs/process changed), use [`POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md): receipt + manual handoff rebuild per [`AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md).

**Opening checklist copy:** [`docs/templates/CONTROL_TOWER_CHECK_TEMPLATE.md`](../templates/CONTROL_TOWER_CHECK_TEMPLATE.md).

---

## What implementation slice chats must report back

When a bounded implementation slice finishes (or pauses), the thread should return **evidence-oriented** facts Control Tower can scan:

1. **Inspected** — Key paths read (contracts, modules, prior receipts).
2. **Files changed** — List with one-line **why** each changed.
3. **Decisions touched** — `DECISIONS.md` or contract edits, or **none**.
4. **Verification** — Commands run and **results** (or honest partial / N/A with reason), per [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md) and [`VERIFICATION_EVIDENCE_STANDARD.md`](VERIFICATION_EVIDENCE_STANDARD.md).
5. **Blockers / unverified** — Explicit list, or **none**.
6. **Rollback** — How to revert for significant work.
7. **Recommended next slice** — One suggestion aligned to `SLICE_PLAN.md` / status — **not** a new mandate unless docs were updated.

Implementation chats should still create their own **immutable receipt** for meaningful runs and align **handoff** per [`AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md).

---

## Related docs (avoid duplicating)

- [`AGENTS.md`](../../AGENTS.md) — binding rules, hierarchy, proof-before-done  
- [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](../ai/AGENT_STARTUP_CHECKLIST.md) — read order  
- [`docs/WORKFLOWS/ENGINEERING_SESSION_HABITS.md`](ENGINEERING_SESSION_HABITS.md) — implementation session contract  
- [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md) — when to write receipts / status  
- [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md) — receipts + derived handoff  
- [`docs/SLICE_PLAN.md`](../SLICE_PLAN.md) — bounded slices  
