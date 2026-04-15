# ClassPulse — Project brief

## Product

ClassPulse is a **local-first classroom observation and participation notebook** for teachers. It is optimized for **live class use**: quick captures, structured participation signals, behavior notes, bathroom requests, lightweight assessments, and free-form notes — without assuming constant connectivity.

## Primary user and device model (v1)

- **One teacher per device/app instance** in true v1.  
- A **session** represents **one class meeting**.  
- First-class platform target: **iPad Safari** with a **PWA-quality** installable experience. Longer term, a **native iOS app** is plausible, but not required for true v1.

## What “usable live classroom shell” means

Teachers can run a single meeting session, move between the fixed v1 modes, and trust that data stays on-device unless they explicitly export/import backup JSON. The shell should feel dependable in the room: fast, obvious, and tolerant of offline use.

## Positioning vs later releases

- **True v1:** live workflow shell, local persistence, JSON backup contract.  
- **Later (v2+):** reports, dashboards, analytics, transcript workflows, and hall-pass cross-reference — explicitly **not** part of true v1 delivery.

## Naming: storage posture

The durable storage/identity posture is referred to as **Local-First + Google Workspace Backup**. True v1 **does not** require Google login or automated workspace sync; the name captures the intended longer-horizon backup story without binding the scaffold to cloud code paths.
