# Agent startup checklist

**Read the repo’s instructions first**—do not treat chat memory or pasted exports as authority.

## Read order (exact)

1. [`AGENTS.md`](../../AGENTS.md) — binding rules for this repo  
2. [`DECISIONS.md`](../../DECISIONS.md) — durable commitments  
3. [`docs/ARCHITECTURE_OVERVIEW.md`](../ARCHITECTURE_OVERVIEW.md) — system shape (skim if still empty)  
4. [`docs/PROJECT_STATUS.md`](../PROJECT_STATUS.md) — current snapshot  
5. [`README.md`](../../README.md) — how this seed is meant to be used  
6. [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](../WORKFLOWS/POST_CHAT_CLOSEOUT.md) — when a session should update the repo  
7. [`docs/WORKFLOWS/AI_TOOL_ROUTING.md`](../WORKFLOWS/AI_TOOL_ROUTING.md) plus [`docs/WORKFLOWS/TICKET_INTAKE_STANDARD.md`](../WORKFLOWS/TICKET_INTAKE_STANDARD.md) — operator routing + bounded intake for non-trivial work
8. [`docs/templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md`](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md), [`docs/templates/AI_REVIEW_PACKET_TEMPLATE.md`](../templates/AI_REVIEW_PACKET_TEMPLATE.md), [`docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md`](../WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md), and [`docs/ai/AI_FAILURE_TAXONOMY.md`](AI_FAILURE_TAXONOMY.md) — implementation/review/evidence/failure language
9. [`docs/RUNBOOK_PreShipChecklist.md`](../RUNBOOK_PreShipChecklist.md) — **when** the slice may touch secrets, auth, untrusted input, writes, migrations, public routes, deploy, or production assumptions: open the linked checklist (Forge canonical when inside upstream repo) **before** coding; note which categories are in scope, deferred, or N/A-with-reason in the session contract.

If the human provided a filled **[`STARTER_CARD.md`](../../STARTER_CARD.md)**, treat it as context for priorities—not as a replacement for files above.

## Operating stance (short)

- **Repo files over chat** — verify against the tree.  
- **No silent reduction** — explain before removing or crushing meaningful content.  
- **Smallest safe change** — minimal diff unless a larger fix avoids debt.  
- **Workflows live in `docs/WORKFLOWS/`** — link there instead of duplicating long process text.
- **Canon-first for this starter** — treat checked-in files here as authority; external KB or chat summaries are secondary until reflected in-repo.

## Before coding (implementation tasks)

State **definition of done**, **non-goals**, **source-of-truth paths**, **assumptions**, and **verification** (commands or checks). For significant work, include **rollback**. When [pre-ship / release-readiness](../RUNBOOK_PreShipChecklist.md) applies, add one line on **which checklist categories** are in scope vs deferred vs N/A (with reason) — link the runbook; do not paste the full checklist here.
