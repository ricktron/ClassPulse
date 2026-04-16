# Run receipts

This folder holds immutable per-run evidence for meaningful ClassPulse sessions.

## Purpose

Receipts preserve what happened in a run without forcing future sessions to reconstruct everything from chat history.

## Naming

Use:

`YYYY-MM-DDTHHMMSSZ--<task-slug>--<shortid>.md`

## Minimum contents

- prompt intent
- files read
- files changed
- verification run
- verification result
- rollback
- concise outcome summary

## Relationship to handoff

- Receipts are the durable per-run trail.
- [`docs/ai/AGENT_HANDOFF.md`](../AGENT_HANDOFF.md) is the current roll-up for the next pickup.
