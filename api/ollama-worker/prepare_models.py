"""Prepare worker-side Ollama aliases. Never runs on desktop clients."""
import os
import subprocess
from pathlib import Path

SOURCES = {
    'atlas': 'hf.co/empero-ai/Qwythos-9B-Claude-Mythos-5-1M-GGUF:Qwythos-9B-Claude-Mythos-5-1M-Q4_K_M.gguf',
    'forge': 'hf.co/aemmeath/NasledieLab-Qwen3.5-0.8B-GPT-6-Astra-Luna-Fable-5.1-Opus-5.5-distill-Karpy-GGUF:Q4_K_M',
}
for name, source in SOURCES.items():
    subprocess.run(['ollama', 'pull', source], check=True)
    subprocess.run(['ollama', 'cp', source, f'xalme-{name}'], check=True)
# Nebula's supplied repository contains Safetensors, not a GGUF artifact.
# Convert that exact repository with llama.cpp first; never silently substitute another model.
nebula = os.environ.get('XALME_NEBULA_GGUF')
if nebula:
    path = Path(nebula).resolve(strict=True)
    modelfile = Path('/tmp/Nebula.Modelfile')
    modelfile.write_text(f'FROM "{path}"\n', encoding='utf-8')
    subprocess.run(['ollama', 'create', 'xalme-nebula', '-f', str(modelfile)], check=True)
else:
    print('Nebula not provisioned: set XALME_NEBULA_GGUF to the converted GGUF on the worker volume.')
