#!/bin/bash
# Starts the Ollama server in the background, waits until it's ready,
# then hands off to the RunPod Python handler which stays in the
# foreground as the container's main process.

set -e

echo "[xoeris-api] Starting Ollama server..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama's HTTP API to come up before accepting jobs
until curl -sf http://127.0.0.1:11434/api/tags > /dev/null 2>&1; do
  echo "[xoeris-api] Waiting for Ollama..."
  sleep 1
done

echo "[xoeris-api] Ollama ready. Starting RunPod handler..."
python3 -u handler.py

# If the handler ever exits, bring Ollama down with it
kill $OLLAMA_PID
