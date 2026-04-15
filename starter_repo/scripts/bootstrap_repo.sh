#!/usr/bin/env bash
# Remove obvious OS / junk files from the repo tree. Does not touch secrets,
# editor team configs, notes, or other project content.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

count_and_remove() {
  local label="$1"
  shift
  local n=0
  while IFS= read -r -d '' f; do
    rm -f "$f"
    n=$((n + 1))
  done < <(find "$ROOT" \( -type d -name .git -prune \) -o \( -type f "$@" -print0 \) 2>/dev/null || true)
  printf '%s: %d file(s) removed\n' "$label" "$n"
}

echo "Repo hygiene bootstrap (repo root: $ROOT)"
echo "Removing only: .DS_Store, AppleDouble (._*), Thumbs.db, Desktop.ini"
echo ""

count_and_remove ".DS_Store" -name .DS_Store
count_and_remove "AppleDouble (._*)" -name '._*'
count_and_remove "Thumbs.db" -iname 'Thumbs.db'
count_and_remove "Desktop.ini" -iname 'Desktop.ini'

echo ""
echo "Done: junk cleanup finished (no .env, editor settings, or notes touched)."
