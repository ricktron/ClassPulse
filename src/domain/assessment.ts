/**
 * Assessment event kinds for the Slice 8 Assessments shell MVP.
 *
 * `check_pass` — teacher observed that the student / class appears to understand.
 * `check_fail` — teacher observed that the student / class does not yet appear to understand.
 *
 * `createdAt` on these events is the **capture time** (when the teacher tapped),
 * not a student assessment-completion time. Completion timestamps remain deferred
 * per `DECISIONS.md` D7.
 */
export type AssessmentEventKind = 'check_pass' | 'check_fail'

export interface AssessmentEvent {
  id: string
  sessionId: string
  createdAt: string
  kind: AssessmentEventKind
}
