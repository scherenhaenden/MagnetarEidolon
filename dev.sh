#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS=()

ensure_dependencies() {
  if [[ -x "$ROOT_DIR/apps/magnetar-api/node_modules/.bin/tsx" ]] && [[ -x "$ROOT_DIR/apps/magnetar-ui/node_modules/.bin/ng" ]]; then
    return
  fi

  echo "Installing missing workspace dependencies..."
  npm --prefix "$ROOT_DIR/packages/magnetar-sdk" install
  npm --prefix "$ROOT_DIR/apps/magnetar-api" install
  npm --prefix "$ROOT_DIR/apps/magnetar-ui" install
}

cleanup() {
  trap - EXIT INT TERM

  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done

  sleep 1

  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -9 "$pid" 2>/dev/null || true
    fi
  done

  wait "${PIDS[@]}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

ensure_dependencies

npm --prefix "$ROOT_DIR/apps/magnetar-api" run start:dev &
PIDS+=("$!")

npm --prefix "$ROOT_DIR/apps/magnetar-ui" run start -- --host 0.0.0.0 &
PIDS+=("$!")

wait "${PIDS[@]}"
