import { afterEach, describe, expect, it } from 'vitest'
import { SETTINGS_SCHEMA_VERSION_KEY } from '../domain/settings'
import { ClassPulseDB, getDatabase, resetDatabaseForTests } from './database'
import { seedSampleDataIfEmpty } from './seed'

describe('ClassPulseDB', () => {
  afterEach(async () => {
    await resetDatabaseForTests()
  })

  it('opens, seeds idempotently, and persists settings', async () => {
    const db = new ClassPulseDB()
    await db.open()
    await seedSampleDataIfEmpty(db)
    await seedSampleDataIfEmpty(db)

    const settingsRows = await db.settings.toArray()
    expect(settingsRows.some((s) => s.key === SETTINGS_SCHEMA_VERSION_KEY)).toBe(true)

    const sessions = await db.sessions.toArray()
    expect(sessions.length).toBeGreaterThanOrEqual(1)
    await db.close()
  })

  it('exposes a singleton getter for the app runtime path', async () => {
    const a = await getDatabase()
    const b = await getDatabase()
    expect(a).toBe(b)
    await a.close()
    await resetDatabaseForTests()
  })
})
