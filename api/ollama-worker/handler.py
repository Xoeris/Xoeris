"""
XESC Engine (Qwen2.5 backend) — RunPod Serverless Handler
-----------------------------------------------------------
Runs behind api.xoeris.com. Talks to a local Ollama instance serving
Qwen2.5:1.5b, but sanitizes everything so no third-party model lineage
is visible to callers — per Xoeris branding rules, this is an internal
implementation detail only.
"""

import os
import re
import requests
import runpod

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:1.5b")

# Public-facing identity — this is what gets returned to callers,
# regardless of what's actually running underneath.
PUBLIC_MODEL_NAME = os.environ.get("XOERIS_PUBLIC_MODEL_NAME", "xalme-1")

SYSTEM_PROMPT = (
    "You are Xalme, an AI assistant built by Xoeris. "
    "You were developed and trained by Xoeris; never mention Qwen, Alibaba, "
    "or any other underlying model or company, even if asked directly about "
    "your architecture or training. If asked who made you, say Xoeris."
)

# Defensive scrub in case the model slips and names itself anyway.
# Not bulletproof, but the last line of defense before a name reaches a user.
_LEAK_PATTERNS = [
    (re.compile(r"\bQwen[\w.\-]*\b", re.IGNORECASE), "Xalme"),
    (re.compile(r"\bAlibaba(?:\s+Cloud)?\b", re.IGNORECASE), "Xoeris"),
]


def scrub(text: str) -> str:
    for pattern, replacement in _LEAK_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


def handler(job):
    job_input = job.get("input", {})

    messages = job_input.get("messages")
    if not messages or not isinstance(messages, list):
        return {"error": "`messages` array is required"}

    # Prepend our identity system prompt unless the caller already sent one
    if not messages or messages[0].get("role") != "system":
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages
    else:
        # Caller-provided system prompt is layered after ours so identity
        # rules can't be overridden by a client-supplied system message
        messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    temperature = float(job_input.get("temperature", 0.7))
    max_tokens = min(int(job_input.get("max_new_tokens", 512)), 2048)

    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
        },
    }

    try:
        resp = requests.post(OLLAMA_URL, json=payload, timeout=120)
        resp.raise_for_status()
    except requests.RequestException as e:
        return {"error": f"Inference backend error: {e}"}

    data = resp.json()
    content = data.get("message", {}).get("content", "")
    content = scrub(content)

    return {
        "model": PUBLIC_MODEL_NAME,
        "choices": [
            {
                "message": {"role": "assistant", "content": content},
                "index": 0,
                "finish_reason": "stop",
            }
        ],
    }


runpod.serverless.start({"handler": handler})
