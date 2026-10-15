FROM ollama/ollama:latest
RUN apt-get update && apt-get install -y python3 python3-pip curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY api/ollama-worker/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages
COPY api/ollama-worker/handler.py api/ollama-worker/prepare_models.py api/ollama-worker/start.sh ./
RUN chmod +x start.sh
# Persist weights on the RunPod network volume across worker restarts.
ENV OLLAMA_MODELS=/runpod-volume/ollama
ENV OLLAMA_HOST=127.0.0.1:11434
ENTRYPOINT []
CMD ["./start.sh"]
