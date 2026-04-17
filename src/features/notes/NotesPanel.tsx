import { useCallback, useEffect, useRef, useState } from 'react'

/** Autosave delay after typing stops (Slice 7). */
export const NOTES_AUTOSAVE_DEBOUNCE_MS = 400

interface Props {
  /** Active session id, or undefined when there is no active session. */
  sessionId: string | undefined
  /** Current persisted note text for the active session (device-local). */
  sessionNotes: string
  /** Persist free-form notes to Dexie on the session row. */
  onPersist: (text: string) => void
}

/**
 * Session-scoped teacher notes (Slice 7).
 *
 * Plain textarea only — no rich text. Editing requires an active session;
 * text is debounced to Dexie for low-friction live use.
 */
export function NotesPanel({ sessionId, sessionNotes, onPersist }: Props) {
  const [draft, setDraft] = useState(sessionNotes)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep draft aligned when the parent reloads session rows (import / `reloadFromDb`) without unmounting.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional prop→local sync for external store reloads
    setDraft(sessionNotes)
  }, [sessionId, sessionNotes])

  const flushTimer = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
  }, [])

  const schedulePersist = useCallback(
    (text: string) => {
      flushTimer()
      saveTimer.current = setTimeout(() => {
        onPersist(text)
        saveTimer.current = null
      }, NOTES_AUTOSAVE_DEBOUNCE_MS)
    },
    [flushTimer, onPersist],
  )

  useEffect(() => () => flushTimer(), [flushTimer])

  if (!sessionId) {
    return (
      <section className="panel" aria-labelledby="notes-heading">
        <h2 id="notes-heading">Notes</h2>
        <p className="muted">Start a session to add session notes. Notes save on this device only.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-labelledby="notes-heading">
      <h2 id="notes-heading">Notes</h2>
      <p className="muted fineprint" style={{ marginBottom: '0.65rem' }}>
        Free-form notes for this session. Saved automatically on this device.
      </p>
      <textarea
        className="notes-textarea"
        aria-labelledby="notes-heading"
        value={draft}
        onChange={(e) => {
          const next = e.target.value
          setDraft(next)
          schedulePersist(next)
        }}
        onBlur={(e) => {
          flushTimer()
          onPersist(e.currentTarget.value)
        }}
        rows={6}
        spellCheck
      />
    </section>
  )
}
