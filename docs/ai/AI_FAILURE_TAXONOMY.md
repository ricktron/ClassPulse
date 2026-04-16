# AI failure taxonomy (ClassPulse)

**Purpose:** Shared vocabulary for common AI-assisted misses so review and closeout stay specific and searchable.

Use one primary class per incident unless a second class changes the corrective action.

## Failure classes

### Wrong-layer edit

Change landed in a derived or non-owner layer.

Fix by moving to the canonical owner file and regenerating derived outputs through workflow (for example `docs/ai/AGENT_HANDOFF.md` from receipts).

### Over-broad patch

Diff exceeds bounded slice or includes unrelated cleanup.

Fix by shrinking to the scoped change or splitting into a follow-up slice.

### Source-of-truth violation

Chat memory or external notes overrode checked-in repo files.

Fix by re-reading canonical paths and reconciling before proceeding.

### Unverified completion claim

“Done / passing” without checks or evidence.

Fix by running required verification or marking partial / unverified explicitly.

### Silent reduction of meaningful content

Meaningful content removed or heavily compressed without rationale.

Fix by restoring and documenting any intentional reduction.

### Missed required artifact

Required closeout, receipt, or verification artifact was skipped.

Fix by backfilling the artifact honestly and rerunning verification as needed.

### Contract drift

Implementation and stated contract or decision no longer align.

Fix by either realigning implementation or explicitly updating the contract in `DECISIONS.md` / slice docs.

## Related docs

- [`docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md`](../WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md)  
- [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](../WORKFLOWS/POST_CHAT_CLOSEOUT.md)  
- [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](../WORKFLOWS/AGENT_HANDOFF_STANDARD.md)
