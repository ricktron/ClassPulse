import type { BathroomEvent, BathroomEventKind } from '../../domain/bathroom'

interface Props {
  sessionId: string | undefined
  events: BathroomEvent[]
  onCapture: (kind: BathroomEventKind) => void
}

/**
 * Bathroom quick-capture panel (Slice 6).
 *
 * Two obvious taps for live class use: student left, student returned.
 */
export function BathroomPanel({ sessionId, events, onCapture }: Props) {
  if (!sessionId) {
    return (
      <section className="panel" aria-labelledby="bathroom-heading">
        <h2 id="bathroom-heading">Bathroom</h2>
        <p className="muted">Start a session to capture bathroom events.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="bathroom-heading">
      <h2 id="bathroom-heading">Bathroom</h2>
      <div className="bathroom-capture-actions">
        <button type="button" onClick={() => onCapture('depart')}>
          + Out
        </button>
        <button type="button" onClick={() => onCapture('return')}>
          + Back
        </button>
      </div>
      {events.length === 0 ? (
        <p className="muted fineprint" style={{ marginTop: '0.75rem' }}>
          No bathroom events yet. Tap Out when a student leaves and Back when they return.
        </p>
      ) : (
        <ol className="bathroom-event-list" aria-label="Recent bathroom events">
          {events.map((ev) => (
            <li key={ev.id} className="bathroom-event-item">
              <span className="bathroom-event-kind">{labelForKind(ev.kind)}</span>
              {' · '}
              <time dateTime={ev.createdAt}>{formatTime(ev.createdAt)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function labelForKind(kind: BathroomEventKind): string {
  return kind === 'depart' ? 'out' : 'back'
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
