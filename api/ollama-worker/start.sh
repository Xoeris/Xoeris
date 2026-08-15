#!/bin/bash
# Starts the Ollama server in the background, waits until it's ready,
# then hands off to the RunPod Python handler which stays in the
# foreground as the container's main process.

set -e

echo "[xoeris-api] Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama's HTTP API to come up before accepting jobs, but don't
# wait forever — if Ollama died or is stuck, fail loudly instead of hanging
# (a RunPod worker that hangs here never picks up jobs either).
READY_TIMEOUT=60
elapsed=0
until curl -sf http://127.0.0.1:11434/api/tags > /dev/null 2>&1; do
  if ! kill -0 "$OLLAMA_PID" 2>/dev/null; then
    echo "[xoeris-api] ERROR: Ollama server process died while starting up."
    exit 1
  fi
  if [ "$elapsed" -ge "$READY_TIMEOUT" ]; then
    echo "[xoeris-api] ERROR: Ollama did not become ready within ${READY_TIMEOUT}s."
    exit 1
  fi
  echo "[xoeris-api] Waiting for Ollama... (${elapsed}s)"
  sleep 1
  elapsed=$((elapsed + 1))
done

echo "[xoeris-api] Ollama ready. Starting RunPod handler..."
python3 -u handler.py

# If the handler ever exits, bring Ollama down with it
kill $OLLAMA_PID