import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../../App'
import { resetDatabaseForTests } from '../../db/database'

describe('ParticipationPanel', () => {
  afterEach(async () => {
    cleanup()
    await resetDatabaseForTests()
  })

  it('shows the no-active-session empty state when there is no active session', async () => {
    render(<App />)
    // Wait for shell to load.
    const heading = await screen.findByRole('heading', { name: /participation/i })
    const section = heading.closest('section') as HTMLElement
    expect(
      within(section).getByText(/start a session to capture participation events/i),
    ).toBeInTheDocument()
    expect(within(section).queryByRole('button', { name: /\+ participation/i })).not.toBeInTheDocument()
  })

  it('shows the capture button and no-events empty state when a session is active but has no events', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    // Wait for the session to become active.
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /participation/i })
    const section = heading.closest('section') as HTMLElement
    expect(within(section).getByRole('button', { name: /\+ participation/i })).toBeInTheDocument()
    expect(within(section).getByText(/no participation events yet/i)).toBeInTheDocument()
  })

  it('adds an event and shows it in the list when the capture button is tapped', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /participation/i })
    const section = heading.closest('section') as HTMLElement
    const captureBtn = within(section).getByRole('button', { name: /\+ participation/i })
    fireEvent.click(captureBtn)

    // The recent-events list should appear.
    const list = await within(section).findByRole('list', { name: /recent participation events/i })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
  })

  it('accumulates multiple events in the list', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /participation/i })
    const section = heading.closest('section') as HTMLElement
    const captureBtn = within(section).getByRole('button', { name: /\+ participation/i })

    fireEvent.click(captureBtn)
    // Wait for first event to appear.
    await within(section).findByRole('list', { name: /recent participation events/i })
    fireEvent.click(captureBtn)

    const list = await within(section).findByRole('list', { name: /recent participation events/i })
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(2)
  })

  it('returns to the no-active-session empty state after the session is ended', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    // Capture an event.
    const heading = screen.getByRole('heading', { name: /participation/i })
    const section = heading.closest('section') as HTMLElement
    fireEvent.click(within(section).getByRole('button', { name: /\+ participation/i }))
    await within(section).findByRole('list', { name: /recent participation events/i })

    // End the session.
    fireEvent.click(screen.getByRole('button', { name: /end session/i }))
    await screen.findByRole('button', { name: /start session/i })

    const heading2 = screen.getByRole('heading', { name: /participation/i })
    const section2 = heading2.closest('section') as HTMLElement
    expect(
      within(section2).getByText(/start a session to capture participation events/i),
    ).toBeInTheDocument()
    expect(within(section2).queryByRole('button', { name: /\+ participation/i })).not.toBeInTheDocument()
  })
})
