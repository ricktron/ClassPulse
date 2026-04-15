# AGENTS.md

Guidance for **AI coding assistants** and **human contributors** in this repository. This file is **binding** for how work is done here.

## Read this first

**Canonical ordered startup:** [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](docs/ai/AGENT_STARTUP_CHECKLIST.md). Follow that list before trusting chat memory or external summaries.

## Source-of-truth hierarchy

When sources conflict, prefer:

1. **Current repo files** — code, configs, and checked-in docs  
2. **`DECISIONS.md`** — durable commitments  
3. **Runbooks, workflows, and `docs/PROJECT_STATUS.md`** — how to run things and what changed recently  
4. **External notes or inspiration** — useful input only after they are reflected in the repo

## Hard rules

- **Proof before done:** Run checks or document failures with evidence before calling work finished.  
- **Rollback for significant work:** Say how to revert (git revert, feature flag, etc.) when the change is non-trivial.  
- **No silent reduction:** Do not delete, replace, or heavily compress meaningful sections without explaining why first.  
- **Preserve and strengthen:** Improve existing useful content; do not strip it without cause.  
- **Smallest safe change:** Prefer minimal diffs unless a tiny change would duplicate rules or hide risk.

## Where process lives

Put repeatable process in **`docs/WORKFLOWS/`**. Do not maintain parallel copies of the same long instructions in multiple root files unless one file is clearly the index and the rest are single-purpose.

**AI operator workflow (generic):** Route non-trivial work through `docs/WORKFLOWS/TICKET_INTAKE_STANDARD.md` → `docs/templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md` → `docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md` → `docs/templates/AI_REVIEW_PACKET_TEMPLATE.md` → `docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`, with `docs/WORKFLOWS/AI_TOOL_ROUTING.md` as the mode/tool map and `docs/ai/AI_FAILURE_TAXONOMY.md` as shared miss vocabulary.

**Canon-first rule for this starter:** Repo files are authoritative. Do not treat chat summaries, external KB mirrors, or model memory as source-of-truth unless reflected back into this repository.

**Pre-ship / release-readiness:** One checklist pattern — [`docs/RUNBOOK_PreShipChecklist.md`](docs/RUNBOOK_PreShipChecklist.md) (pointer to Forge canon when this seed lives inside Project Forge; copy that file into your repo after `starter_repo/` is copied out). Triggers live in [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](docs/ai/AGENT_STARTUP_CHECKLIST.md); use **required / conditional / N/A-with-reason** from the canonical doc, not ad hoc chat lists.

## Definition of done (short)

Work is done when: behavior or docs exist as agreed, **verification** ran or waivers are documented, **rollback** is clear for significant changes, and durable files are updated when decisions or contracts actually changed.
