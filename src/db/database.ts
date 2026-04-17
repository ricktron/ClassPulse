import Dexie, { type EntityTable } from 'dexie'
import type { AssessmentEvent } from '../domain/assessment'
import type { BathroomEvent } from '../domain/bathroom'
import type { BehaviorEvent } from '../domain/behavior'
import type { ParticipationEvent } from '../domain/participation'
import type { AppSettingRecord } from '../domain/settings'
import type { SessionRecord } from '../domain/session'

/** Current Dexie schema version (bump when `stores` change). Used by JSON backup metadata. */
export const CLASSPULSE_DEXIE_SCHEMA_VERSION = 5 as const

export class ClassPulseDB extends Dexie {
  sessions!: EntityTable<SessionRecord, 'id'>
  settings!: EntityTable<AppSettingRecord, 'key'>
  participationEvents!: EntityTable<ParticipationEvent, 'id'>
  behaviorEvents!: EntityTable<BehaviorEvent, 'id'>
  bathroomEvents!: EntityTable<BathroomEvent, 'id'>
  assessmentEvents!: EntityTable<AssessmentEvent, 'id'>

  constructor() {
    super('classpulse')
    this.version(1).stores({
      sessions: 'id, startedAt',
      settings: 'key',
    })
    this.version(2).stores({
      sessions: 'id, startedAt',
      settings: 'key',
      participationEvents: 'id, sessionId, createdAt',
    })
    this.version(3).stores({
      sessions: 'id, startedAt',
      settings: 'key',
      participationEvents: 'id, sessionId, createdAt',
      behaviorEvents: 'id, sessionId, createdAt',
    })
    this.version(4).stores({
      sessions: 'id, startedAt',
      settings: 'key',
      participationEvents: 'id, sessionId, createdAt',
      behaviorEvents: 'id, sessionId, createdAt',
      bathroomEvents: 'id, sessionId, createdAt',
    })
    this.version(5).stores({
      sessions: 'id, startedAt',
      settings: 'key',
      participationEvents: 'id, sessionId, createdAt',
      behaviorEvents: 'id, sessionId, createdAt',
      bathroomEvents: 'id, sessionId, createdAt',
      assessmentEvents: 'id, sessionId, createdAt',
    })
  }
}

const DB_NAME = 'classpulse'

let dbPromise: Promise<ClassPulseDB> | null = null

export function getDatabase(): Promise<ClassPulseDB> {
  if (!dbPromise) {
    dbPromise = (async (): Promise<ClassPulseDB> => {
      const db = new ClassPulseDB()
      await db.open()
      return db
    })()
  }
  return dbPromise
}

/**
 * Test-only: closes singleton and deletes IndexedDB database.
 * Do not call from production UI paths.
 */
export async function resetDatabaseForTests(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise
      await db.close()
    } catch {
      // If open failed, still attempt to wipe the file.
    }
  }
  dbPromise = null
  await Dexie.delete(DB_NAME)
}
