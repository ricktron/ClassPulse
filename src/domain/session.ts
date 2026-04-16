import type { SessionModeV1 } from './modes'

/** One class meeting in v1. */
export interface SessionRecord {
  id: string
  title: string
  startedAt: string
  /**
   * Active top-level mode for this meeting on this device (v1: one teacher / one app instance).
   * Persisted in Dexie; the mode strip reads and updates this field only — no separate settings row.
   */
  activeMode: SessionModeV1
}
