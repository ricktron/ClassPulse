import type { BehaviorEvent, BehaviorEventKind } from '../../domain/behavior'

interface Props {
  /** The active session's ID, or undefined when no session is active. */
  sessionId: string | undefined
  /** All behavior events for the current active session, newest-first. */
  events: BehaviorEvent[]
  /** Called when the teacher taps a quick-capture button. */
  onCapture: (kind: BehaviorEventKind) => void
}

/**
 * Behavior quick-capture panel (Slice 4).
 *
 * Shows:
 * - An empty state when there is no active session.
 * - Two capture buttons (+ Positive, + Redirect) when a session is active.
 * - An empty-events state when a session is active but no events exist yet.
 * - A recent-events list (timestamp + kind) for the current session.
 */
export function BehaviorPanel({ sessionId, events, onCapture }: Props) {
  if (!sessionId) {
    return (
      <section className="panel" aria-labelledby="behavior-heading">
        <h2 id="behavior-heading">Behavior</h2>
        <p className="muted">Start a session to capture behavior events.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="behavior-heading">
      <h2 id="behavior-heading">Behavior</h2>
      <div className="behavior-capture-actions">
        <button type="button" onClick={() => onCapture('positive')}>
          + Positive
        </button>
        <button type="button" onClick={() => onCapture('redirect')}>
          + Redirect
        </button>
      </div>
      {events.length === 0 ? (
        <p className="muted fineprint" style={{ marginTop: '0.75rem' }}>
          No behavior events yet. Tap a button to capture one.
        </p>
      ) : (
        <ol className="behavior-event-list" aria-label="Recent behavior events">
          {events.map((ev) => (
            <li key={ev.id} className="behavior-event-item">
              <span className="behavior-event-kind">{ev.kind}</span>
              {' · '}
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
    return new Date(iso).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return iso
  }
}
