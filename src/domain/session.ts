import type { SessionModeV1 } from './modes'

/** One class meeting in v1. */
export interface SessionRecord {
  id: string
  title: string
  startedAt: string
  /** Active workflow mode for this device instance. */
  activeMode: SessionModeV1
}
