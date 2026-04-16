/**
 * Minimal participation event for v1.
 *
 * Shape is intentionally small. Future slices may add:
 *   studentId, tag, note, weight, eventPackId, etc.
 * Prefer appending new events over mutating existing ones.
 */
export interface ParticipationEvent {
  /** UUID – primary key */
  id: string
  /** Links this event to exactly one session (foreign key: sessions.id). */
  sessionId: string
  /** ISO 8601 timestamp of when the teacher tapped the capture button. */
  createdAt: string
}
