import { useCallback, useEffect, useState } from 'react'
import type { SessionModeV1 } from '../../domain/modes'
import { SESSION_MODES_V1 } from '../../domain/modes'
import type { ParticipationEvent } from '../../domain/participation'
import type { SessionRecord } from '../../domain/session'
import { resolveActiveSession } from '../../domain/session'
import { getDatabase } from '../../db/database'
import { ParticipationPanel } from '../participation/ParticipationPanel'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; sessions: SessionRecord[]; participationEvents: ParticipationEvent[] }

async function loadSessionsFromDb(): Promise<SessionRecord[]> {
  const db = await getDatabase()
  return db.sessions.orderBy('startedAt').reverse().toArray()
}

async function loadParticipationEventsForSession(sessionId: string): Promise<ParticipationEvent[]> {
  const db = await getDatabase()
  const rows = await db.participationEvents.where('sessionId').equals(sessionId).toArray()
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function AppShell() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const sessions = await loadSessionsFromDb()
        const active = resolveActiveSession(sessions)
        const participationEvents = active
          ? await loadParticipationEventsForSession(active.id)
          : []
        if (!cancelled) {
          setState({ status: 'ready', sessions, participationEvents })
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
   * Mode strip persistence (Slice 1): exactly one `activeMode` on the active session row.
   * Writes go straight to Dexie `sessions`; reload remounts and re-reads the same row.
   */
  const selectMode = useCallback(async (mode: SessionModeV1, sessionId: string) => {
    const db = await getDatabase()
    await db.sessions.update(sessionId, { activeMode: mode })
    const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
    const active = resolveActiveSession(sessions)
    const participationEvents = active
      ? await loadParticipationEventsForSession(active.id)
      : []
    setState({ status: 'ready', sessions, participationEvents })
  }, [])

  /**
   * Slice 2: Start a new session. The new session immediately becomes active.
   * Default mode is participation — the fresh local default.
   */
  const startSession = useCallback(async () => {
    const db = await getDatabase()
    const now = new Date().toISOString()
    const newSession: SessionRecord = {
      id: crypto.randomUUID(),
      title: `Session – ${now.slice(0, 10)}`,
      startedAt: now,
      activeMode: 'participation',
    }
    await db.sessions.add(newSession)
    const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
    const active = resolveActiveSession(sessions)
    const participationEvents = active
      ? await loadParticipationEventsForSession(active.id)
      : []
    setState({ status: 'ready', sessions, participationEvents })
  }, [])

  /**
   * Slice 2: End the active session. Sets `endedAt`; the session is no longer
   * treated as active by `resolveActiveSession`. The shell transitions to the
   * no-active-session empty state.
   */
  const endSession = useCallback(async (sessionId: string) => {
    const db = await getDatabase()
    await db.sessions.update(sessionId, { endedAt: new Date().toISOString() })
    const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
    setState({ status: 'ready', sessions, participationEvents: [] })
  }, [])

  /**
   * Slice 3: Append a minimal participation event for the active session.
   * Append-only; no editing or deletion workflow in v1.
   */
  const captureParticipation = useCallback(async (sessionId: string) => {
    const db = await getDatabase()
    const event: ParticipationEvent = {
      id: crypto.randomUUID(),
      sessionId,
      createdAt: new Date().toISOString(),
    }
    await db.participationEvents.add(event)
    const events = await loadParticipationEventsForSession(sessionId)
    setState((prev) =>
      prev.status === 'ready' ? { ...prev, participationEvents: events } : prev,
    )
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

  const active = resolveActiveSession(state.sessions)

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
        {active ? (
          <div>
            <p className="session-title">{active.title}</p>
            <p className="muted">
              Started <time dateTime={active.startedAt}>{active.startedAt}</time>
            </p>
            <p className="muted">
              Active mode: <strong>{active.activeMode}</strong>
            </p>
            <button
              type="button"
              onClick={() => void endSession(active.id)}
            >
              End session
            </button>
          </div>
        ) : (
          <div>
            <p className="muted">No active session.</p>
            <button type="button" onClick={() => void startSession()}>
              Start session
            </button>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="modes-heading">
        <h2 id="modes-heading">v1 mode strip</h2>
        <ul className="mode-list" aria-label="V1 modes">
          {SESSION_MODES_V1.map((mode) => {
            const isActive = mode === active?.activeMode
            return (
              <li key={mode}>
                <button
                  type="button"
                  className={isActive ? 'mode-pill active' : 'mode-pill'}
                  aria-pressed={isActive}
                  disabled={!active}
                  onClick={() => {
                    if (!active || active.activeMode === mode) return
                    void selectMode(mode, active.id)
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

      <ParticipationPanel
        sessionId={active?.id}
        events={state.participationEvents}
        onCapture={() => {
          if (active) void captureParticipation(active.id)
        }}
      />
    </main>
  )
}
