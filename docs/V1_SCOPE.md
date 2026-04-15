# True v1 scope (locked)

This document mirrors the **locked ClassPulse baseline** encoded in `DECISIONS.md` and the scaffold. If informal planning conflicts with this file, **this file wins** once merged — and the conflict should be noted in `DECISIONS.md`.

## In scope for true v1

- **Fixed top-level modes:** Sleep, Participation, Behavior, Bathroom, Notes, Assessments.  
- **Socratic** flows live **under Participation**, not as a separate top-level mode.  
- **Teacher-editable event packs** inside each mode (contracts and UI land in future slices; v1 anticipates the shape only).  
- **Multiple room layouts** supported over time (layout system can grow slice-by-slice).  
- **Local-first persistence** on-device via **IndexedDB + Dexie**.  
- **JSON** as the **authoritative backup** format.  
- **Import behavior:** explicit confirmation, then **replace** local data — **no merge** in v1.  
- **One teacher per device/app instance** for v1.

## Explicitly deferred (v1.1+ unless noted)

- **Assessment completion timestamps** — required in **v1.1**, not core true v1 (see `DECISIONS.md` D7).

## Out of scope for true v1

- Reports, dashboards, and analytics pipelines.  
- Transcript capture/transcription workflows.  
- Hall-pass integrations or cross-reference features.  
- Multi-user collaboration, roster cloud sync, or speculative backend abstractions.  
- Supabase (or any remote database) as **primary** storage.  
- Google OAuth/login flows **unless** a future slice introduces a clearly bounded, optional seam with no mandatory cloud dependency for core use.

## Platform expectations

- Ship a **PWA baseline** suitable for **Add to Home Screen** on iPad Safari.  
- Keep dependencies lean; justify each addition in slice notes when not obvious.
