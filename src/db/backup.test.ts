import { afterEach, describe, expect, it } from 'vitest'
import {
  BackupValidationError,
  CLASSPULSE_LOCAL_BACKUP_FORMAT,
  CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
  buildLocalBackupFile,
  parseAndValidateLocalBackupJson,
  readBackupTablesFromDb,
  replaceLocalDatabaseFromBackupTables,
  serializeLocalBackupFile,
} from './backup'
import { CLASSPULSE_DEXIE_SCHEMA_VERSION, ClassPulseDB, resetDatabaseForTests } from './database'
import { seedSampleDataIfEmpty } from './seed'

describe('local JSON backup', () => {
  afterEach(async () => {
    await resetDatabaseForTests()
  })

  it('export payload includes self-describing metadata and all table arrays', async () => {
    const db = new ClassPulseDB()
    await db.open()
    await seedSampleDataIfEmpty(db)

    const doc = await buildLocalBackupFile(db)
    expect(doc.format).toBe(CLASSPULSE_LOCAL_BACKUP_FORMAT)
    expect(doc.formatVersion).toBe(CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION)
    expect(typeof doc.exportedAt).toBe('string')
    expect(doc.dexieSchemaVersion).toBe(CLASSPULSE_DEXIE_SCHEMA_VERSION)
    expect(Array.isArray(doc.data.sessions)).toBe(true)
    expect(Array.isArray(doc.data.settings)).toBe(true)
    expect(Array.isArray(doc.data.participationEvents)).toBe(true)
    expect(Array.isArray(doc.data.behaviorEvents)).toBe(true)
    expect(Array.isArray(doc.data.bathroomEvents)).toBe(true)

    const text = serializeLocalBackupFile(doc)
    expect(() => JSON.parse(text)).not.toThrow()
    const roundTrip = JSON.parse(text) as typeof doc
    expect(roundTrip.data.sessions.length).toBeGreaterThanOrEqual(1)

    await db.close()
  })

  it('import replace wipes prior rows and applies backup tables', async () => {
    const dbA = new ClassPulseDB()
    await dbA.open()
    await dbA.sessions.add({
      id: 'sess-a',
      title: 'Old',
      startedAt: '2026-01-01T10:00:00.000Z',
      activeMode: 'participation',
    })
    await dbA.participationEvents.add({
      id: 'pe-a',
      sessionId: 'sess-a',
      createdAt: '2026-01-01T10:01:00.000Z',
    })
    await dbA.close()

    const dbB = new ClassPulseDB()
    await dbB.open()
    const tables = {
      sessions: [
        {
          id: 'sess-b',
          title: 'Imported',
          startedAt: '2026-02-02T12:00:00.000Z',
          activeMode: 'behavior' as const,
        },
      ],
      settings: [],
      participationEvents: [] as { id: string; sessionId: string; createdAt: string }[],
      behaviorEvents: [] as {
        id: string
        sessionId: string
        createdAt: string
        kind: 'positive'
      }[],
      bathroomEvents: [] as {
        id: string
        sessionId: string
        createdAt: string
        kind: 'depart'
      }[],
    }
    const envelope = {
      format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
      formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
      exportedAt: '2026-02-02T12:00:00.000Z',
      dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
      data: tables,
    }
    const validated = parseAndValidateLocalBackupJson(JSON.stringify(envelope))
    await replaceLocalDatabaseFromBackupTables(dbB, validated)

    const sessions = await dbB.sessions.toArray()
    expect(sessions.map((s) => s.id).sort()).toEqual(['sess-b'])
    expect(await dbB.participationEvents.count()).toBe(0)
    await dbB.close()
  })

  it('rejects invalid JSON with SyntaxError', () => {
    expect(() => parseAndValidateLocalBackupJson('not json')).toThrow(SyntaxError)
  })

  it('rejects wrong format and orphan event foreign keys', () => {
    expect(() =>
      parseAndValidateLocalBackupJson(
        JSON.stringify({
          format: 'other',
          formatVersion: 1,
          exportedAt: 'x',
          dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
          data: {
            sessions: [],
            settings: [],
            participationEvents: [],
            behaviorEvents: [],
            bathroomEvents: [],
          },
        }),
      ),
    ).toThrow(BackupValidationError)

    expect(() =>
      parseAndValidateLocalBackupJson(
        JSON.stringify({
          format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
          formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
          exportedAt: '2026-01-01T00:00:00.000Z',
          dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
          data: {
            sessions: [
              {
                id: 's1',
                title: 'T',
                startedAt: '2026-01-01T00:00:00.000Z',
                activeMode: 'participation',
              },
            ],
            settings: [],
            participationEvents: [
              { id: 'p1', sessionId: 'missing', createdAt: '2026-01-01T00:00:00.000Z' },
            ],
            behaviorEvents: [],
            bathroomEvents: [],
          },
        }),
      ),
    ).toThrow(/sessionId/)

    expect(() =>
      parseAndValidateLocalBackupJson(
        JSON.stringify({
          format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
          formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
          exportedAt: '2026-01-01T00:00:00.000Z',
          dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
          data: {
            sessions: [
              {
                id: 's1',
                title: 'T',
                startedAt: '2026-01-01T00:00:00.000Z',
                activeMode: 'participation',
              },
            ],
            settings: [],
            participationEvents: [],
            behaviorEvents: [],
            bathroomEvents: [
              {
                id: 'br1',
                sessionId: 'missing',
                createdAt: '2026-01-01T00:00:00.000Z',
                kind: 'depart',
              },
            ],
          },
        }),
      ),
    ).toThrow(/sessionId/)
  })

  it('rejects duplicate ids and invalid behavior kind', () => {
    const base = {
      format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
      formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
      exportedAt: '2026-01-01T00:00:00.000Z',
      dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
      data: {
        sessions: [
          {
            id: 's1',
            title: 'T',
            startedAt: '2026-01-01T00:00:00.000Z',
            activeMode: 'participation',
          },
        ],
        settings: [],
        participationEvents: [],
        behaviorEvents: [
          {
            id: 'b1',
            sessionId: 's1',
            createdAt: '2026-01-01T00:00:00.000Z',
            kind: 'nope',
          },
        ],
        bathroomEvents: [],
      },
    }
    expect(() => parseAndValidateLocalBackupJson(JSON.stringify(base))).toThrow(/kind/)

    const dup = {
      ...base,
      data: {
        ...base.data,
        behaviorEvents: [],
        sessions: [
          {
            id: 's1',
            title: 'A',
            startedAt: '2026-01-01T00:00:00.000Z',
            activeMode: 'participation',
          },
          {
            id: 's1',
            title: 'B',
            startedAt: '2026-01-02T00:00:00.000Z',
            activeMode: 'behavior',
          },
        ],
      },
    }
    expect(() => parseAndValidateLocalBackupJson(JSON.stringify(dup))).toThrow(/Duplicate id/)
  })

  it('rejects invalid bathroom kind', () => {
    expect(() =>
      parseAndValidateLocalBackupJson(
        JSON.stringify({
          format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
          formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
          exportedAt: '2026-01-01T00:00:00.000Z',
          dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
          data: {
            sessions: [
              {
                id: 's1',
                title: 'T',
                startedAt: '2026-01-01T00:00:00.000Z',
                activeMode: 'participation',
              },
            ],
            settings: [],
            participationEvents: [],
            behaviorEvents: [],
            bathroomEvents: [
              {
                id: 'br1',
                sessionId: 's1',
                createdAt: '2026-01-01T00:00:00.000Z',
                kind: 'left',
              },
            ],
          },
        }),
      ),
    ).toThrow(/bathroomEvents\[0\]\.kind/)
  })

  it('accepts optional sessionNotes on sessions and round-trips through parse', () => {
    const envelope = {
      format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
      formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
      exportedAt: '2026-04-17T12:00:00.000Z',
      dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
      data: {
        sessions: [
          {
            id: 's-notes',
            title: 'With notes',
            startedAt: '2026-04-17T10:00:00.000Z',
            activeMode: 'notes' as const,
            sessionNotes: 'Line one\nLine two',
          },
        ],
        settings: [],
        participationEvents: [],
        behaviorEvents: [],
        bathroomEvents: [],
      },
    }
    const validated = parseAndValidateLocalBackupJson(JSON.stringify(envelope))
    expect(validated.sessions[0].sessionNotes).toBe('Line one\nLine two')
  })

  it('rejects non-string sessionNotes on sessions', () => {
    expect(() =>
      parseAndValidateLocalBackupJson(
        JSON.stringify({
          format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
          formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
          exportedAt: '2026-04-17T12:00:00.000Z',
          dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
          data: {
            sessions: [
              {
                id: 's1',
                title: 'T',
                startedAt: '2026-04-17T10:00:00.000Z',
                activeMode: 'participation',
                sessionNotes: 99,
              },
            ],
            settings: [],
            participationEvents: [],
            behaviorEvents: [],
            bathroomEvents: [],
          },
        }),
      ),
    ).toThrow(/sessionNotes/)
  })

  it('readBackupTablesFromDb matches post-replace Dexie contents', async () => {
    const db = new ClassPulseDB()
    await db.open()
    const tables = {
      sessions: [
        {
          id: 's-import',
          title: 'Only',
          startedAt: '2026-03-03T08:00:00.000Z',
          activeMode: 'notes' as const,
        },
      ],
      settings: [],
      participationEvents: [
        { id: 'pe1', sessionId: 's-import', createdAt: '2026-03-03T08:05:00.000Z' },
      ],
      behaviorEvents: [] as {
        id: string
        sessionId: string
        createdAt: string
        kind: 'redirect'
      }[],
      bathroomEvents: [
        {
          id: 'br1',
          sessionId: 's-import',
          createdAt: '2026-03-03T08:06:00.000Z',
          kind: 'depart' as const,
        },
      ],
    }
    await replaceLocalDatabaseFromBackupTables(db, tables)
    const read = await readBackupTablesFromDb(db)
    expect(read.sessions).toEqual(tables.sessions)
    expect(read.participationEvents).toEqual(tables.participationEvents)
    expect(read.bathroomEvents).toEqual(tables.bathroomEvents)
    await db.close()
  })
})
