# Slice plan — how bounded work lands

**Kickoff:** bounded implementation chats may start from [`docs/templates/SLICE_INTAKE_TEMPLATE.md`](templates/SLICE_INTAKE_TEMPLATE.md). **Orchestration:** [`docs/WORKFLOWS/CONTROL_TOWER.md`](WORKFLOWS/CONTROL_TOWER.md).

## Intent

ClassPulse evolves through **small, verifiable slices** rather than open-ended refactors. Each slice should leave the repo **healthier**: docs, tests, and scripts stay truthful.

## Slice contract template

Each slice should ship with:

1. **Goal** — one sentence outcome.  
2. **Non-goals** — what this slice will *not* touch.  
3. **User-visible behavior** — observable acceptance criteria.  
4. **Data effects** — Dexie schema version bumps, migrations, import/export impacts.  
5. **Verification** — exact commands run (`typecheck`, `lint`, `test`, `build`).  
6. **Follow-ups** — deferred items explicitly listed.

## Suggested near-term slices

Slices **1–4** are already represented in the current shell: persisted `activeMode`, explicit session lifecycle, participation quick capture, and behavior quick capture.

| Slice | Focus | Notes |
|-------|-------|-------|
| **Slice 5** | JSON export + confirmed import replace | **Shipped:** JSON export + confirmation-gated replace import, no merge (`DECISIONS.md` D14). Optional Google backup/export follows later (D10). |
| **Slice 6** | Bathroom quick-capture MVP | **Shipped:** `BathroomPanel` with Out/Back captures, Dexie `bathroomEvents`, JSON backup/import parity (schema v4). |
| **Slice 7** | Notes capture MVP | Add lightweight free-form session notes tied to the active session, without broad document tooling. |
| **Slice 8** | Assessments shell MVP | Add the first assessment capture surface without introducing completion timestamps before v1.1. |

Teacher-editable event packs should follow after more of the fixed v1 modes have concrete capture surfaces in the product.

## Conflict handling

If a slice proposal conflicts with `docs/V1_SCOPE.md` or `DECISIONS.md`, **stop** and resolve documentation first. Prefer updating `DECISIONS.md` with a dated entry over informal chat agreements.
