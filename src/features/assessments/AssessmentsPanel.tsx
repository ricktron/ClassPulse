import type { AssessmentEvent, AssessmentEventKind } from '../../domain/assessment'

interface Props {
  sessionId: string | undefined
  events: AssessmentEvent[]
  onCapture: (kind: AssessmentEventKind) => void
}

/**
 * Assessments quick-capture panel (Slice 8 — Assessments shell MVP).
 *
 * Minimal session-scoped signal: two taps for live check-for-understanding.
 * Deliberately not a grading surface; no completion timestamps, no rubrics,
 * no roster. Append-only rows keyed to the active session.
 */
export function AssessmentsPanel({ sessionId, events, onCapture }: Props) {
  if (!sessionId) {
    return (
      <section className="panel" aria-labelledby="assessments-heading">
        <h2 id="assessments-heading">Assessments</h2>
        <p className="muted">Start a session to capture assessment checks.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="assessments-heading">
      <h2 id="assessments-heading">Assessments</h2>
      <p className="muted fineprint" style={{ marginTop: 0, marginBottom: '0.65rem' }}>
        Quick check-for-understanding signal for this session. Not a gradebook.
      </p>
      <div className="assessments-capture-actions">
        <button type="button" onClick={() => onCapture('check_pass')}>
          + Got it
        </button>
        <button type="button" onClick={() => onCapture('check_fail')}>
          + Needs reteach
        </button>
      </div>
      {events.length === 0 ? (
        <p className="muted fineprint" style={{ marginTop: '0.75rem' }}>
          No assessment checks yet. Tap Got it or Needs reteach during class.
        </p>
      ) : (
        <ol className="assessments-event-list" aria-label="Recent assessment checks">
          {events.map((ev) => (
            <li key={ev.id} className="assessments-event-item">
              <span className="assessments-event-kind">{labelForKind(ev.kind)}</span>
              {' · '}
              <time dateTime={ev.createdAt}>{formatTime(ev.createdAt)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function labelForKind(kind: AssessmentEventKind): string {
  return kind === 'check_pass' ? 'got it' : 'needs reteach'
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
