# New project (starter seed)

You copied a **starter_repo** seed: a small, serious default for coding projects. It favors **repo files over chat memory**, a **short checklist** for how to read the repo, and **workflows in `docs/WORKFLOWS/`** instead of repeating long rules everywhere.

## First hour

1. [`START_HERE.md`](START_HERE.md) — shortest path.  
2. [`STARTER_CARD.md`](STARTER_CARD.md) — four quick answers.  
3. [`START_HERE_FOR_LLM.md`](START_HERE_FOR_LLM.md) — only if an AI assistant is helping.

## What matters in this tree

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Rules for humans and coding agents |
| `DECISIONS.md` | Durable decisions (append-only style) |
| `docs/PROJECT_STATUS.md` | What is true *today* |
| `docs/ai/AGENT_STARTUP_CHECKLIST.md` | Ordered startup for agents |
| `docs/WORKFLOWS/AI_TOOL_ROUTING.md` | Operator workflow map (intake → implementation → verify → review → closeout) |
| `docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md` | How to land a meaningful session into the repo |
| `docs/RUNBOOK_PreShipChecklist.md` | Pre-ship / release-readiness pointer (canonical copy lives in Forge `docs/` when upstream; see file header) |

Optional: `BOOTSTRAP_PROFILE.yaml` mirrors your starter card for machines or mentors—ignore until useful.

## Repo hygiene

The seed ships **ignore rules** (`.gitignore`, `.editorconfig`, `.gitattributes`) plus scripts under `scripts/`:

- **Cleanup:** `bash scripts/bootstrap_repo.sh` — removes only obvious OS junk (`.DS_Store`, `._*`, `Thumbs.db`, `Desktop.ini`); does not delete `.env`, notes, or normal project files.
- **Check:** `bash scripts/check_repo_hygiene.sh` — fails if junk files or merge conflict markers are present.

There is no `package.json` in this seed yet, so use the `bash …` commands above. Full detail: [`docs/bootstrap/STARTER_REPO_HYGIENE.md`](../docs/bootstrap/STARTER_REPO_HYGIENE.md) (when this tree still lives inside Forge) or keep a copy of that doc next to your project docs after you copy the starter out.

## Origin

This seed is maintained inside **Project Forge** as `starter_repo/`. Forge-specific product docs were removed; the **operating spine** is preserved in a calmer, smaller form.

## AI operator flow (starter)

Use the starter canon as the authority for AI-assisted work in this repo:

`docs/WORKFLOWS/TICKET_INTAKE_STANDARD.md` → `docs/templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md` → `docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md` → `docs/templates/AI_REVIEW_PACKET_TEMPLATE.md` → `docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`

Routing map: `docs/WORKFLOWS/AI_TOOL_ROUTING.md`  
Miss vocabulary: `docs/ai/AI_FAILURE_TAXONOMY.md`
