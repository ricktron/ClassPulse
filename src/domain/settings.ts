export const SETTINGS_SCHEMA_VERSION_KEY = 'schemaVersion' as const

export type SettingsKey = typeof SETTINGS_SCHEMA_VERSION_KEY

export interface AppSettingRecord {
  key: SettingsKey
  value: unknown
}
