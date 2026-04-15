import { useEffect, useState } from 'react'
import { SESSION_MODES_V1 } from '../../domain/modes'
import type { SessionRecord } from '../../domain/session'
import { getDatabase } from '../../db/database'
import { seedSampleDataIfEmpty } from '../../db/seed'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; sessions: SessionRecord[] }

export function AppShell() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const db = await getDatabase()
        await seedSampleDataIfEmpty(db)
        const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
        if (!cancelled) {
          setState({ status: 'ready', sessions })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (!cancelled) {
          setState({ status: 'error', message })
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <main className="shell">
        <p className="muted">Loading local store…</p>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main className="shell">
        <p role="alert">Could not open IndexedDB: {state.message}</p>
      </main>
    )
  }

  const primary = state.sessions[0]

  return (
    <main className="shell">
      <header className="shell-header">
        <h1>ClassPulse</h1>
        <p className="muted">
          Local-first classroom shell — v1 modes are fixed; this UI is scaffolding
          only.
        </p>
      </header>

      <section className="panel" aria-labelledby="sessions-heading">
        <h2 id="sessions-heading">Session (device-local)</h2>
        {primary ? (
          <div>
            <p className="session-title">{primary.title}</p>
            <p className="muted">
              Started <time dateTime={primary.startedAt}>{primary.startedAt}</time>
            </p>
            <p className="muted">
              Active mode: <strong>{primary.activeMode}</strong>
            </p>
          </div>
        ) : (
          <p className="muted">No session rows yet (unexpected after seed).</p>
        )}
      </section>

      <section className="panel" aria-labelledby="modes-heading">
        <h2 id="modes-heading">v1 mode strip (read-only placeholder)</h2>
        <ul className="mode-list" aria-label="V1 modes">
          {SESSION_MODES_V1.map((mode) => (
            <li key={mode}>
              <span
                className={
                  mode === primary?.activeMode ? 'mode-pill active' : 'mode-pill'
                }
              >
                {mode}
              </span>
            </li>
          ))}
        </ul>
        <p className="muted fineprint">
          Socratic flows belong under Participation. Event packs per mode are
          teacher-editable in future slices.
        </p>
      </section>
    </main>
  )
}
