# Runbook — sanity checks (ClassPulse)

**Purpose:** Default **proof** loop before calling work done for this repository (Vite + React + TypeScript + Dexie).

**Release-readiness:** ClassPulse v1 is local-first in the browser. If a future slice touches auth, secrets, untrusted input, persistence migrations beyond Dexie versioning, public deployment, or production assumptions, extend this runbook with slice-specific checks and record triggers in the slice contract / `DECISIONS.md`.

## Preconditions

- Working directory: **repository root** (`classpulse/` clone).

### Exported prompt artifacts (optional manual check)

When you save a copy/paste or agent prompt as a `.md` / `.txt` file, **skim it once**: fenced code blocks should be **balanced** (opening/closing triple-backtick pairs), and **all intended prompt text** should sit **inside** the fence you mean to copy. See **Prompt packaging safety** in [`AGENTS.md`](../AGENTS.md).

## Structural (always safe)

```bash
test -f AGENTS.md && test -f DECISIONS.md && test -f README.md
test -f docs/PROJECT_STATUS.md
test -f docs/ai/AGENT_STARTUP_CHECKLIST.md
test -f docs/ai/AGENT_HANDOFF.md
test -f docs/WORKFLOWS/POST_CHAT_CLOSEOUT.md
test -f docs/WORKFLOWS/AGENT_HANDOFF_STANDARD.md
test -f docs/RUNBOOK_SanityChecks.md
```

**Expected:** all `test` commands exit `0`.

## Node — install, typecheck, lint, test, build

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

**Expected:** each command exits `0`.

**Notes:**

- `npm run build` emits PWA / Workbox assets; first build may take longer.  
- Tests use Vitest with `jsdom` and `fake-indexeddb` where applicable.

## Docs governance checks (after changing navigation)

If you change paths in `AGENTS.md`, `docs/ai/AGENT_STARTUP_CHECKLIST.md`, or workflow links:

- Re-run the **Structural** block above.  
- Spot-check that new links resolve from the repository root.

## Related docs

- [`AGENTS.md`](../AGENTS.md)  
- [`docs/WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md`](WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md)
