#!/bin/bash

# Número de workers do backend. Padrão 1 (seguro mesmo sem Redis).
# Com REDIS_URL configurado, pode subir (ex: WEB_CONCURRENCY=4) para escalar.
WORKERS="${WEB_CONCURRENCY:-1}"

# Start the Python backend in the background
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 --workers "$WORKERS" &

# Start Caddy in the foreground
caddy run --config /app/Caddyfile
