/**
 * Bathroom hall-pass style signals for v1 quick capture.
 *
 * `depart` — student left for the restroom.
 * `return` — student returned from the restroom.
 *
 * Append-only rows keyed to a session; future slices may add studentId, notes, etc.
 */
export type BathroomEventKind = 'depart' | 'return'

export interface BathroomEvent {
  id: string
  sessionId: string
  createdAt: string
  kind: BathroomEventKind
}
