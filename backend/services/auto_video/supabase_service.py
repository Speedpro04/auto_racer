import os
import httpx
from typing import Optional

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}


async def list_vehicles() -> list[dict]:
    """Retorna lista de veículos ativos com thumbnail."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/veiculos",
            headers=HEADERS,
            params={
                "select": "id,marca,modelo,ano,km,preco,cor,combustivel,transmissao,status",
                "status": "eq.ativo",
                "order": "created_at.desc",
                "limit": "50",
            },
        )
        res.raise_for_status()
        veiculos = res.json()

    # Busca primeira foto de cada veículo
    for v in veiculos:
        fotos = await _get_fotos(v["id"], limit=1)
        v["thumbnail"] = fotos[0] if fotos else None

    return veiculos


async def get_vehicle_with_photos(vehicle_id: str) -> Optional[dict]:
    """Retorna dados completos do veículo + URLs das fotos do storage."""
    async with httpx.AsyncClient() as client:
        # Dados do veículo
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/veiculos",
            headers=HEADERS,
            params={
                "id": f"eq.{vehicle_id}",
                "select": "*",
                "limit": "1",
            },
        )
        res.raise_for_status()
        data = res.json()

    if not data:
        return None

    vehicle = data[0]
    vehicle["fotos"] = await _get_fotos(vehicle_id, limit=8)
    return vehicle


async def _get_fotos(vehicle_id: str, limit: int = 8) -> list[str]:
    """
    Busca URLs das fotos do veículo.
    Assume tabela `veiculo_fotos` com coluna `path` apontando para o storage.
    Ajuste conforme a estrutura do seu banco.
    """
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/veiculo_fotos",
            headers=HEADERS,
            params={
                "veiculo_id": f"eq.{vehicle_id}",
                "select": "path,ordem",
                "order": "ordem.asc",
                "limit": str(limit),
            },
        )
        res.raise_for_status()
        fotos = res.json()

    # Monta URL pública do storage
    urls = []
    for foto in fotos:
        path = foto["path"]
        url = f"{SUPABASE_URL}/storage/v1/object/public/veiculos/{path}"
        urls.append(url)

    return urls
