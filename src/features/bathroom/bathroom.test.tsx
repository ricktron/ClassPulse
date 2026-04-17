import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../../App'
import { resetDatabaseForTests } from '../../db/database'

describe('BathroomPanel', () => {
  afterEach(async () => {
    cleanup()
    await resetDatabaseForTests()
  })

  it('shows the no-active-session empty state when there is no active session', async () => {
    render(<App />)
    const heading = await screen.findByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    expect(
      within(section).getByText(/start a session to capture bathroom events/i),
    ).toBeInTheDocument()
    expect(within(section).queryByRole('button', { name: /\+ out/i })).not.toBeInTheDocument()
    expect(within(section).queryByRole('button', { name: /\+ back/i })).not.toBeInTheDocument()
  })

  it('shows both capture buttons and no-events empty state when a session is active but has no events', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    expect(within(section).getByRole('button', { name: /\+ out/i })).toBeInTheDocument()
    expect(within(section).getByRole('button', { name: /\+ back/i })).toBeInTheDocument()
    expect(within(section).getByText(/no bathroom events yet/i)).toBeInTheDocument()
  })

  it('adds an out event and shows it in the list', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    fireEvent.click(within(section).getByRole('button', { name: /\+ out/i }))

    const list = await within(section).findByRole('list', { name: /recent bathroom events/i })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toMatch(/out/i)
  })

  it('adds a back event and shows it in the list', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    fireEvent.click(within(section).getByRole('button', { name: /\+ back/i }))

    const list = await within(section).findByRole('list', { name: /recent bathroom events/i })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0].textContent).toMatch(/back/i)
  })

  it('persists bathroom events across remount', async () => {
    const { unmount } = render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    fireEvent.click(within(section).getByRole('button', { name: /\+ out/i }))
    await within(section).findByRole('list', { name: /recent bathroom events/i })
    unmount()

    render(<App />)
    await screen.findByRole('button', { name: /end session/i })
    const heading2 = screen.getByRole('heading', { name: /^bathroom$/i })
    const section2 = heading2.closest('section') as HTMLElement
    const list = await within(section2).findByRole('list', { name: /recent bathroom events/i })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
  })

  it('accumulates out and back events', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement

    fireEvent.click(within(section).getByRole('button', { name: /\+ out/i }))
    await within(section).findByRole('list', { name: /recent bathroom events/i })

    fireEvent.click(within(section).getByRole('button', { name: /\+ back/i }))
    await waitFor(() => {
      const list = within(section).getByRole('list', { name: /recent bathroom events/i })
      expect(within(list).getAllByRole('listitem').length).toBeGreaterThanOrEqual(2)
    })
  })

  it('returns to the no-active-session empty state after the session is ended', async () => {
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /start session/i }))
    await screen.findByRole('button', { name: /end session/i })

    const heading = screen.getByRole('heading', { name: /^bathroom$/i })
    const section = heading.closest('section') as HTMLElement
    fireEvent.click(within(section).getByRole('button', { name: /\+ out/i }))
    await within(section).findByRole('list', { name: /recent bathroom events/i })

    fireEvent.click(screen.getByRole('button', { name: /end session/i }))
    await screen.findByRole('button', { name: /start session/i })

    const heading2 = screen.getByRole('heading', { name: /^bathroom$/i })
    const section2 = heading2.closest('section') as HTMLElement
    expect(
      within(section2).getByText(/start a session to capture bathroom events/i),
    ).toBeInTheDocument()
    expect(within(section2).queryByRole('button', { name: /\+ out/i })).not.toBeInTheDocument()
  })
})
