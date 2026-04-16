# ClassPulse v1 Data Model + Session Lifecycle Spec

## 1. Product posture

ClassPulse v1 is a local-first classroom observation and participation notebook for teachers.

Primary goals:
- fast in-class note capture
- low friction on iPad
- reliable local persistence
- explicit session structure
- simple export/backup to Google later

Non-goals for v1:
- real-time multi-device sync
- collaborative editing
- server-authoritative data
- advanced analytics as source-of-truth requirements
- Google login as a prerequisite for classroom use

Source-of-truth posture:
- local IndexedDB is the live working store
- Google export/backup is a secondary durability layer
- session records are the canonical unit of work

See also:
- `docs/contracts/classpulse_v1_event_tag_contract.md` for the canonical v1 `eventType` and `tagCode` vocabulary

---

## 2. Identity and account posture

### 2.1 Anonymous local use
A teacher may use ClassPulse without signing in.

Anonymous/local use supports:
- creating classes
- storing rosters locally
- starting sessions
- recording observations and notes
- ending sessions
- reviewing local session history

### 2.2 Google-connected use
A teacher may optionally connect Google for backup/export.

Google-connected use additionally supports:
- export to Google Sheets
- backup of completed sessions
- backup status display
- future restore/import workflows

### 2.3 Trust rule
No-login users must still be able to save and use the app normally on the same device.
The app must clearly indicate when data is:
- local only
- backup pending
- backed up
- backup failed

---

## 3. Core domain objects

## 3.1 TeacherProfile
Represents the local teacher/app identity on a device.

Fields:
- id
- displayName
- googleConnected: boolean
- googleEmail: string | null
- createdAt
- updatedAt

Notes:
- v1 may use a simple single-user local profile
- this object exists mainly for settings and backup state

## 3.2 ClassRecord
Represents a course/class period roster container.

Fields:
- id
- title
- courseName
- periodLabel
- termLabel
- schoolYear
- colorLabel | null
- archived: boolean
- createdAt
- updatedAt

Examples:
- Ecology Honors - A Period
- Earth and Space - H Period

## 3.3 StudentRecord
Represents a student in a class roster.

Fields:
- id
- classId
- displayName
- sortName
- studentExternalId | null
- active: boolean
- notes | null
- createdAt
- updatedAt

Notes:
- v1 can be class-scoped rather than global across all classes
- avoid overcomplicating identity in v1

## 3.4 SessionRecord
Represents one active or completed classroom observation session.

Fields:
- id
- classId
- title
- sessionDate
- startedAt
- endedAt | null
- status
- locationContext | null
- lessonObjective | null
- generalNotes | null
- backupState
- lastBackupAttemptAt | null
- lastBackupSuccessAt | null
- backupErrorMessage | null
- createdAt
- updatedAt

Allowed status values:
- draft
- active
- closed

Allowed backupState values:
- local_only
- backup_pending
- backed_up
- backup_failed

Notes:
- SessionRecord is the primary unit of work in v1
- one session usually maps to one class meeting / period

## 3.5 ObservationEvent
Represents a structured observation captured during a session.

Fields:
- id
- sessionId
- classId
- studentId | null
- eventType
- tagCode | null
- valueText | null
- valueNumber | null
- noteText | null
- observedAt
- createdAt
- updatedAt

Examples:
- participation event for one student
- redirection note
- excellence / leadership note
- behavior note
- question asked
- formative check result
- whole-class note with studentId = null

Notes:
- studentId may be null for whole-class observations
- v1 should prefer append-style event creation over complex in-place mutation

## 3.6 SessionStudentNote
Optional per-student summary note within a session.

Fields:
- id
- sessionId
- classId
- studentId
- noteText
- createdAt
- updatedAt

Purpose:
- supports a quick longer-form note per student without overloading ObservationEvent

Notes:
- if desired, this can be deferred and replaced by ObservationEvent.noteText only
- include only if UX clearly benefits

## 3.7 AppSetting
Represents local app settings.

Fields:
- id
- key
- valueJson
- updatedAt

Examples:
- activeSessionId
- preferredTagSet
- autosaveEnabled
- backupOnSessionCloseEnabled

---

## 4. Recommended v1 simplification

To keep v1 lean, use only these required objects:
- TeacherProfile
- ClassRecord
- StudentRecord
- SessionRecord
- ObservationEvent
- AppSetting

Do not require SessionStudentNote unless the UX truly needs it.

That means:
- structured notes and freeform notes both live through SessionRecord.generalNotes and ObservationEvent.noteText

---

## 5. Data entry model

v1 should support two capture modes inside a session:

### 5.1 Structured event capture
Fast teacher actions:
- tap a student
- tap a tag / action
- optional quick note

Example:
- Student: Maria
- Event: participation
- Note: strong explanation of food web cascade

### 5.2 Freeform general notes
A session-level note area for:
- lesson reflections
- whole-class behavior
- reminders
- context notes

Example:
- Lots of confusion on primary vs secondary succession
- revisit with visual model tomorrow

Reason:
This hybrid approach is the most common-sense structure for classroom tools in early versions:
- structured enough for later analytics
- flexible enough for real classroom use

---

## 6. Session lifecycle

## 6.1 Session states

### draft
A session shell exists but classroom capture has not fully begun.

Typical causes:
- teacher created a session early
- auto-created session before first observation

### active
The teacher is actively using the session.

### closed
The session has been explicitly ended by the teacher.

Important:
- only explicit teacher action closes a session in v1
- backgrounding does not close a session

---

## 6.2 Session transitions

Allowed transitions:

draft -> active
active -> closed
draft -> closed only if intentionally discarded/ended by teacher workflow

Do not allow:
closed -> active as silent behavior

If reopening is needed later, do so as an explicit "resume/reopen" action.

---

## 6.3 Start session rules

A session begins when the teacher:
- taps Start Session for a selected class
- or creates a new session and makes the first meaningful entry

Required effects:
- create SessionRecord if none exists
- set status = active
- set startedAt
- store activeSessionId in AppSetting
- load roster and capture UI

---

## 6.4 During active session

While a session is active:
- all edits save locally
- ObservationEvents are appended
- general notes are updated locally
- activeSessionId remains set
- UI shows save/backup status

Important:
- local save should happen continuously or in short debounced intervals
- app should never depend on network during capture

---

## 6.5 Backgrounding behavior

When the app is backgrounded or hidden:
- do not end the session
- do not mark session closed
- perform safe local checkpoint
- optionally queue a backup attempt if appropriate
- preserve activeSessionId

Reason:
Teachers may switch away temporarily and return during the same class.

---

## 6.6 Resume behavior

When the app is reopened:
- if there is an activeSessionId for a non-closed session, reopen that session immediately
- do not force the teacher to recreate context

Optional prompt for stale sessions:
If the active session is old enough to be suspicious, show:
- Resume session
- End session
- Start new session

Recommended stale threshold for prompting:
- next calendar day
or
- more than 8 hours since last activity

Do not interrupt normal same-class returns with prompts.

---

## 6.7 End session rules

A session ends only when the teacher explicitly taps End Session.

Required effects:
- set endedAt
- set status = closed
- clear activeSessionId
- mark backupState = backup_pending if Google backup is enabled
- or keep backupState = local_only if no Google connection exists
- trigger export/backup workflow if enabled

Important:
End Session is the canonical session boundary for export and reporting.

---

## 7. Save, autosave, and backup rules

## 7.1 Local save rules
Every meaningful user change must be saved locally.

Examples:
- creating session
- changing general notes
- creating observation event
- editing class roster
- changing settings

Implementation guidance:
- use debounced writes for text areas
- use immediate writes for taps / discrete events

## 7.2 Backup rules
Backup/export is separate from local save.

Backup may be triggered by:
- explicit End Session
- manual Backup Now action
- optional background checkpoint attempt for already-closed sessions only

Do not treat backgrounding as:
- end session
- forced export boundary

## 7.3 Backup states
Each SessionRecord carries backupState:

- local_only
  saved on device only; no Google connection or no completed backup yet

- backup_pending
  session is closed and should be exported/backed up

- backed_up
  last backup/export completed successfully

- backup_failed
  at least one backup attempt failed; local copy remains authoritative

## 7.4 Failure rule
Backup failure must never delete or degrade local data.

---

## 8. Export model

## 8.1 Recommended v1 export target
Google Sheets

Reason:
- easiest for later filtering and reporting
- familiar to teachers
- structured rows scale better than prose docs

## 8.2 Export grain
One export unit per closed session

Recommended model:
- one spreadsheet per teacher/app
- one tab for sessions
- one tab for observations
- optional one tab for students/classes metadata

Alternative:
- one spreadsheet per class
This is acceptable but less flexible than a single normalized workbook.

## 8.3 Minimum export rows

### Sessions tab
Columns:
- session_id
- class_id
- class_title
- session_date
- started_at
- ended_at
- lesson_objective
- general_notes
- backup_exported_at

### Observations tab
Columns:
- observation_id
- session_id
- class_id
- class_title
- student_id
- student_name
- event_type
- tag_code
- value_text
- value_number
- note_text
- observed_at

This structure preserves future analytics flexibility.

---

## 9. UX trust requirements

The app must visibly communicate persistence state.

Required teacher-visible statuses:
- Saved locally
- Not backed up
- Backup pending
- Backed up at [timestamp]
- Backup failed

Recommended placement:
- persistent status area in session header or settings/status chip area

Reason:
Teachers must trust that notes are safe.

---

## 10. Recovery rules

## 10.1 Open session recovery
If the app reopens and an active session exists:
- restore it

## 10.2 Stale open session recovery
If an old active session still exists:
show explicit options:
- Resume
- End and back up
- Discard

## 10.3 Local-only warning
If the teacher has multiple closed sessions still marked local_only or backup_failed:
show a non-intrusive but visible reminder:
- X sessions not yet backed up

---

## 11. Recommended v1 defaults

### Session defaults
- one active session at a time
- explicit End Session required
- auto-resume same open session

### Storage defaults
- local IndexedDB is authoritative during capture
- backgrounding only checkpoints
- no network dependency during use

### Backup defaults
- Google connection optional
- export happens on End Session
- manual Backup Now available
- failed exports retryable later

### Capture defaults
- structured observation events
- optional quick note per event
- general session notes allowed

---

## 12. Deferred to v2 or later

- multi-device live sync
- shared/co-teacher sessions
- Google Classroom roster sync
- server-authoritative storage
- real-time dashboards
- advanced analytics
- rubric engines
- AI-generated summaries as core workflow
- cross-session merge/conflict resolution

---

## 13. Canonical v1 product rules summary

- No login is required for local use
- Local IndexedDB stores all live working data
- SessionRecord is the primary unit of work
- ObservationEvent is the primary structured capture unit
- A session closes only by explicit teacher action
- Backgrounding triggers checkpointing, not closure
- Google connection is required only for backup/export
- Export occurs per closed session into Google Sheets
- Local data remains authoritative if backup fails
