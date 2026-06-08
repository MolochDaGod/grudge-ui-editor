#!/usr/bin/env bash
# Quick local static preview of this build before uploading to Puter.
# Serves the current directory (where index.html lives) on http://localhost:8000
set -e
cd "$(dirname "$0")"
PORT="${1:-8000}"
echo "Serving Game UI Kit at http://localhost:${PORT}  (Ctrl+C to stop)"
if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "${PORT}"
elif command -v npx >/dev/null 2>&1; then
  exec npx --yes serve -l "${PORT}" .
else
  echo "Need python3 or npx to serve files." >&2
  exit 1
fi
