import { cleanup, render, screen, within } from '@testing-library/react'
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
})
