# Run receipts (ClassPulse)

Immutable **per-run** records under this directory are the **primary audit trail** for meaningful AI-assisted sessions. Receipts preserve what happened in a run without forcing future sessions to reconstruct everything from chat history.

## Naming

`YYYY-MM-DDTHHMMSSZ--<slug>--<shortid>.md`

- Use **UTC** timestamps.  
- `<slug>` is a short kebab-case task description (`<task-slug>`).  
- `<shortid>` is eight hex characters to avoid same-second collisions.

## Minimum contents

Each receipt should cover at least:

- prompt intent  
- files read  
- files changed  
- verification run  
- verification result  
- rollback  
- concise outcome summary  

Use [`docs/templates/RUN_RECEIPT_TEMPLATE.md`](../../templates/RUN_RECEIPT_TEMPLATE.md) for full structure and frontmatter.

## Authoring

1. Copy the run receipt template.  
2. Fill frontmatter and sections; finalize verification when checks complete.  
3. Update [`docs/ai/AGENT_HANDOFF.md`](../AGENT_HANDOFF.md) per [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](../../WORKFLOWS/AGENT_HANDOFF_STANDARD.md).

Do **not** rewrite old receipts to change history; add a new correction receipt if metadata was wrong.

## Relationship to handoff

- Receipts are the durable per-run trail.  
- [`docs/ai/AGENT_HANDOFF.md`](../AGENT_HANDOFF.md) is the derived roll-up for pickup, rebuilt from receipts per the handoff standard.
