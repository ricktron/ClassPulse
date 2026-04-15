# Template — AI implementation packet (starter)

**Purpose:** Define the execution envelope after intake and before non-trivial edits.

## Required fields

- Goal
- Definition of done
- Non-goals
- Source-of-truth files
- Allowed files to edit
- Forbidden edits
- Assumptions / open risks
- Verification commands or checks
- Required evidence
- Rollback note
- Expected output format

## Standard packet

```text
=== AI implementation packet (starter) ===

Goal:
Definition of done:
Non-goals:
Source-of-truth files:
Allowed files to edit:
Forbidden edits:
Assumptions / open risks:
Verification commands:
Required evidence:
Rollback note:
Expected output format:

=== End packet ===
```

## Guardrails

- Intake defines the slice; this packet defines execution boundaries.
- Use smallest safe change by default.
- Do not silently widen scope; refresh intake/packet if new surface appears.
- Repo files are authoritative over chat summaries or model memory.

## Related docs

- [../WORKFLOWS/TICKET_INTAKE_STANDARD.md](../WORKFLOWS/TICKET_INTAKE_STANDARD.md)
- [../WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md](../WORKFLOWS/VERIFICATION_EVIDENCE_STANDARD.md)
- [AI_REVIEW_PACKET_TEMPLATE.md](AI_REVIEW_PACKET_TEMPLATE.md)
