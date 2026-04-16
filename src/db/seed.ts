import type { SessionModeV1 } from '../domain/modes'
import type { SessionRecord } from '../domain/session'
import { SETTINGS_SCHEMA_VERSION_KEY } from '../domain/settings'
import type { ClassPulseDB } from './database'

/** Fresh device-local session: Participation is the default shell mode (not list order). */
function defaultActiveMode(): SessionModeV1 {
  return 'participation'
}

/**
 * Idempotent seed: ensures settings row exists and a sample session when empty.
 * Import/replace flows are v1 contracts (JSON); this is dev/shell convenience only.
 */
export async function seedSampleDataIfEmpty(db: ClassPulseDB): Promise<void> {
  const version = await db.settings.get(SETTINGS_SCHEMA_VERSION_KEY)
  if (!version) {
    await db.settings.put({
      key: SETTINGS_SCHEMA_VERSION_KEY,
      value: { version: 1 },
    })
  }

  const sessionCount = await db.sessions.count()
  if (sessionCount > 0) return

  const now = new Date().toISOString()
  const sample: SessionRecord = {
    id: crypto.randomUUID(),
    title: 'Sample session (delete anytime)',
    startedAt: now,
    activeMode: defaultActiveMode(),
  }
  await db.sessions.add(sample)
}
