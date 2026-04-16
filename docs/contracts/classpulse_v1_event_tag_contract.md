# ClassPulse v1 Event and Tag Contract

## 1. Purpose

This document defines the canonical v1 event and tag vocabulary for ClassPulse.

It exists to keep the product aligned across:
- capture UI
- local data model usage
- export structure
- reporting readiness
- future implementation prompts

This is a v1 contract, not a claim that the vocabulary is final forever.
The goal is to lock a small, high-utility starter set that works in real classrooms without creating taxonomy sprawl.

---

## 2. Product posture

ClassPulse v1 is a fast classroom notebook, not a full behavior-management platform and not a gradebook.

Therefore, the v1 event/tag system must be:
- fast to use live on iPad
- understandable at a glance
- broad enough for daily teaching use
- limited enough to avoid hesitation and overclassification
- neutral enough to support later summary/reporting without sounding overly punitive

---

## 3. Canonical model

In v1, an ObservationEvent records what happened.

Each ObservationEvent may include:
- one required `eventType`
- zero or one optional `tagCode`
- optional free-text note
- optional numeric/text value where needed
- optional student association
- timestamp

### Rule
`eventType` is the primary classification.

`tagCode` is a lightweight secondary qualifier, not a competing parallel system.

Do not build v1 around multiple mandatory tags per event.

---

## 4. Canonical v1 event types

The following `eventType` values are the allowed starter set for v1.

## 4.1 participation
Use when a student actively contributes to class activity, discussion, or task engagement.

Examples:
- answers a question
- contributes to discussion
- volunteers an idea
- participates appropriately in task

Notes:
- this is the default positive academic engagement event
- do not require a note for routine use

## 4.2 positive_contribution
Use when a student’s contribution is notably helpful, thoughtful, insightful, or constructive beyond baseline participation.

Examples:
- strong explanation
- insightful connection
- high-quality comment
- helps move discussion forward

Notes:
- use this when the contribution is meaningfully stronger than ordinary participation

## 4.3 question
Use when a student asks a question worth recording.

Examples:
- asks a clarifying question
- raises a thoughtful challenge
- identifies confusion that matters instructionally

Notes:
- can be neutral or positive
- use note text when the substance of the question matters

## 4.4 check_for_understanding
Use when recording an observable result of formative understanding during class.

Examples:
- student demonstrates understanding
- student appears confused
- student misses a concept check
- student successfully explains process

Notes:
- this is not a graded assessment event
- use `tagCode` to qualify the result where helpful

## 4.5 collaboration
Use when a student’s collaboration behavior is worth noting.

Examples:
- supports group work well
- listens and responds productively
- contributes well to team process
- group interaction issue worth tracking

Notes:
- collaboration may be positive or concerning depending on note/tag context

## 4.6 preparedness
Use when readiness, materials, or readiness-to-work is the main thing being captured.

Examples:
- arrived prepared
- lacked materials
- began quickly
- clearly unprepared

Notes:
- use sparingly and only when it matters enough to record

## 4.7 leadership
Use when a student productively leads, models, organizes, or helps others in a notable way.

Examples:
- takes initiative
- helps peers appropriately
- models expectations
- elevates group function

Notes:
- this is a stronger positive signal than ordinary participation

## 4.8 off_task
Use when a student is disengaged, distracted, or not participating appropriately.

Examples:
- visibly disengaged
- not working during work time
- distracted from task
- redirect likely needed

Notes:
- use for observation of concern, not necessarily disciplinary escalation

## 4.9 redirect
Use when teacher intervention or correction occurs and is worth recording.

Examples:
- verbal redirect given
- needed reminder to re-engage
- behavior/course correction
- repeated prompting needed

Notes:
- this is the canonical “teacher had to intervene” event
- do not overload `off_task` to mean “intervened”

## 4.10 teacher_note
Use for a student-specific note that does not fit neatly into the other categories.

Examples:
- context note
- follow-up reminder
- pattern worth remembering
- private instructional note

Notes:
- this is the flexible bucket for student-linked narrative capture
- should not become the default for everything

## 4.11 whole_class_note
Use for a session-level note about the class as a whole rather than one student.

Examples:
- widespread confusion on concept
- strong energy today
- many students struggled with setup
- revisit concept tomorrow

Notes:
- store with `studentId = null`
- use when the note belongs to the session rather than an individual

---

## 5. Canonical v1 tag codes

Tags are optional secondary qualifiers. They should stay compact.

Use `tagCode` only where it adds useful signal without slowing the teacher down.

The following v1 `tagCode` values are allowed:

## 5.1 strong
Use when the event reflects clearly strong performance or contribution.

Often used with:
- participation
- positive_contribution
- leadership
- collaboration

## 5.2 notable
Use when the event is worth highlighting but does not necessarily imply excellence or concern.

Often used with:
- question
- teacher_note
- whole_class_note

## 5.3 concern
Use when the event reflects a noticeable issue or emerging problem.

Often used with:
- off_task
- preparedness
- collaboration
- check_for_understanding

## 5.4 repeated
Use when the same issue or positive behavior has occurred more than once and repetition matters.

Often used with:
- redirect
- off_task
- leadership
- preparedness

## 5.5 resolved
Use when a previously concerning issue improved during the same session.

Often used with:
- redirect
- off_task
- collaboration

## 5.6 follow_up
Use when the event should inform future attention, conversation, reteaching, or later review.

Often used with:
- teacher_note
- question
- check_for_understanding
- whole_class_note

---

## 6. Usage rules

## 6.1 One event type first
Every ObservationEvent should have exactly one primary `eventType`.

## 6.2 Tag is optional
Do not require a `tagCode` for every event.

## 6.3 Free text stays allowed
A short note may be added whenever the teacher needs specificity.

Examples:
- "strong explanation of carrying capacity"
- "needed second redirect during lab setup"
- "asked whether succession always begins with bare rock"

## 6.4 Avoid double-classifying the same moment
Do not encourage the teacher to log multiple events for the exact same moment unless there is a real reason.

Example:
If a student gives an especially thoughtful answer, use:
- `positive_contribution`
not both:
- `participation`
- `positive_contribution`

## 6.5 Use whole_class_note for broad context
Do not force class-level observations onto a random student record.

## 6.6 Redirect is intervention, off_task is observation
This distinction must remain clear:
- `off_task` = observed concern
- `redirect` = teacher action/intervention

## 6.7 teacher_note is a pressure-release valve
Use `teacher_note` when none of the standard categories fit cleanly.
Do not let it become the main event type in normal use.

---

## 7. Recommended v1 quick-capture defaults

The default live-use buttons should prioritize the highest-frequency events:

Primary quick actions:
- participation
- positive_contribution
- question
- off_task
- redirect
- whole_class_note

Secondary/expanded actions:
- check_for_understanding
- collaboration
- preparedness
- leadership
- teacher_note

Reason:
This keeps the most common teacher actions fast while preserving richer categories when needed.

---

## 8. Export expectations

When exporting to Google Sheets or another structured format:

### Observations table minimum columns
- observation_id
- session_id
- class_id
- class_title
- student_id
- student_name
- event_type
- tag_code
- note_text
- value_text
- value_number
- observed_at

### Semantics
- `event_type` must use only canonical values from this contract
- `tag_code` must use only canonical values from this contract or be blank
- `whole_class_note` records should have blank/null student fields

---

## 9. Analytics posture

The v1 event/tag system should support later summaries and counts, but analytics should not distort capture design.

Therefore:
- optimize first for live usability
- accept that not every classroom moment will be tagged
- avoid excessive granularity
- treat free text as supporting context, not failure of the system

Examples of future-friendly counts enabled by this contract:
- participation counts by student
- positive contribution frequency
- redirects by session
- whole-class confusion patterns via notes/check-for-understanding
- preparedness and collaboration trends

---

## 10. Non-goals for v1 taxonomy

Do not add in v1:
- dozens of behavior subtypes
- standards-aligned mastery codes
- grading categories
- punitive discipline taxonomy
- sentiment scoring
- AI-generated labels as source of truth
- multi-tag required workflows
- teacher-custom taxonomy builder

These can be revisited later only if real usage proves the need.

---

## 11. Deferred candidates for later versions

Possible v2+ additions if real usage supports them:
- absent
- tardy
- device_misuse
- disruption
- encouragement
- perseverance
- misconception
- reteach_needed
- exemplary_work
- peer_support

These are intentionally deferred to keep v1 small and usable.

---

## 12. Canonical v1 summary

The canonical v1 event types are:
- participation
- positive_contribution
- question
- check_for_understanding
- collaboration
- preparedness
- leadership
- off_task
- redirect
- teacher_note
- whole_class_note

The canonical v1 tag codes are:
- strong
- notable
- concern
- repeated
- resolved
- follow_up

This set is intentionally small, teacher-usable, and sufficient for v1 local-first classroom capture.
