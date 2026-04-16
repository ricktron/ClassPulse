import type { SessionModeV1 } from './modes'

/** One class meeting in v1. */
export interface SessionRecord {
  id: string
  title: string
  startedAt: string
  /**
   * ISO timestamp when the teacher explicitly ended this session.
   * Undefined means the session is currently active.
   */
  endedAt?: string
  /**
   * Active top-level mode for this meeting on this device (v1: one teacher / one app instance).
   * Persisted in Dexie; the mode strip reads and updates this field only — no separate settings row.
   */
  activeMode: SessionModeV1
}

/** A session is active when it has not been explicitly ended by the teacher. */
export function isActiveSession(session: SessionRecord): boolean {
  return session.endedAt === undefined
}

/**
 * Resolves the single live session for the shell.
 *
 * Rule: an active session has no `endedAt`. If more than one active session
 * exists (unexpected in normal use), the most-recently-started one wins.
 * This rule is explicit here rather than relying silently on sort order elsewhere.
 */
export function resolveActiveSession(sessions: SessionRecord[]): SessionRecord | undefined {
  const active = sessions.filter(isActiveSession)
  if (active.length === 0) return undefined
  return active.reduce((best, s) => (s.startedAt > best.startedAt ? s : best))
}
