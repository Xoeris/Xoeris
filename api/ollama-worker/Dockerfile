# XESC Engine — RunPod Serverless worker running Ollama + Qwen2.5:1.5b
#
# Model is baked into the image at build time (`ollama pull` during build)
# so cold starts don't need to download weights over the network.

FROM ollama/ollama:latest

# --- Install Python for the RunPod handler ---
RUN apt-get update && apt-get install -y python3 python3-pip curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# --- Bake the model into the image ---
# Start the ollama server in the background just long enough to pull the
# model, then let the entrypoint script own it at runtime.
RUN (ollama serve &) && sleep 5 && ollama pull qwen2.5:1.5b

COPY handler.py .
COPY start.sh .
RUN chmod +x start.sh

ENV OLLAMA_MODEL=qwen2.5:1.5b
ENV OLLAMA_HOST=0.0.0.0:11434

CMD ["./start.sh"]
