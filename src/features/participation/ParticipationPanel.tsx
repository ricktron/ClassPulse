import type { ParticipationEvent } from '../../domain/participation'

interface Props {
  /** The active session's ID, or undefined when no session is active. */
  sessionId: string | undefined
  /** All participation events for the current active session, newest-first. */
  events: ParticipationEvent[]
  /** Called when the teacher taps the quick-capture button. */
  onCapture: () => void
}

/**
 * Participation quick-capture panel (Slice 3).
 *
 * Shows:
 * - An empty state when there is no active session.
 * - A capture button + recent-events list when a session is active.
 * - An empty-events state when a session is active but no events exist yet.
 */
export function ParticipationPanel({ sessionId, events, onCapture }: Props) {
  if (!sessionId) {
    return (
      <section className="panel" aria-labelledby="participation-heading">
        <h2 id="participation-heading">Participation</h2>
        <p className="muted">Start a session to capture participation events.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="participation-heading">
      <h2 id="participation-heading">Participation</h2>
      <button type="button" onClick={onCapture}>
        + Participation
      </button>
      {events.length === 0 ? (
        <p className="muted fineprint" style={{ marginTop: '0.75rem' }}>
          No participation events yet. Tap the button to capture one.
        </p>
      ) : (
        <ol className="participation-event-list" aria-label="Recent participation events">
          {events.map((ev) => (
            <li key={ev.id} className="participation-event-item">
              <time dateTime={ev.createdAt}>{formatTime(ev.createdAt)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return iso
  }
}
