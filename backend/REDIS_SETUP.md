# Redis — estado dos jobs de vídeo

O módulo de vídeo guarda o estado de cada job (gerando_copy, renderizando, done…)
no `job_store`. Com Redis, esse estado é **compartilhado entre workers** e
**sobrevive a restart**. Sem Redis, usa memória (ok só para 1 worker).

> O vídeo final já vai para o Supabase Storage (URL durável). O Redis serve apenas
> para o acompanhamento do job durante a geração.

## Quando usar
- **1 worker** → opcional (memória funciona).
- **Vários workers / réplicas** → **obrigatório**, senão o polling de status falha.

---

## Desenvolvimento local

```bash
# Sobe um Redis local em container
docker compose -f docker-compose.redis.yml up -d

# No backend/.env
REDIS_URL=redis://localhost:6379/0

# Roda o backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Confirme em `GET /health` → deve responder `"job_store": "redis"`.

---

## Produção (EasyPanel / Hostinger)

1. No painel do EasyPanel, **+ Create Service → Redis** (ou App a partir da imagem
   `redis:7-alpine`). Anote o host interno (ex: `autoracer-redis`).
2. No serviço do **backend**, em *Environment*, adicione:
   ```
   REDIS_URL=redis://autoracer-redis:6379/0
   ```
   (use o host/porta que o EasyPanel mostrar; com senha:
   `redis://:SENHA@host:6379/0`)
3. Comando de start do backend:
   ```
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
4. Valide: `GET https://SEU_BACKEND/health` → `"job_store": "redis"`.

### Sem Redis (alternativa simples)
Rode com **1 worker** e não defina `REDIS_URL`:
```
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
```
`GET /health` mostrará `"job_store": "memory"`.
