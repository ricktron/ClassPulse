import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../../App'
import {
  CLASSPULSE_LOCAL_BACKUP_FORMAT,
  CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
} from '../../db/backup'
import { CLASSPULSE_DEXIE_SCHEMA_VERSION, getDatabase, resetDatabaseForTests } from '../../db/database'

function makeValidBackupEnvelope(overrides?: {
  sessions?: object[]
  participationEvents?: object[]
}) {
  return {
    format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
    formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
    exportedAt: '2026-04-16T12:00:00.000Z',
    dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
    data: {
      sessions: overrides?.sessions ?? [
        {
          id: 'imported-session',
          title: 'From backup file',
          startedAt: '2026-04-10T15:00:00.000Z',
          activeMode: 'participation',
        },
      ],
      settings: [],
      participationEvents: overrides?.participationEvents ?? [],
      behaviorEvents: [],
    },
  }
}

describe('Slice 5 backup UI (shell)', () => {
  afterEach(async () => {
    cleanup()
    await resetDatabaseForTests()
  })

  it('successful import replaces local data and shell shows imported session', async () => {
    const db = await getDatabase()
    await db.sessions.add({
      id: 'local-before',
      title: 'Will be removed',
      startedAt: '2026-01-01T09:00:00.000Z',
      activeMode: 'sleep',
    })

    const json = JSON.stringify(makeValidBackupEnvelope())
    const file = new File([json], 'pulse.json', { type: 'application/json' })

    render(<App />)
    await screen.findByRole('heading', { name: /local backup \(json\)/i })

    const fileInput = document.querySelector(
      'input[type="file"][aria-label="Choose ClassPulse JSON backup file"]',
    ) as HTMLInputElement
    expect(fileInput).toBeTruthy()

    uploadFileToInput(fileInput, file)

    expect(await screen.findByRole('region', { name: /confirm import/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replace local data/i }))

    await waitFor(async () => {
      const sessions = await db.sessions.toArray()
      expect(sessions.map((s) => s.id)).toEqual(['imported-session'])
    })

    const sessionHeading = await screen.findByRole('heading', {
      name: /session \(device-local\)/i,
    })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(within(sessionSection).getByText('From backup file')).toBeInTheDocument()
    expect(within(sessionSection).queryByText('Will be removed')).not.toBeInTheDocument()
  })

  it('cancel leaves local data unchanged', async () => {
    const db = await getDatabase()
    await db.sessions.add({
      id: 'keep-me',
      title: 'Stay',
      startedAt: '2026-01-02T09:00:00.000Z',
      activeMode: 'participation',
    })

    const json = JSON.stringify(makeValidBackupEnvelope())
    const file = new File([json], 'pulse.json', { type: 'application/json' })

    render(<App />)
    await screen.findByRole('heading', { name: /local backup \(json\)/i })

    const fileInput = document.querySelector(
      'input[type="file"][aria-label="Choose ClassPulse JSON backup file"]',
    ) as HTMLInputElement
    uploadFileToInput(fileInput, file)

    await screen.findByRole('region', { name: /confirm import/i })
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))

    await waitFor(() => {
      expect(screen.queryByRole('region', { name: /confirm import/i })).not.toBeInTheDocument()
    })

    const rows = await db.sessions.toArray()
    expect(rows.some((s) => s.id === 'keep-me')).toBe(true)
    expect(rows.some((s) => s.id === 'imported-session')).toBe(false)
  })

  it('invalid file shows error and preserves sessions', async () => {
    const db = await getDatabase()
    await db.sessions.add({
      id: 'stable',
      title: 'Stable row',
      startedAt: '2026-01-03T09:00:00.000Z',
      activeMode: 'behavior',
    })

    const file = new File(['{'], 'bad.json', { type: 'application/json' })

    render(<App />)
    await screen.findByRole('heading', { name: /local backup \(json\)/i })

    const fileInput = document.querySelector(
      'input[type="file"][aria-label="Choose ClassPulse JSON backup file"]',
    ) as HTMLInputElement
    uploadFileToInput(fileInput, file)

    expect(await screen.findByRole('alert')).toHaveTextContent(/valid json/i)
    const rows = await db.sessions.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0].id).toBe('stable')
  })
})

/**
 * jsdom does not ship `DataTransfer` in all Vitest setups; assign a minimal FileList-like object.
 */
function uploadFileToInput(input: HTMLInputElement, file: File): void {
  const files = {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    [Symbol.iterator]: function* () {
      yield file
    },
  } as FileList
  Object.defineProperty(input, 'files', { configurable: true, writable: false, value: files })
  fireEvent.change(input)
}
