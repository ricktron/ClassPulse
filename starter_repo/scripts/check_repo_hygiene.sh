#!/usr/bin/env bash
# Fail if junk files or unresolved merge conflict markers are present.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

junk_found=0
while IFS= read -r -d '' _; do
  junk_found=1
done < <(find "$ROOT" \( -type d -name .git -prune \) -o \( -type f \( -name .DS_Store -o -name '._*' -o -iname 'Thumbs.db' -o -iname 'Desktop.ini' \) -print0 \) 2>/dev/null || true)

if [[ "$junk_found" -ne 0 ]]; then
  echo "ERROR: junk files detected under: $ROOT"
  echo "Examples (not exhaustive):"
  find "$ROOT" \( -type d -name .git -prune \) -o \( -type f \( -name .DS_Store -o -name '._*' -o -iname 'Thumbs.db' -o -iname 'Desktop.ini' \) -print \) 2>/dev/null | head -n 20
  echo ""
  echo "Remediation: from repo root, run: bash scripts/bootstrap_repo.sh"
  exit 1
fi

MARKER_PATTERN='^(<<<<<<< |=======$|>>>>>>> )'
tmpfile="$(mktemp -t starter_repo_hygiene.XXXXXX)"

cleanup() { rm -f "$tmpfile"; }
trap cleanup EXIT

marker_hits=0
if command -v rg >/dev/null 2>&1; then
  set +e
  rg -n --hidden --glob '!.git/**' "$MARKER_PATTERN" "$ROOT" >"$tmpfile" 2>/dev/null
  rg_status=$?
  set -e
  if [[ "$rg_status" -eq 0 ]]; then
    marker_hits=1
  elif [[ "$rg_status" -ne 1 ]]; then
    echo "ERROR: ripgrep failed while scanning for merge conflict markers (exit $rg_status)."
    exit 2
  fi
else
  set +e
  grep -rEI --exclude-dir=.git "$MARKER_PATTERN" "$ROOT" >"$tmpfile" 2>/dev/null
  grep_status=$?
  set -e
  if [[ "$grep_status" -eq 0 ]]; then
    marker_hits=1
  elif [[ "$grep_status" -ne 1 && "$grep_status" -ne 2 ]]; then
    echo "ERROR: grep failed while scanning for merge conflict markers (exit $grep_status)."
    exit 2
  fi
fi

if [[ "$marker_hits" -ne 0 ]]; then
  echo "ERROR: merge conflict markers found:"
  cat "$tmpfile"
  echo ""
  echo "Remediation: resolve conflicts in the listed files (remove <<<<<<<, =======, >>>>>>> lines)."
  exit 1
fi

echo "OK: repo hygiene check passed (no junk files; no merge conflict markers)."
