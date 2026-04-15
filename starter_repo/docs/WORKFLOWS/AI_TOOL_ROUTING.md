# Workflow — AI tool routing (starter)

**Purpose:** Provide a reusable operator routing layer for AI-assisted work. This is a mode/tool map, not a replacement for architecture docs, decisions, or repo policy.

**Scope:** Non-trivial planning, implementation, verification, and closeout work in this starter.

## Operator workflow shape

Canonical chain:

**intake → implementation packet → verify → review packet → closeout**

| Stage | Role | Canonical doc |
|-------|------|---------------|
| Intake | Bound scope, DoD, non-goals, source files | [TICKET_INTAKE_STANDARD.md](TICKET_INTAKE_STANDARD.md) |
| Implementation packet | Allowed edits, forbidden edits, evidence, rollback | [../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md) |
| Verify | Run checks that match the change type | [VERIFICATION_EVIDENCE_STANDARD.md](VERIFICATION_EVIDENCE_STANDARD.md) |
| Review packet | Confirm what passed, what is unverified, and risk posture | [../templates/AI_REVIEW_PACKET_TEMPLATE.md](../templates/AI_REVIEW_PACKET_TEMPLATE.md) |
| Closeout | Land durable updates and summarize outcomes | [POST_CHAT_CLOSEOUT.md](POST_CHAT_CLOSEOUT.md) |

Use [../ai/AI_FAILURE_TAXONOMY.md](../ai/AI_FAILURE_TAXONOMY.md) during review/closeout when naming repeated misses.

## Routing principles

- Mode-first: choose intake/plan/implement/verify/closeout before choosing a tool.
- Least-powerful adequate tool: prefer deterministic checks when possible.
- Repo files over model memory: verify claims against checked-in paths.
- Evidence at transitions: "done" claims need proof appropriate to change type.

## Default mode goals

| Mode | Primary goal |
|------|--------------|
| Intake | Establish bounded problem statement and verification plan |
| Plan | Sequence work, risks, and rollback |
| Implement | Deliver smallest safe diff inside the envelope |
| Verify | Run checks and capture evidence or explicit waivers |
| Closeout | Preserve durable repo state and handoff clarity |

## Related docs

- [TICKET_INTAKE_STANDARD.md](TICKET_INTAKE_STANDARD.md)
- [VERIFICATION_EVIDENCE_STANDARD.md](VERIFICATION_EVIDENCE_STANDARD.md)
- [../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md)
- [../templates/AI_REVIEW_PACKET_TEMPLATE.md](../templates/AI_REVIEW_PACKET_TEMPLATE.md)
- [../ai/AI_FAILURE_TAXONOMY.md](../ai/AI_FAILURE_TAXONOMY.md)
- [POST_CHAT_CLOSEOUT.md](POST_CHAT_CLOSEOUT.md)
