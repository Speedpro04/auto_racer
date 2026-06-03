"""Armazenamento de estado dos jobs de vídeo.

Usa Redis quando REDIS_URL está configurado (produção, sobrevive a restart e
funciona entre múltiplos workers). Sem Redis, cai para um dicionário em memória
(suficiente para desenvolvimento local de 1 worker).
"""
import os
import json

try:
    import redis as _redis
except ImportError:
    _redis = None

REDIS_URL = os.getenv("REDIS_URL")
_TTL_SECONDS = 86400  # 24h

_mem: dict[str, dict] = {}
_client = None


def _get_client():
    global _client
    if REDIS_URL and _redis is not None:
        if _client is None:
            _client = _redis.from_url(REDIS_URL, decode_responses=True)
        return _client
    return None


def is_redis_enabled() -> bool:
    """True se REDIS_URL está configurado e a lib redis disponível."""
    return bool(REDIS_URL and _redis is not None)


def ping() -> bool:
    """Testa a conexão com o Redis. False se indisponível."""
    client = _get_client()
    if not client:
        return False
    try:
        return bool(client.ping())
    except Exception:
        return False


def _key(job_id: str) -> str:
    return f"autovideo:{job_id}"


def set_job(job_id: str, data: dict) -> None:
    client = _get_client()
    if client:
        client.set(_key(job_id), json.dumps(data), ex=_TTL_SECONDS)
    else:
        _mem[job_id] = data


def get_job(job_id: str):
    client = _get_client()
    if client:
        raw = client.get(_key(job_id))
        return json.loads(raw) if raw else None
    return _mem.get(job_id)


def update_job(job_id: str, **fields) -> dict:
    data = get_job(job_id) or {}
    data.update(fields)
    set_job(job_id, data)
    return data
