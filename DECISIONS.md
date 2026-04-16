# DECISIONS.md

Durable **decisions** for ClassPulse — not day-to-day status. For current execution state, see [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

---

## How to add an entry

Use a short heading plus:

- **Decision:** what we chose  
- **Why:** one tight paragraph  
- **Since:** date (ISO preferred)

---

## D1 — Repo files are authoritative

**Decision:** Checked-in repository files are the source of truth for how ClassPulse works — not chat logs or uncommitted notes.

**Why:** Humans and assistants must converge on the same facts; git is the handshake.

**Since:** 2026-04-15

---

## D2 — Local-first working store + Dexie

**Decision:** The live working dataset for v1 lives in **IndexedDB** on the teacher device, accessed through **Dexie**.

**Why:** Offline-capable classroom use, minimal moving parts, and a clear boundary for future optional cloud backup.

**Since:** 2026-04-15

---

## D3 — Storage posture name: Local-First + Google Workspace Backup

**Decision:** The product storage/identity posture is named **Local-First + Google Workspace Backup**.

**Why:** Anchors long-term intent (durable teacher-owned backups in a familiar workspace) without forcing Google login, sync, or cloud primary storage in true v1.

**Since:** 2026-04-15

---

## D4 — Supabase is not core storage

**Decision:** **Supabase is not** primary or required storage for ClassPulse core.

**Why:** Keeps v1 lean; integrations may be reconsidered later as optional connectors, not as implicit architecture.

**Since:** 2026-04-15

---

## D5 — True v1 modes are fixed

**Decision:** True v1 exposes exactly these top-level modes: **Sleep, Participation, Behavior, Bathroom, Notes, Assessments**.

**Why:** Matches the locked classroom workflow shell; Socratic flows remain nested under Participation.

**Since:** 2026-04-15

---

## D6 — JSON import replaces local data (v1)

**Decision:** Authoritative backup format is **JSON**; import **replaces** local data after explicit confirmation; **no merge** logic in v1.

**Why:** Predictable recovery story for teachers and simpler engineering while the domain model stabilizes.

**Since:** 2026-04-15

**Status:** Superseded on 2026-04-16 by D10 for **primary long-term durability posture naming** (optional Google-connected backup/export). **Implementation sequencing** for the next backup/restore slice remains explicit in **D14** and `docs/SLICE_PLAN.md` (JSON export + confirmed import replace).

---

## D7 — Assessment completion timestamps land in v1.1

**Decision:** **Assessment completion timestamps** are explicitly **not** required for core true v1; they ship in **v1.1**.

**Why:** True v1 optimizes for a usable live classroom shell first; timestamped assessment analytics can follow without blocking the shell. In v1.1+, timestamps support **classroom-oriented analysis**: comparing finish-time patterns against assessment outcomes and overall course performance.

**Since:** 2026-04-15

---

## D8 — PWA-first on iPad Safari

**Decision:** The first platform target is **iPad Safari** with a **PWA-quality** experience.

**Why:** Matches primary classroom hardware expectations while staying web-deployable prior to any native iOS app.

**Since:** 2026-04-15

---

## D9 — Vite 7.x until PWA plugin peers accept Vite 8

**Decision:** Stay on **Vite 7.x** for now.

**Why:** `vite-plugin-pwa@1.2.0` currently declares peer support only through Vite 7; Vite 8 works in practice for many apps, but staying on supported peers keeps `npm install` deterministic without overrides.

**Since:** 2026-04-15

---

## D10 — Optional Google-connected backup/export is the primary durability direction

**Decision:** ClassPulse v1 does **not** require login for local use, but the primary planned durability layer beyond local IndexedDB is **optional Google-connected backup/export**, not JSON-first backup.

**Why:** This preserves frictionless classroom capture on iPad while aligning the product with the locked storage posture and the teacher-owned Google Workspace recovery path.

**Since:** 2026-04-16

---

## D11 — SessionRecord is the primary unit of work

**Decision:** `SessionRecord` is the canonical v1 unit of work, and all capture/export behavior is organized around explicit class sessions.

**Why:** Session-first structure matches real classroom periods, keeps exports legible, and prevents ambiguity about where observations belong.

**Since:** 2026-04-16

---

## D12 — Sessions close only by explicit teacher action

**Decision:** A session closes only when the teacher explicitly ends it; backgrounding or tab/app switching may trigger checkpointing but must not silently end the session.

**Why:** iPad/Safari lifecycle events are not a trustworthy proxy for classroom completion, and teachers regularly switch contexts during class.

**Since:** 2026-04-16

---

## D13 — Fixed starter event/tag vocabulary for v1

**Decision:** ClassPulse v1 uses a small fixed canonical event/tag vocabulary rather than a user-defined taxonomy builder.

**Why:** A compact fixed set is faster to use live, easier to export consistently, and less likely to fragment before real classroom usage validates customization needs.

**Since:** 2026-04-16

---

## D14 — Next bounded backup slice is JSON export + confirmed import replace

**Decision:** The **next bounded implementation slice** for backup/restore ships **JSON export** and **import that replaces** local data after explicit confirmation, with **no merge** logic in v1, as tracked in `docs/SLICE_PLAN.md` (Slice 5).

**Why:** Gives teachers an immediate, inspectable, offline-friendly recovery path while optional Google-connected backup/export (D10) lands later as an adapter without changing the v1 replace semantics for local restore.

**Since:** 2026-04-16
