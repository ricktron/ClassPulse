# AGENTS.md

Binding guidance for **humans** and **AI coding assistants** working on **ClassPulse**.

## Read this first (ordered)

**Canonical ordered startup** (numbered paths, stance, pre-coding contract): [`docs/ai/AGENT_STARTUP_CHECKLIST.md`](docs/ai/AGENT_STARTUP_CHECKLIST.md). Read **this** file for binding ClassPulse rules; follow that checklist — do not maintain a second full startup list elsewhere.

**Task-based depth:** For implementation or debugging sessions, use [`docs/WORKFLOWS/ENGINEERING_SESSION_HABITS.md`](docs/WORKFLOWS/ENGINEERING_SESSION_HABITS.md) for the session contract and verification discipline.

## Repo boundary (ClassPulse only)

- **This repository is for ClassPulse only.** If the user prompt is about another repository or project (implementation, debugging, or documentation that belongs elsewhere), **stop immediately** and **fail loudly** before discovery, tool use, or edits in this repo.

**Fail-loud reply (use materially this wording):** “Wrong repo scope: this prompt does not appear to be a ClassPulse repo task. No repo work was performed. Restate it as a ClassPulse repo task or move to the correct repo/chat.”

- Say clearly that **no ClassPulse repo work was performed** because the prompt appears out of scope, and tell the user to **restate the task as a ClassPulse task** or **move to the correct repo or chat**. Do **not** proceed partially “to be helpful.”

**Narrow exceptions — proceed only when the prompt states one of these explicitly:**

1. **Canon cleanup:** Remove or correct mistaken non–ClassPulse content that landed in ClassPulse canonical docs or repo.  
2. **Coordination docs:** Update ClassPulse’s own shared workflow or agent instruction sync files checked into this repo.  
3. **Reference-only for ClassPulse planning:** The prompt supplies **reference-only** context and does **not** ask for edits, commands, or deliverables against another codebase.

If the request is **mixed or ambiguous**, **default to stopping** with the fail-loud reply **unless** the prompt clearly falls under an exception above.

## Handoff and review (meaningful sessions)

- **Immutable receipts** — create one new receipt per meaningful run under [`docs/ai/run_receipts/`](docs/ai/run_receipts/) using [`docs/templates/RUN_RECEIPT_TEMPLATE.md`](docs/templates/RUN_RECEIPT_TEMPLATE.md).  
- **Derived handoff** — [`docs/ai/AGENT_HANDOFF.md`](docs/ai/AGENT_HANDOFF.md) is the PM-upload / continuity bundle, **derived from** receipts per [`docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md`](docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md). It records outcomes and verification; it does **not** prescribe next actions.  
- **Procedure:** [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md) when behavior, contracts, or durable direction changed.

ClassPulse currently uses **manual** handoff rebuild from receipts (no lock script). Receipts remain the merge-safe source of truth if narratives diverge.

## Source-of-truth hierarchy (ClassPulse)

When sources conflict, prefer:

1. Checked-in product and governance docs in **this repo** (`docs/*`, `README.md`, `AGENTS.md`).  
2. **Locked decisions** in [`DECISIONS.md`](DECISIONS.md).  
3. **Explicit slice contracts** and implementation notes captured per slice (see [`docs/SLICE_PLAN.md`](docs/SLICE_PLAN.md)).  
4. **Runbooks, workflows, and** [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) — how to operate and what changed recently.  
5. Planning notes from chats or local folders **only after** they are distilled into repo docs.  
6. External inspiration — non-authoritative.

**`starter_repo/`** is an optional, **non-authoritative** seed library. It must **not** override 1–4 above for ClassPulse product or governance.

If chat planning conflicts with checked-in baseline, **follow the locked product baseline in repo docs** and record the resolution in `DECISIONS.md` / relevant `docs/*` file.

## Hard rules

- **Proof before done:** run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` (or document why a command is N/A) before claiming a slice is complete. Default command expectations live in [`docs/RUNBOOK_SanityChecks.md`](docs/RUNBOOK_SanityChecks.md).  
- **Rollback for significant work:** state how to revert before calling that work done.  
- **Local-first default:** IndexedDB via Dexie is the live working store; do not introduce Supabase (or other cloud) as primary storage without a new `DECISIONS.md` entry and architecture update.  
- **Smallest safe change:** avoid drive-by refactors and scope creep; keep slices bounded.  
- **No silent reduction:** do not delete meaningful docs or contracts without stating why.

## Stack expectations

- **React + TypeScript + Vite** for the UI.  
- **Dexie** for IndexedDB access.  
- **Vitest + Testing Library** for unit/UI tests (with `fake-indexeddb` where needed).  
- **npm** as the canonical package manager unless `package.json` / lockfiles in-repo say otherwise.

## Prompt packaging safety

Chat and exported copy/paste prompts must not break on nested markdown fences.

- **Never nest triple backticks** inside a triple-backtick prompt block.  
- For prompts meant to be copied from chat, **emit one outer fenced block only**.  
- If a prompt needs code examples inside it, **flatten** them into bullets or inline code instead of nested fences.

## Definition of done (slice-level)

Work is done when behavior matches the slice contract, verification commands have been run (with evidence), durable docs/decisions are updated if contracts changed, and `docs/PROJECT_STATUS.md` reflects reality.

**Closeout offer:** When the active chat **appears** to satisfy the definition of done — not after every minor step — the agent should **explicitly offer** following [`docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md`](docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md) so durable placement and handoff can run as intended. Do **not** offer that closeout while required verification, agreed deliverables, or known blockers remain unresolved.

## Workflow (default)

1. Restate the goal in one or two lines.  
2. If repo state is unclear, inspect the repo (files, diffs).  
3. Short plan plus risky assumptions.  
4. Implement in the smallest safe steps.  
5. Verification commands and expected outcomes.  
6. Rollback commands.  
7. If blocked, ask for one specific command output or file path.
