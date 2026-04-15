# Post chat closeout

**Purpose:** After a **meaningful** session (behavior, docs, or plan moved), capture what belongs in the repo so nothing important stays only in chat.

## When to use this

Offer or run closeout when the session **mattered** and the task **looks done**: outcomes are in-repo (or honestly N/A), **verification** ran or is waived with reason, and **rollback** is clear for significant changes.

## Principles

- **Repo-first:** Durable truth lives in files, not chat.  
- **Right bucket:** Decisions → **`DECISIONS.md`**; today’s facts → **`docs/PROJECT_STATUS.md`**; long narrative (optional) → **`docs/AI_DEV_JOURNAL.md`**.  
- **No silent reduction:** Summarize; do not wipe useful sections without saying why.  
- **Smallest safe updates:** Touch only what needs to move.

## Lightweight checklist

1. **Read** `AGENTS.md`, `DECISIONS.md`, `docs/PROJECT_STATUS.md`, and any files the session touched.  
2. **Update `docs/PROJECT_STATUS.md`** — current focus, blockers, recent changes.  
3. **Append to `DECISIONS.md`** if you made a durable choice (not every tweak).  
4. **Optional journal** — add an entry to `docs/AI_DEV_JOURNAL.md` if the story matters for demos or grading.  
5. **Verify** — run project tests or lint if they exist; note what you ran.

## If an AI assistant closes out

The assistant should **read the actual repo**, edit the files above, run checks, and report **what changed**, **verification**, and **rollback** in the same thread—without inventing policies that are not in the repo.
