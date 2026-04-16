# Run receipt template (ClassPulse)

<!-- Immutable per-run source-of-truth artifact. Save to docs/ai/run_receipts/YYYY-MM-DDTHHMMSSZ--<slug>--<shortid>.md -->
<!-- Receipt body is informational: record facts, verification, and open state — not PM directives. -->

---
run_id: "YYYY-MM-DDTHHMMSSZ--<slug>--<shortid>"
created_at_utc: "YYYY-MM-DDTHH:MM:SSZ"
project: "ClassPulse"
task_slug: "<slug>"
handoff_session_id: "<session-id>"
shortid: "<shortid>"
handoff_path: "docs/ai/AGENT_HANDOFF.md"
---

## run_id

<!-- duplicate run_id for human scanning -->

## created_at_utc

<!-- duplicate created_at_utc -->

## task_slug

<!-- duplicate task_slug -->

## handoff_session_id

<!-- Canonical PM-upload grouping key: reuse the SAME value for same-lane follow-ups unless intentionally starting a new PM thread. -->
<!-- Optional duplicate: ## pm_upload_group (same string). -->

## Session anchor (pickup)

<!-- One line: best starting point for which task or thread. -->

## related_receipts

<!-- Optional: other receipt paths or run_id values; write `none` if none. -->

## prompt_intent

<!-- User intent for this run -->

## cursor_outcome

<!-- shipped | partial | blocked -->

## Files read

<!-- Paths read -->

## Files changed

<!-- Paths authored or edited directly in this run. Do **not** list `docs/ai/AGENT_HANDOFF.md` here — it is derived, not normal authored work. -->

## Derived handoff rebuild

<!-- Required: neutral factual outcome immediately after **Files changed** (e.g. manual rebuild from receipts completed; pending; skipped with reason). -->

## Handoff inclusion result

<!-- Optional: included | excluded | pending_rebuild — how this receipt relates to the current `docs/ai/AGENT_HANDOFF.md` window. -->

## Verification run

<!-- Commands run -->

## Verification result

<!-- Pass/fail evidence -->

## verification_state

<!-- pending | finalized -->

## verification_finalized_at_utc

<!-- UTC timestamp when verification becomes final -->

## Rollback

<!-- Exact command(s) to undo this run’s direct edits. For derived `AGENT_HANDOFF.md`, prefer rebuilding from receipts rather than blind git restore when other runs may share the file. -->

## unresolved_status

<!-- Factual unresolved state only -->

## raw_mirror

<!-- Dense run log summary -->

## pm_summary_snippet

<!-- 1–3 informational sentences for PM-ready summary (no recommendations / next-action language). -->
