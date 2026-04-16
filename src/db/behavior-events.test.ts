import { afterEach, describe, expect, it } from 'vitest'
import { ClassPulseDB, resetDatabaseForTests } from './database'
import type { BehaviorEvent } from '../domain/behavior'

describe('behaviorEvents table', () => {
  afterEach(async () => {
    await resetDatabaseForTests()
  })

  it('creates and retrieves a behavior event', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const event: BehaviorEvent = {
      id: 'bev-1',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:00:00.000Z',
      kind: 'positive',
    }
    await db.behaviorEvents.add(event)

    const stored = await db.behaviorEvents.get('bev-1')
    expect(stored).toEqual(event)
    await db.close()
  })

  it('stores both positive and redirect kinds', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const pos: BehaviorEvent = {
      id: 'bev-pos',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:00:00.000Z',
      kind: 'positive',
    }
    const red: BehaviorEvent = {
      id: 'bev-red',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:01:00.000Z',
      kind: 'redirect',
    }
    await db.behaviorEvents.bulkAdd([pos, red])

    const storedPos = await db.behaviorEvents.get('bev-pos')
    const storedRed = await db.behaviorEvents.get('bev-red')
    expect(storedPos?.kind).toBe('positive')
    expect(storedRed?.kind).toBe('redirect')
    await db.close()
  })

  it('retrieves only events for the given session', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const evA1: BehaviorEvent = {
      id: 'a1',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:00:00.000Z',
      kind: 'positive',
    }
    const evA2: BehaviorEvent = {
      id: 'a2',
      sessionId: 'session-a',
      createdAt: '2026-01-01T09:01:00.000Z',
      kind: 'redirect',
    }
    const evB1: BehaviorEvent = {
      id: 'b1',
      sessionId: 'session-b',
      createdAt: '2026-01-01T09:02:00.000Z',
      kind: 'positive',
    }
    await db.behaviorEvents.bulkAdd([evA1, evA2, evB1])

    const forA = await db.behaviorEvents.where('sessionId').equals('session-a').toArray()
    expect(forA).toHaveLength(2)
    expect(forA.map((e) => e.id)).toEqual(expect.arrayContaining(['a1', 'a2']))

    const forB = await db.behaviorEvents.where('sessionId').equals('session-b').toArray()
    expect(forB).toHaveLength(1)
    expect(forB[0].id).toBe('b1')

    await db.close()
  })

  it('returns an empty array when no events exist for a session', async () => {
    const db = new ClassPulseDB()
    await db.open()

    const result = await db.behaviorEvents
      .where('sessionId')
      .equals('no-such-session')
      .toArray()
    expect(result).toHaveLength(0)
    await db.close()
  })
})
