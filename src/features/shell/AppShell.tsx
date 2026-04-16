import { useCallback, useEffect, useState } from 'react'
import type { SessionModeV1 } from '../../domain/modes'
import { SESSION_MODES_V1 } from '../../domain/modes'
import type { SessionRecord } from '../../domain/session'
import { getDatabase } from '../../db/database'
import { seedSampleDataIfEmpty } from '../../db/seed'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; sessions: SessionRecord[] }

async function loadSessionsFromDb(): Promise<SessionRecord[]> {
  const db = await getDatabase()
  await seedSampleDataIfEmpty(db)
  return db.sessions.orderBy('startedAt').reverse().toArray()
}

export function AppShell() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const sessions = await loadSessionsFromDb()
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

  /**
   * Mode strip persistence (Slice 1): exactly one `activeMode` on the primary session row.
   * Writes go straight to Dexie `sessions`; reload remounts and re-reads the same row.
   * No event log, packs, or settings-table indirection in this slice.
   */
  const selectMode = useCallback(async (mode: SessionModeV1, primaryId: string) => {
    const db = await getDatabase()
    await db.sessions.update(primaryId, { activeMode: mode })
    const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
    setState({ status: 'ready', sessions })
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
        <h2 id="modes-heading">v1 mode strip</h2>
        <ul className="mode-list" aria-label="V1 modes">
          {SESSION_MODES_V1.map((mode) => {
            const isActive = mode === primary?.activeMode
            return (
              <li key={mode}>
                <button
                  type="button"
                  className={isActive ? 'mode-pill active' : 'mode-pill'}
                  aria-pressed={isActive}
                  disabled={!primary}
                  onClick={() => {
                    if (!primary || primary.activeMode === mode) return
                    void selectMode(mode, primary.id)
                  }}
                >
                  {mode}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="muted fineprint">
          Socratic flows belong under Participation. Event packs per mode are
          teacher-editable in future slices.
        </p>
      </section>
    </main>
  )
}
