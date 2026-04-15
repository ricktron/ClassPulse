/**
 * Fixed top-level modes for true v1 (ClassPulse product baseline).
 * Socratic questioning lives under Participation, not as a top-level mode.
 */
export const SESSION_MODES_V1 = [
  'sleep',
  'participation',
  'behavior',
  'bathroom',
  'notes',
  'assessments',
] as const

export type SessionModeV1 = (typeof SESSION_MODES_V1)[number]

export function isSessionModeV1(value: string): value is SessionModeV1 {
  return (SESSION_MODES_V1 as readonly string[]).includes(value)
}
