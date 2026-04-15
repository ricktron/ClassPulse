# Privacy & data handling

## Summary posture

ClassPulse is designed **local-first**: classroom observations and participation notes should remain **on the teacher’s device** under normal operation. Nothing in the current scaffold sends classroom data to remote servers automatically.

## What the scaffold stores

- **IndexedDB database name:** `classpulse`  
- **Tables (v1 schema):** `sessions`, `settings`  
- **Seed data:** a disposable sample session is created **only** when the database is empty, to make the architecture visible during development.

## Backups and exports (contract, not yet fully implemented)

- **Authoritative backup format:** JSON on disk (or teacher-controlled cloud folders), per `docs/V1_SCOPE.md`.  
- **Import:** must **replace** local data after explicit confirmation — **no merge** in v1.  
- Teachers should treat backup files like credentials: they can contain **student-related** information depending on how the product is used.

## Third parties

- The scaffold does **not** embed analytics SDKs, error reporting, or advertising trackers.  
- Adding telemetry or cloud sync requires updating this document, `DECISIONS.md`, and the implementation plan for the slice that introduces it.

## Google Workspace backup (named posture)

The product direction includes **optional** backup to teacher-controlled Google Workspace surfaces. Until an explicit slice ships that feature, **no Google tokens or APIs are invoked** by this repository.

## Classroom safety notes

- Prefer the **least data necessary** per capture type when designing future event packs.  
- Favor **explicit teacher actions** for any sharing or export.  
- Document any future PHI/FERPA considerations before enabling integrations that could cause regulated data to leave the device.
