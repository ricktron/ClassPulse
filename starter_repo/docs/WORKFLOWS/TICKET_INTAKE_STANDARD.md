# Workflow — ticket intake standard (starter)

**Purpose:** Define a bounded intake shape for non-trivial work so scope, source-of-truth, and verification are explicit before edits start.

## When intake is required

Use this for non-trivial work (multi-file, ambiguous scope, security/data touch, or costly drift).

Optional for obvious one-path fixes, typo-level docs edits, or pure informational Q&A.

## Required fields

1. Classification
2. Working mode
3. Definition of done
4. Non-goals
5. Source-of-truth files
6. Risky assumptions
7. Verification plan
8. Questions (or "No questions needed.")

## Standard intake template

```text
1. Classification: <bug | feature | chore | docs | governance | spike | other>
2. Working mode: <intake | plan | implement | verify | closeout>
3. DoD: <observable completion criteria>
4. Non-goals: <explicit out-of-scope items>
5. Source-of-truth files: <paths and decision references>
6. Risky assumptions: <list or "None stated">
7. Verification plan: <commands, checks, or doc review steps>
8. Questions: <list> OR No questions needed.
```

## Handoff to implementation packet

After intake is accepted for non-trivial work, produce an implementation packet before editing:
[../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md).

## Related docs

- [AI_TOOL_ROUTING.md](AI_TOOL_ROUTING.md)
- [VERIFICATION_EVIDENCE_STANDARD.md](VERIFICATION_EVIDENCE_STANDARD.md)
- [../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md](../templates/AI_IMPLEMENTATION_PACKET_TEMPLATE.md)
- [../templates/AI_REVIEW_PACKET_TEMPLATE.md](../templates/AI_REVIEW_PACKET_TEMPLATE.md)
