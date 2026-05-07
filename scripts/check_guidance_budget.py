#!/usr/bin/env python3
"""Warn-first guidance budget scan for auto-loaded agent guidance files.

Runs from repository root. Stdlib only. Does not mutate files.
Exit 0 with warnings; exit 1 only on unreadable scanned files or internal failure.
"""

from __future__ import annotations

import argparse
import glob
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_PATHS = [
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    ".cursorrules",
    "docs/ai/AGENT_STARTUP_CHECKLIST.md",
    "docs/WORKFLOWS/ENGINEERING_SESSION_HABITS.md",
]

KEYWORDS = ("must", "always", "never", "do not", "required")

# Flexible markers for "mentions" (case-insensitive).
SOURCE_OF_TRUTH_PATTERNS = (
    "source-of-truth",
    "source of truth",
    "source-of-truth hierarchy",
)
VERIFICATION_MARKERS = ("verification", "verify", "proof before done")
ROLLBACK_MARKERS = ("rollback", "revert")
SECRETS_MARKERS = ("secret", "secrets", "credential", "credentials", "api key", "api keys")


@dataclass
class FileReport:
    path: str
    lines: int
    words: int
    keyword_counts: dict[str, int]
    mentions_source_of_truth: bool
    mentions_verification: bool
    mentions_rollback: bool
    mentions_secrets: bool
    warnings: list[str]


def _keyword_count(haystack_lower: str, phrase: str) -> int:
    """Count phrase occurrences; phrase uses regex word boundaries where helpful."""
    if phrase == "do not":
        return len(re.findall(r"\bdo not\b", haystack_lower))
    return len(re.findall(rf"\b{re.escape(phrase)}\b", haystack_lower))


def _word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def _mentions_any_lower(lower_text: str, markers: tuple[str, ...]) -> bool:
    return any(m in lower_text for m in markers)


def _mentions_source_of_truth(lower_text: str) -> bool:
    return _mentions_any_lower(lower_text, SOURCE_OF_TRUTH_PATTERNS)


def analyze_text(relative_path: str, text: str) -> FileReport:
    lower = text.lower()
    kw_counts = {kw: _keyword_count(lower, kw.lower()) for kw in KEYWORDS}
    lines = len(text.splitlines())
    return FileReport(
        path=relative_path,
        lines=lines,
        words=_word_count(text),
        keyword_counts=kw_counts,
        mentions_source_of_truth=_mentions_source_of_truth(lower),
        mentions_verification=_mentions_any_lower(lower, VERIFICATION_MARKERS),
        mentions_rollback=_mentions_any_lower(lower, ROLLBACK_MARKERS),
        mentions_secrets=_mentions_any_lower(lower, SECRETS_MARKERS),
        warnings=[],
    )


def collect_scan_paths(extra: list[str] | None) -> list[str]:
    paths: list[str] = []
    seen: set[str] = set()
    for p in DEFAULT_PATHS:
        if p not in seen:
            seen.add(p)
            paths.append(p)
    rules_glob = REPO_ROOT / ".cursor" / "rules" / "*.mdc"
    for mdc in sorted(glob.glob(str(rules_glob))):
        rel = os.path.relpath(mdc, REPO_ROOT)
        if rel not in seen:
            seen.add(rel)
            paths.append(rel)
    if extra:
        for p in extra:
            if p not in seen:
                seen.add(p)
                paths.append(p)
    return paths


def apply_warnings(
    report: FileReport,
    *,
    is_agents: bool,
    is_cursor_rule: bool,
) -> None:
    p = report.path
    if is_agents and report.lines > 300:
        report.warnings.append(
            f"{p}: AGENTS.md exceeds 300 lines ({report.lines}); consider routing depth to linked docs."
        )
    if report.lines > 500:
        report.warnings.append(
            f"{p}: exceeds 500 lines ({report.lines}); consider splitting or linking out."
        )
    if is_agents and not report.mentions_source_of_truth:
        report.warnings.append(
            f"{p}: AGENTS.md should mention source-of-truth (hierarchy or binding docs)."
        )
    if is_agents and not report.mentions_verification:
        report.warnings.append(
            f"{p}: AGENTS.md should mention verification / proof-before-done expectations."
        )
    if is_cursor_rule and report.lines > 250:
        report.warnings.append(
            f"{p}: Cursor rule file exceeds 250 lines ({report.lines}); consider trimming or linking."
        )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scan auto-loaded guidance files; warn on budget signals."
    )
    parser.add_argument(
        "extra_paths",
        nargs="*",
        help="Additional repo-relative paths to include in the scan.",
    )
    args = parser.parse_args()

    os.chdir(REPO_ROOT)
    scan_paths = collect_scan_paths(args.extra_paths if args.extra_paths else None)

    reports: list[FileReport] = []
    all_warnings: list[str] = []

    print("Guidance budget scan (warn-first)")
    print(f"Repository root: {REPO_ROOT}")
    print()

    for rel in scan_paths:
        full = REPO_ROOT / rel
        if not full.is_file():
            print(f"  [skip] {rel} (missing)")
            continue
        try:
            text = full.read_text(encoding="utf-8")
        except OSError as e:
            print(f"ERROR: cannot read {rel}: {e}", file=sys.stderr)
            return 1

        report = analyze_text(rel, text)
        is_agents = rel == "AGENTS.md"
        is_cursor_rule = rel.startswith(".cursor/rules/") and rel.endswith(".mdc")
        apply_warnings(report, is_agents=is_agents, is_cursor_rule=is_cursor_rule)
        all_warnings.extend(report.warnings)
        reports.append(report)

        print(f"File: {rel}")
        print(f"  Lines: {report.lines}")
        print(f"  Words: {report.words}")
        for kw in KEYWORDS:
            print(f"  Count '{kw}': {report.keyword_counts[kw]}")
        print(f"  Mentions source-of-truth: {report.mentions_source_of_truth}")
        print(f"  Mentions verification: {report.mentions_verification}")
        print(f"  Mentions rollback: {report.mentions_rollback}")
        print(f"  Mentions secrets: {report.mentions_secrets}")
        if report.warnings:
            for w in report.warnings:
                print(f"  WARNING: {w}")
        print()

    scanned = len(reports)
    has_warnings = len(all_warnings) > 0
    status = "PASS_WITH_WARNINGS" if has_warnings else "PASS"

    print("--- Summary ---")
    print(f"  Result: {status}")
    print(f"  Files scanned: {scanned}")
    print(f"  Warnings: {len(all_warnings)}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        print("\nInterrupted.", file=sys.stderr)
        raise SystemExit(130) from None
