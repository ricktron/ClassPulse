import { afterEach, describe, expect, it } from 'vitest'
import { ClassPulseDB, resetDatabaseForTests } from './database'
import type { ParticipationEvent } from '../domain/participation'

describe('participationEvents table', () => {
  afterEach(async () => {
    await resetDatabaseForTests()
  })

  it('creates and retrieves a participation event', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const event: ParticipationEvent = {
      id: 'ev-1',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:00:00.000Z',
    }
    await db.participationEvents.add(event)

    const stored = await db.participationEvents.get('ev-1')
    expect(stored).toEqual(event)
    await db.close()
  })

  it('retrieves only events for the given session', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const evA1: ParticipationEvent = {
      id: 'a1',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:00:00.000Z',
    }
    const evA2: ParticipationEvent = {
      id: 'a2',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:01:00.000Z',
    }
    const evB1: ParticipationEvent = {
      id: 'b1',
      sessionId: 'session-b',
      createdAt: '2026-01-01T09:02:00.000Z',
    }
    await db.participationEvents.bulkAdd([evA1, evA2, evB1])

    const forA = await db.participationEvents
      .where('sessionId')
      .equals('session-a')
      .toArray()
    expect(forA).toHaveLength(2)
    expect(forA.map((e) => e.id)).toEqual(expect.arrayContaining(['a1', 'a2']))

    const forB = await db.participationEvents
      .where('sessionId')
      .equals('session-b')
      .toArray()
    expect(forB).toHaveLength(1)
    expect(forB[0].id).toBe('b1')

    await db.close()
  })

  it('returns an empty array when no events exist for a session', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const result = await db.participationEvents
      .where('sessionId')
      .equals('no-such-session')
      .toArray()
    expect(result).toHaveLength(0)
    await db.close()
  })
})
