import { getDatabase } from '../../db/database'
import type { BathroomEvent } from '../../domain/bathroom'
import type { BehaviorEvent } from '../../domain/behavior'
import type { ParticipationEvent } from '../../domain/participation'
import type { SessionRecord } from '../../domain/session'
import { resolveActiveSession } from '../../domain/session'

export type ShellReadySnapshot = {
  sessions: SessionRecord[]
  participationEvents: ParticipationEvent[]
  behaviorEvents: BehaviorEvent[]
  bathroomEvents: BathroomEvent[]
}

/**
 * Loads everything the shell needs: all sessions (newest first) plus capture
 * lists for whichever session is currently active.
 */
export async function loadShellReadySnapshot(): Promise<ShellReadySnapshot> {
  const db = await getDatabase()
  const sessions = await db.sessions.orderBy('startedAt').reverse().toArray()
  const active = resolveActiveSession(sessions)
  const participationEvents = active
    ? (await db.participationEvents.where('sessionId').equals(active.id).toArray()).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
    : []
  const behaviorEvents = active
    ? (await db.behaviorEvents.where('sessionId').equals(active.id).toArray()).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
    : []
  const bathroomEvents = active
    ? (await db.bathroomEvents.where('sessionId').equals(active.id).toArray()).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
    : []
  return { sessions, participationEvents, behaviorEvents, bathroomEvents }
}
