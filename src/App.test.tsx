import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { resetDatabaseForTests } from './db/database'

describe('App shell', () => {
  afterEach(async () => {
    cleanup()
    await resetDatabaseForTests()
  })

  it('renders the ClassPulse title and mode strip', async () => {
    render(<App />)
    expect(
      await screen.findByRole('heading', { level: 1, name: 'ClassPulse' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /v1 mode strip/i })).toBeInTheDocument()
    const modeList = await screen.findByRole('list', { name: /v1 modes/i })
    expect(within(modeList).getByText('sleep')).toBeInTheDocument()
    expect(within(modeList).getByText('participation')).toBeInTheDocument()
  })

  it('defaults active mode to participation for a fresh local store', async () => {
    render(<App />)
    const sessionHeading = await screen.findByRole('heading', { name: /session \(device-local\)/i })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    expect(within(sessionSection).getByText('participation')).toBeInTheDocument()
    const behavior = await screen.findByRole('button', { name: 'behavior' })
    expect(behavior).toHaveAttribute('aria-pressed', 'false')
    expect(await screen.findByRole('button', { name: 'participation' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('persists mode selection to Dexie and restores after remount', async () => {
    const { unmount } = render(<App />)
    const sessionHeading = await screen.findByRole('heading', { name: /session \(device-local\)/i })
    const sessionSection = sessionHeading.closest('section') as HTMLElement
    const notesBtn = await screen.findByRole('button', { name: 'notes' })
    fireEvent.click(notesBtn)
    expect(await within(sessionSection).findByText('notes')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'notes' })).toHaveAttribute('aria-pressed', 'true')
    unmount()

    render(<App />)
    const sessionHeading2 = await screen.findByRole('heading', { name: /session \(device-local\)/i })
    const sessionSection2 = sessionHeading2.closest('section') as HTMLElement
    expect(within(sessionSection2).getByText('notes')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'notes' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
