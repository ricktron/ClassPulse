import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../../App'
import { resetDatabaseForTests } from '../../db/database'
import { isActiveSession, resolveActiveSession } from '../../domain/session'
import type { SessionRecord } from '../../domain/session'

// ---------------------------------------------------------------------------
// Unit tests — domain helpers (no UI)
// ---------------------------------------------------------------------------

describe('isActiveSession', () => {
  const base: SessionRecord = {
    id: 'a',
    title: 'T',
    startedAt: '2026-01-01T09:00:00.000Z',
    activeMode: 'participation',
  }

  it('returns true when endedAt is undefined', () => {
    expect(isActiveSession(base)).toBe(true)
  })

  it('returns false when endedAt is set', () => {
    expect(isActiveSession({ ...base, endedAt: '2026-01-01T10:00:00.000Z' })).toBe(false)
  })
})

describe('resolveActiveSession', () => {
  it('returns undefined for an empty list', () => {
    expect(resolveActiveSession([])).toBeUndefined()
  })

  it('returns undefined when all sessions are ended', () => {
    const sessions: SessionRecord[] = [
      {
        id: 'a',
        title: 'A',
        startedAt: '2026-01-01T09:00:00.000Z',
        endedAt: '2026-01-01T10:00:00.000Z',
        activeMode: 'participation',
      },
    ]
    expect(resolveActiveSession(sessions)).toBeUndefined()
  })

  it('returns the single active session', () => {
    const session: SessionRecord = {
      id: 'b',
      title: 'B',
      startedAt: '2026-01-01T09:00:00.000Z',
      activeMode: 'notes',
    }
    expect(resolveActiveSession([session])).toBe(session)
  })

  it('returns the most-recently-started when multiple active sessions exist', () => {
    const older: SessionRecord = {
      id: 'old',
      title: 'Old',
      startedAt: '2026-01-01T08:00:00.000Z',
      activeMode: 'sleep',
    }
    const newer: SessionRecord = {
      id: 'new',
      title: 'New',
      startedAt: '2026-01-01T09:00:00.000Z',
      activeMode: 'participation',
    }
    expect(resolveActiveSession([older, newer])).toBe(newer)
    expect(resolveActiveSession([newer, older])).toBe(newer)
  })

  it('ignores ended sessions when picking active', () => {
    const ended: SessionRecord = {
      id: 'ended',
      title: 'Ended',
      startedAt: '2026-01-01T10:00:00.000Z',
      endedAt: '2026-01-01T11:00:00.000Z',
      activeMode: 'behavior',
    }
    const active: SessionRecord = {
      id: 'active',
      title: 'Active',
      startedAt: '2026-01-01T08:00:00.000Z',
      activeMode: 'participation',
    }
    expect(resolveActiveSession([ended, active])).toBe(active)
  })
})

// ---------------------------------------------------------------------------
// Integration tests — session lifecycle through the shell UI
// ---------------------------------------------------------------------------

describe('Session lifecycle (shell)', () => {
  afterEach(async () => {
    cleanup()
    await resetDatabaseForTests()
  })

  it('shows the empty state with a start-session button when there is no active session', async () => {
    render(<App />)
    // Fresh DB — no sessions at all.
    const sessionHeading = await screen.findByRole('heading', {
      name: /session \(device-local\)/i,
    })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(within(sessionSection).getByText(/no active session/i)).toBeInTheDocument()
    expect(
      within(sessionSection).getByRole('button', { name: /start session/i }),
    ).toBeInTheDocument()
  })

  it('mode-strip buttons are disabled when there is no active session', async () => {
    render(<App />)
    const participationBtn = await screen.findByRole('button', { name: 'participation' })
    expect(participationBtn).toBeDisabled()
  })

  it('starting a session clears the empty state and shows the session with participation as default mode', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    // Wait for the session to become active — end-session button confirms state settled.
    await screen.findByRole('button', { name: /end session/i })

    const sessionHeading = screen.getByRole('heading', {
      name: /session \(device-local\)/i,
    })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(within(sessionSection).queryByText(/no active session/i)).not.toBeInTheDocument()
    expect(within(sessionSection).getByText('participation')).toBeInTheDocument()
    expect(within(sessionSection).getByRole('button', { name: /end session/i })).toBeInTheDocument()
    // Mode strip participation button becomes active.
    expect(screen.getByRole('button', { name: 'participation' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('ending the active session transitions back to the empty state', async () => {
    render(<App />)
    // Start a session and wait for it to become active.
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    const endBtn = await screen.findByRole('button', { name: /end session/i })
    fireEvent.click(endBtn)
    // Wait for the start button to reappear — confirms state settled.
    await screen.findByRole('button', { name: /start session/i })

    const sessionHeading = screen.getByRole('heading', {
      name: /session \(device-local\)/i,
    })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(within(sessionSection).getByText(/no active session/i)).toBeInTheDocument()
    expect(
      within(sessionSection).getByRole('button', { name: /start session/i }),
    ).toBeInTheDocument()
    // Mode strip should be disabled again.
    expect(screen.getByRole('button', { name: 'participation' })).toBeDisabled()
  })

  it('active session and its mode persist across a remount', async () => {
    const { unmount } = render(<App />)
    // Start a session and wait for it to become active.
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })
    // Switch to behavior mode.
    fireEvent.click(screen.getByRole('button', { name: 'behavior' }))

    // Wait for behavior mode to be reflected in the session panel before unmounting.
    const sessionHeading = screen.getByRole('heading', { name: /session \(device-local\)/i })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(await within(sessionSection).findByText('behavior')).toBeInTheDocument()
    unmount()

    render(<App />)
    const sessionHeading2 = await screen.findByRole('heading', {
      name: /session \(device-local\)/i,
    })
    const sessionSection2 = sessionHeading2.closest('section') as HTMLElement
    // Session still active and mode preserved.
    expect(within(sessionSection2).getByText('behavior')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'behavior' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

})
