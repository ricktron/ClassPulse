import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NOTES_AUTOSAVE_DEBOUNCE_MS, NotesPanel } from './NotesPanel'

describe('NotesPanel', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows empty state when there is no active session', () => {
    render(
      <NotesPanel sessionId={undefined} sessionNotes="" onPersist={vi.fn()} />,
    )
    expect(screen.getByRole('heading', { name: 'Notes' })).toBeInTheDocument()
    expect(
      screen.getByText(/start a session to add session notes/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('debounces persist while typing', () => {
    vi.useFakeTimers()
    const onPersist = vi.fn()
    render(<NotesPanel sessionId="s1" sessionNotes="" onPersist={onPersist} />)
    const box = screen.getByRole('textbox', { name: 'Notes' })
    fireEvent.change(box, { target: { value: 'a' } })
    fireEvent.change(box, { target: { value: 'ab' } })
    expect(onPersist).not.toHaveBeenCalled()
    vi.advanceTimersByTime(NOTES_AUTOSAVE_DEBOUNCE_MS)
    expect(onPersist).toHaveBeenCalledTimes(1)
    expect(onPersist).toHaveBeenLastCalledWith('ab')
  })

  it('flushes pending debounce on blur', () => {
    vi.useFakeTimers()
    const onPersist = vi.fn()
    render(<NotesPanel sessionId="s1" sessionNotes="" onPersist={onPersist} />)
    const box = screen.getByRole('textbox', { name: 'Notes' })
    fireEvent.change(box, { target: { value: 'draft' } })
    expect(onPersist).not.toHaveBeenCalled()
    fireEvent.blur(box)
    expect(onPersist).toHaveBeenCalledWith('draft')
    vi.advanceTimersByTime(NOTES_AUTOSAVE_DEBOUNCE_MS * 2)
    expect(onPersist).toHaveBeenCalledTimes(1)
  })
})
