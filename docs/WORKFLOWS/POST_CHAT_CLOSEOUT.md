# Post chat closeout (ClassPulse)

**Purpose:** After a **meaningful** session (behavior, contracts, process, or durable direction moved), capture what belongs in the repo so nothing important stays only in chat.

## When to offer or run closeout (trigger)

Offer or run closeout when the session **mattered** and the task **looks done**: outcomes are in-repo (or honestly N/A), **verification** ran or is waived with reason, **rollback** is clear for significant changes, and durable files are updated when behavior or commitments actually changed.

**Task-complete only** — not after every small step.

## Core principles

- **Repo-first memory:** durable repo files are the source of truth, not chat.  
- **Separation of concerns:** put each kind of knowledge in the right file (see table below).  
- **Proof before done:** use the language of [`VERIFICATION_EVIDENCE_STANDARD.md`](VERIFICATION_EVIDENCE_STANDARD.md) (proved vs partial vs unverified).  
- **No transcript dumping:** summarize and structure; do not paste raw chat logs into canon docs.  
- **Smallest safe updates:** do not rewrite more than needed.

## Where knowledge goes (role separation)

| Kind of truth | Canonical location | Notes |
|---------------|-------------------|--------|
| Locked product / technical commitments | `DECISIONS.md` | Append or amend when a durable choice is made. |
| Operational snapshot (“what exists / next”) | `docs/PROJECT_STATUS.md` | Update when focus, shipped slices, or blockers change. |
| Append-only AI process reflection | `docs/AI_DEV_JOURNAL.md` | Optional; not a substitute for status or decisions. |
| Immutable per-run audit record | `docs/ai/run_receipts/*.md` | One receipt per meaningful run; verification finalized here when possible. |
| PM-upload / continuity bundle (derived) | `docs/ai/AGENT_HANDOFF.md` | Informational aggregate from receipts; see [`AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md). |

Receipts are **inputs**; `AGENT_HANDOFF.md` is a **derived** narrative for handoff. Status and journal answer different questions than receipts.

## Lightweight checklist (repo-native)

1. **Read** `AGENTS.md`, `DECISIONS.md`, `docs/PROJECT_STATUS.md`, and files the session touched.  
2. **Receipt** — for meaningful runs, add or finalize one file under `docs/ai/run_receipts/` using [`docs/templates/RUN_RECEIPT_TEMPLATE.md`](../templates/RUN_RECEIPT_TEMPLATE.md).  
3. **Handoff** — update [`docs/ai/AGENT_HANDOFF.md`](../ai/AGENT_HANDOFF.md) per [`AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md) (manual merge is acceptable until automation exists).  
4. **Update `docs/PROJECT_STATUS.md`** — current focus, blockers, recent changes.  
5. **Append `DECISIONS.md`** only when a durable choice was made.  
6. **Optional journal** — append `docs/AI_DEV_JOURNAL.md` when the lesson is reusable.  
7. **Verify** — follow [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md) for this repo.

## If an AI assistant closes out

The assistant should **read the actual repo**, edit the files above, run checks, and report **what changed**, **verification**, and **rollback** in the same thread — without inventing policies that are not in the repo.

## Anti-drift (lightweight)

When the same friction **recurs** (wrong paths, skipped verification, scope creep), note it briefly in `docs/PROJECT_STATUS.md` (KB friction line) or on the run receipt. Do **not** add standing bureaucracy or mandatory scorecards.
