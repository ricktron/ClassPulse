import type { BathroomEvent, BathroomEventKind } from '../domain/bathroom'
import type { BehaviorEvent, BehaviorEventKind } from '../domain/behavior'
import { isSessionModeV1 } from '../domain/modes'
import type { ParticipationEvent } from '../domain/participation'
import { SETTINGS_SCHEMA_VERSION_KEY, type AppSettingRecord } from '../domain/settings'
import type { SessionRecord } from '../domain/session'
import {
  CLASSPULSE_DEXIE_SCHEMA_VERSION,
  type ClassPulseDB,
} from './database'

/** JSON envelope id — stable across Dexie bumps until we intentionally version the backup format. */
export const CLASSPULSE_LOCAL_BACKUP_FORMAT = 'classpulse-local-backup' as const

/** Version of the JSON envelope and table payload rules in this module. */
export const CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION = 1 as const

export type ClassPulseLocalBackupTables = {
  sessions: SessionRecord[]
  settings: AppSettingRecord[]
  participationEvents: ParticipationEvent[]
  behaviorEvents: BehaviorEvent[]
  bathroomEvents: BathroomEvent[]
}

export type ClassPulseLocalBackupFileV1 = {
  format: typeof CLASSPULSE_LOCAL_BACKUP_FORMAT
  formatVersion: typeof CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION
  exportedAt: string
  dexieSchemaVersion: typeof CLASSPULSE_DEXIE_SCHEMA_VERSION
  data: ClassPulseLocalBackupTables
}

export class BackupValidationError extends Error {
  override name = 'BackupValidationError'
}

function assertBackupValidationError(message: string): never {
  throw new BackupValidationError(message)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    assertBackupValidationError(`${label} must be a non-empty string`)
  }
  return value
}

function requireOptionalIsoString(value: unknown, label: string): string | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'string') assertBackupValidationError(`${label} must be a string when present`)
  return value
}

const SESSION_KEYS = new Set(['id', 'title', 'startedAt', 'endedAt', 'activeMode'])
const PARTICIPATION_KEYS = new Set(['id', 'sessionId', 'createdAt'])
const BEHAVIOR_KEYS = new Set(['id', 'sessionId', 'createdAt', 'kind'])
const BATHROOM_KEYS = new Set(['id', 'sessionId', 'createdAt', 'kind'])
const SETTINGS_KEYS = new Set(['key', 'value'])

function assertNoExtraKeys(obj: Record<string, unknown>, allowed: Set<string>, label: string): void {
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) assertBackupValidationError(`Unexpected property "${k}" on ${label}`)
  }
}

function parseSession(raw: unknown, index: number): SessionRecord {
  if (!isPlainObject(raw)) assertBackupValidationError(`sessions[${index}] must be an object`)
  assertNoExtraKeys(raw, SESSION_KEYS, `sessions[${index}]`)
  const id = requireString(raw.id, `sessions[${index}].id`)
  const title = requireString(raw.title, `sessions[${index}].title`)
  const startedAt = requireString(raw.startedAt, `sessions[${index}].startedAt`)
  const endedAt = requireOptionalIsoString(raw.endedAt, `sessions[${index}].endedAt`)
  const activeModeRaw = raw.activeMode
  if (typeof activeModeRaw !== 'string' || !isSessionModeV1(activeModeRaw)) {
    assertBackupValidationError(`sessions[${index}].activeMode is not a valid v1 mode`)
  }
  const out: SessionRecord = { id, title, startedAt, activeMode: activeModeRaw }
  if (endedAt !== undefined) out.endedAt = endedAt
  return out
}

function parseParticipation(raw: unknown, index: number): ParticipationEvent {
  if (!isPlainObject(raw)) assertBackupValidationError(`participationEvents[${index}] must be an object`)
  assertNoExtraKeys(raw, PARTICIPATION_KEYS, `participationEvents[${index}]`)
  return {
    id: requireString(raw.id, `participationEvents[${index}].id`),
    sessionId: requireString(raw.sessionId, `participationEvents[${index}].sessionId`),
    createdAt: requireString(raw.createdAt, `participationEvents[${index}].createdAt`),
  }
}

const BEHAVIOR_KINDS: BehaviorEventKind[] = ['positive', 'redirect']
const BATHROOM_KINDS: BathroomEventKind[] = ['depart', 'return']

function parseBehavior(raw: unknown, index: number): BehaviorEvent {
  if (!isPlainObject(raw)) assertBackupValidationError(`behaviorEvents[${index}] must be an object`)
  assertNoExtraKeys(raw, BEHAVIOR_KEYS, `behaviorEvents[${index}]`)
  const kind = raw.kind
  if (typeof kind !== 'string' || !BEHAVIOR_KINDS.includes(kind as BehaviorEventKind)) {
    assertBackupValidationError(`behaviorEvents[${index}].kind must be "positive" or "redirect"`)
  }
  return {
    id: requireString(raw.id, `behaviorEvents[${index}].id`),
    sessionId: requireString(raw.sessionId, `behaviorEvents[${index}].sessionId`),
    createdAt: requireString(raw.createdAt, `behaviorEvents[${index}].createdAt`),
    kind: kind as BehaviorEventKind,
  }
}

function parseBathroom(raw: unknown, index: number): BathroomEvent {
  if (!isPlainObject(raw)) assertBackupValidationError(`bathroomEvents[${index}] must be an object`)
  assertNoExtraKeys(raw, BATHROOM_KEYS, `bathroomEvents[${index}]`)
  const kind = raw.kind
  if (typeof kind !== 'string' || !BATHROOM_KINDS.includes(kind as BathroomEventKind)) {
    assertBackupValidationError(`bathroomEvents[${index}].kind must be "depart" or "return"`)
  }
  return {
    id: requireString(raw.id, `bathroomEvents[${index}].id`),
    sessionId: requireString(raw.sessionId, `bathroomEvents[${index}].sessionId`),
    createdAt: requireString(raw.createdAt, `bathroomEvents[${index}].createdAt`),
    kind: kind as BathroomEventKind,
  }
}

function parseSetting(raw: unknown, index: number): AppSettingRecord {
  if (!isPlainObject(raw)) assertBackupValidationError(`settings[${index}] must be an object`)
  assertNoExtraKeys(raw, SETTINGS_KEYS, `settings[${index}]`)
  const key = requireString(raw.key, `settings[${index}].key`)
  if (key !== SETTINGS_SCHEMA_VERSION_KEY) {
    assertBackupValidationError(
      `settings[${index}].key "${key}" is not supported (only "${SETTINGS_SCHEMA_VERSION_KEY}" in v1 export)`,
    )
  }
  return { key: SETTINGS_SCHEMA_VERSION_KEY, value: raw.value }
}

function assertUniqueIds(rows: { id: string }[], table: string): void {
  const seen = new Set<string>()
  for (const row of rows) {
    if (seen.has(row.id)) assertBackupValidationError(`Duplicate id in ${table}`)
    seen.add(row.id)
  }
}

function validateForeignKeys(
  sessions: SessionRecord[],
  participationEvents: ParticipationEvent[],
  behaviorEvents: BehaviorEvent[],
  bathroomEvents: BathroomEvent[],
): void {
  const sessionIds = new Set(sessions.map((s) => s.id))
  for (let i = 0; i < participationEvents.length; i++) {
    const sid = participationEvents[i].sessionId
    if (!sessionIds.has(sid)) {
      assertBackupValidationError(
        `participationEvents[${i}].sessionId "${sid}" does not match any session id`,
      )
    }
  }
  for (let i = 0; i < behaviorEvents.length; i++) {
    const sid = behaviorEvents[i].sessionId
    if (!sessionIds.has(sid)) {
      assertBackupValidationError(`behaviorEvents[${i}].sessionId "${sid}" does not match any session id`)
    }
  }
  for (let i = 0; i < bathroomEvents.length; i++) {
    const sid = bathroomEvents[i].sessionId
    if (!sessionIds.has(sid)) {
      assertBackupValidationError(`bathroomEvents[${i}].sessionId "${sid}" does not match any session id`)
    }
  }
}

/**
 * Reads all shipped capture tables into the backup payload shape (no envelope).
 */
export async function readBackupTablesFromDb(db: ClassPulseDB): Promise<ClassPulseLocalBackupTables> {
  const [sessions, settings, participationEvents, behaviorEvents, bathroomEvents] = await Promise.all([
    db.sessions.toArray(),
    db.settings.toArray(),
    db.participationEvents.toArray(),
    db.behaviorEvents.toArray(),
    db.bathroomEvents.toArray(),
  ])
  return { sessions, settings, participationEvents, behaviorEvents, bathroomEvents }
}

export async function buildLocalBackupFile(db: ClassPulseDB): Promise<ClassPulseLocalBackupFileV1> {
  const data = await readBackupTablesFromDb(db)
  return {
    format: CLASSPULSE_LOCAL_BACKUP_FORMAT,
    formatVersion: CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    dexieSchemaVersion: CLASSPULSE_DEXIE_SCHEMA_VERSION,
    data,
  }
}

export function serializeLocalBackupFile(doc: ClassPulseLocalBackupFileV1): string {
  return `${JSON.stringify(doc, null, 2)}\n`
}

/**
 * Parses JSON text and validates it as a v1 ClassPulse local backup. Throws `BackupValidationError`
 * or `SyntaxError` from `JSON.parse` on failure.
 */
export function parseAndValidateLocalBackupJson(jsonText: string): ClassPulseLocalBackupTables {
  let root: unknown
  try {
    root = JSON.parse(jsonText) as unknown
  } catch (e) {
    if (e instanceof SyntaxError) throw e
    throw e
  }
  if (!isPlainObject(root)) assertBackupValidationError('Backup root must be a JSON object')

  if (root.format !== CLASSPULSE_LOCAL_BACKUP_FORMAT) {
    assertBackupValidationError('Unrecognized backup format (expected ClassPulse local backup)')
  }
  if (root.formatVersion !== CLASSPULSE_LOCAL_BACKUP_FORMAT_VERSION) {
    assertBackupValidationError(`Unsupported backup formatVersion (got ${String(root.formatVersion)})`)
  }
  if (typeof root.exportedAt !== 'string' || root.exportedAt.length === 0) {
    assertBackupValidationError('exportedAt must be a non-empty string')
  }
  if (root.dexieSchemaVersion !== CLASSPULSE_DEXIE_SCHEMA_VERSION) {
    assertBackupValidationError(
      `dexieSchemaVersion must be ${CLASSPULSE_DEXIE_SCHEMA_VERSION} for this app version`,
    )
  }
  const data = root.data
  if (!isPlainObject(data)) assertBackupValidationError('data must be an object')

  for (const key of [
    'sessions',
    'settings',
    'participationEvents',
    'behaviorEvents',
    'bathroomEvents',
  ] as const) {
    if (!Array.isArray(data[key])) assertBackupValidationError(`data.${key} must be an array`)
  }
  assertNoExtraKeys(
    data,
    new Set(['sessions', 'settings', 'participationEvents', 'behaviorEvents', 'bathroomEvents']),
    'data',
  )

  const sessions = (data.sessions as unknown[]).map((row, i) => parseSession(row, i))
  const settings = (data.settings as unknown[]).map((row, i) => parseSetting(row, i))
  const participationEvents = (data.participationEvents as unknown[]).map((row, i) =>
    parseParticipation(row, i),
  )
  const behaviorEvents = (data.behaviorEvents as unknown[]).map((row, i) => parseBehavior(row, i))
  const bathroomEvents = (data.bathroomEvents as unknown[]).map((row, i) => parseBathroom(row, i))

  assertUniqueIds(sessions, 'sessions')
  assertUniqueIds(participationEvents, 'participationEvents')
  assertUniqueIds(behaviorEvents, 'behaviorEvents')
  assertUniqueIds(bathroomEvents, 'bathroomEvents')
  const settingKeys = new Set<string>()
  for (const s of settings) {
    if (settingKeys.has(s.key)) assertBackupValidationError(`Duplicate settings key "${s.key}"`)
    settingKeys.add(s.key)
  }

  validateForeignKeys(sessions, participationEvents, behaviorEvents, bathroomEvents)

  return { sessions, settings, participationEvents, behaviorEvents, bathroomEvents }
}

/**
 * Atomically replaces all ClassPulse local tables with validated backup rows.
 * Caller must validate with `parseAndValidateLocalBackupJson` first.
 */
export async function replaceLocalDatabaseFromBackupTables(
  db: ClassPulseDB,
  tables: ClassPulseLocalBackupTables,
): Promise<void> {
  await db.transaction(
    'rw',
    [db.sessions, db.settings, db.participationEvents, db.behaviorEvents, db.bathroomEvents],
    async () => {
      await db.sessions.clear()
      await db.settings.clear()
      await db.participationEvents.clear()
      await db.behaviorEvents.clear()
      await db.bathroomEvents.clear()
      if (tables.sessions.length) await db.sessions.bulkPut(tables.sessions)
      if (tables.settings.length) await db.settings.bulkPut(tables.settings)
      if (tables.participationEvents.length)
        await db.participationEvents.bulkPut(tables.participationEvents)
      if (tables.behaviorEvents.length) await db.behaviorEvents.bulkPut(tables.behaviorEvents)
      if (tables.bathroomEvents.length) await db.bathroomEvents.bulkPut(tables.bathroomEvents)
    },
  )
}
