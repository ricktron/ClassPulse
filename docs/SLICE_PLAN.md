# Slice plan — how bounded work lands

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

| Slice | Focus | Notes |
|-------|-------|-------|
| **Slice 1** | Live mode navigation + persisted `activeMode` | Wire taps on the mode strip to Dexie updates; keep UI intentionally plain. |
| **Slice 2** | Session lifecycle | Create/end session, session list, empty states. |
| **Slice 3** | JSON export + confirmed import replace | Implement the v1 backup contract; still no merge. |
| **Slice 4** | Event pack editor MVP | Teacher-editable packs per mode; versioning strategy documented before schema churn. |

The table is guidance, not a commitment order — adjust in `docs/PROJECT_STATUS.md` as reality changes.

## Conflict handling

If a slice proposal conflicts with `docs/V1_SCOPE.md` or `DECISIONS.md`, **stop** and resolve documentation first. Prefer updating `DECISIONS.md` with a dated entry over informal chat agreements.
