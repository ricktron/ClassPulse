# Agent handoff standard (ClassPulse)

**Purpose:** Define the **repo-native** handoff pattern: immutable **receipts** are the per-run source of truth; [`docs/ai/AGENT_HANDOFF.md`](../ai/AGENT_HANDOFF.md) is the **derived** PM-upload / continuity artifact (informational — what happened and what was verified, not forward instructions).

**Scope:** Meaningful AI-assisted or multi-step work where continuity, review, or audit matters.

**When to use:** End of a meaningful run, pause, or context switch; whenever [`POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md) applies.

## Canonical behavior

- **Per-run source of truth:** one immutable receipt file per meaningful run under `docs/ai/run_receipts/` (see naming below).  
- **Derived handoff:** `docs/ai/AGENT_HANDOFF.md` summarizes the active session from receipts; it must **not** contradict receipts.  
- **Raw transcript export** is fallback-only when the live handoff is missing or clearly insufficient — not the default workflow.

## ClassPulse rebuild model (today)

Project Forge may use lock-protected automation to rebuild `AGENT_HANDOFF.md`. **ClassPulse does not ship that automation yet.** Until it exists:

1. Create the receipt first (immutable path + identity).  
2. Manually update `docs/ai/AGENT_HANDOFF.md` from [`docs/templates/AGENT_HANDOFF_TEMPLATE.md`](../templates/AGENT_HANDOFF_TEMPLATE.md), copying factual blocks from the receipt(s) in the active session.  
3. If two operators might edit `AGENT_HANDOFF.md` concurrently, coordinate out-of-band; receipts remain the merge-safe audit trail.

**Future parity (optional):** add scripts with lock files mirroring Forge; until then, receipts + honest manual derivation are authoritative.

## Canonical files

| Role | Path |
|------|------|
| Live handoff (derived PM-upload file) | `docs/ai/AGENT_HANDOFF.md` |
| Immutable per-run receipts | `docs/ai/run_receipts/YYYY-MM-DDTHHMMSSZ--<slug>--<shortid>.md` |
| Receipt template | [`docs/templates/RUN_RECEIPT_TEMPLATE.md`](../templates/RUN_RECEIPT_TEMPLATE.md) |
| Handoff template | [`docs/templates/AGENT_HANDOFF_TEMPLATE.md`](../templates/AGENT_HANDOFF_TEMPLATE.md) |
| Startup read order | [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](../ai/AGENT_STARTUP_CHECKLIST.md) |

## Active handoff window (operator convention)

- **Default window:** 24 hours from `opened_at_utc` in `AGENT_HANDOFF.md` frontmatter.  
- **Grouping:** reuse the same `handoff_session_id` (or `pm_upload_group` alias) for same-lane follow-ups unless intentionally starting a new PM thread.  
- **Mixed sessions:** if multiple distinct `task_slug` values are included, set `task_scope: mixed`, list `included_task_slugs`, and avoid a plain exclusive `task_slug` at the top level.  
- **Rollover:** start a fresh handoff window when the 24-hour window expires, the PM-upload thread intentionally resets, or `status: reset_requested` (or similar) is recorded.

## Required run receipt behavior

- Create **exactly one** receipt per meaningful run using the template.  
- **Naming:** `docs/ai/run_receipts/YYYY-MM-DDTHHMMSSZ--<slug>--<shortid>.md` (`shortid` prevents same-second collisions).  
- **Do not** list `docs/ai/AGENT_HANDOFF.md` under **Files changed** on the receipt — it is derived, not authored like normal repo edits. Record rebuild outcome in **`## Derived handoff rebuild`** immediately after **Files changed**.  
- Receipts are **immutable identity artifacts** (path + `run_id`). Prefer **new correction receipts** over rewriting history.

## PM-upload rule

`docs/ai/AGENT_HANDOFF.md` must stay **informational**: no imperative “do this next” sections. Neutral summaries only.

## Related docs

- [`POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md)  
- [`VERIFICATION_EVIDENCE_STANDARD.md`](VERIFICATION_EVIDENCE_STANDARD.md)
