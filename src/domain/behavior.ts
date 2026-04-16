/**
 * Behavior event kinds for v1.
 *
 * Kept as a union so future slices can extend it (e.g. 'praise', 'disruption',
 * event-pack-defined strings) without breaking existing records.
 */
export type BehaviorEventKind = 'positive' | 'redirect'

/**
 * Minimal behavior event for v1.
 *
 * Shape is intentionally small. Future slices may add:
 *   studentId, tag, note, severity, eventPackId, etc.
 * Prefer appending new events over mutating existing ones.
 */
export interface BehaviorEvent {
  /** UUID – primary key */
  id: string
  /** Links this event to exactly one session (foreign key: sessions.id). */
  sessionId: string
  /** ISO 8601 timestamp of when the teacher tapped the capture button. */
  createdAt: string
  /** The kind of behavior captured. */
  kind: BehaviorEventKind
}
