import Dexie, { type EntityTable } from 'dexie'
import type { AppSettingRecord } from '../domain/settings'
import type { SessionRecord } from '../domain/session'

export class ClassPulseDB extends Dexie {
  sessions!: EntityTable<SessionRecord, 'id'>
  settings!: EntityTable<AppSettingRecord, 'key'>

  constructor() {
    super('classpulse')
    this.version(1).stores({
      sessions: 'id, startedAt',
      settings: 'key',
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
