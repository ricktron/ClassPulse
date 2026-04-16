# Engineering session habits (ClassPulse)

**Purpose:** Compact defaults for **implementation and debugging** chats — session contract, verification discipline, and handoff alignment.

## Session contract (before substantive edits)

Lock explicitly:

- **Definition of done** — what “finished” means for this chat.  
- **Non-goals / scope guard** — what is out of scope.  
- **Source-of-truth paths** — which docs or contracts govern the change.  
- **Assumptions and unknowns** — what could invalidate the plan.  
- **Verification plan** — commands or checks; align with [`docs/RUNBOOK_SanityChecks.md`](../RUNBOOK_SanityChecks.md).  
- **Rollback** (significant changes) — how to revert safely.

## During work

- Prefer **smallest safe change**; avoid drive-by refactors.  
- **Reproduce** before fixing when debugging; shrink to the smallest failing case when stuck.  
- **Verify with commands**, not vibes — see [`VERIFICATION_EVIDENCE_STANDARD.md`](VERIFICATION_EVIDENCE_STANDARD.md).

## After meaningful work

- **Receipt-first** — [`AGENT_HANDOFF_STANDARD.md`](AGENT_HANDOFF_STANDARD.md).  
- **Durable updates** — [`POST_CHAT_CLOSEOUT.md`](POST_CHAT_CLOSEOUT.md) when contracts or behavior changed.

## Related docs

- [`AGENTS.md`](../../AGENTS.md)  
- [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](../ai/AGENT_STARTUP_CHECKLIST.md)
