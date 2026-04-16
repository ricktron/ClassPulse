# Agent startup checklist (ClassPulse)

**Read the repo’s instructions first** — do not treat chat memory or pasted exports as authority.

## Read order (exact)

1. [`AGENTS.md`](../../AGENTS.md) — binding rules for this repo  
2. [`DECISIONS.md`](../../DECISIONS.md) — durable commitments  
3. [`docs/PROJECT_BRIEF.md`](../PROJECT_BRIEF.md) — product intent  
4. [`docs/V1_SCOPE.md`](../V1_SCOPE.md) — in-scope vs later  
5. [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) — local-first shape  
6. [`docs/PROJECT_STATUS.md`](../PROJECT_STATUS.md) — current snapshot  
7. [`README.md`](../../README.md) — scripts and orientation  
8. [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](../WORKFLOWS/POST_CHAT_CLOSEOUT.md) — when a session should update the repo  
9. [`docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md`](../WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md) — what counts as proof  
10. [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](../WORKFLOWS/AGENT_HANDOFF_STANDARD.md) — receipts + derived handoff  
11. [`docs/ai/AI_FAILURE_TAXONOMY.md`](AI_FAILURE_TAXONOMY.md) — shared miss vocabulary (link-out in narrative)  
12. [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md) — default verification loop for this codebase  
13. [`docs/SLICE_PLAN.md`](../SLICE_PLAN.md) — bounded implementation slices  

Optional **non-authoritative** reference material: [`starter_repo/`](../../starter_repo/) (generic seed only; do not treat as ClassPulse product or governance source of truth).

## Operating stance (short)

- **Repo files over chat** — verify against the tree.  
- **No silent reduction** — explain before removing or crushing meaningful content.  
- **Smallest safe change** — minimal diff unless a larger fix avoids debt.  
- **Workflows live in `docs/WORKFLOWS/`** — link there instead of duplicating long process text.  
- **Canon-first for ClassPulse** — checked-in files under `docs/`, `DECISIONS.md`, and `AGENTS.md` are authoritative.

## Before coding (implementation tasks)

State **definition of done**, **non-goals**, **source-of-truth paths**, **assumptions**, and **verification** (commands or checks). For significant work, include **rollback**.

For **meaningful** runs (multi-step implementation, governance, or debugging that changes repo truth), plan for **one immutable receipt** under [`docs/ai/run_receipts/`](run_receipts/) and align derived [`docs/ai/AGENT_HANDOFF.md`](AGENT_HANDOFF.md) per [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](../WORKFLOWS/AGENT_HANDOFF_STANDARD.md).
