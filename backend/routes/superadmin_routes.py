from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import supabase
from auth import get_superadmin

router = APIRouter()

# Planos pagos consideram-se geradores de receita recorrente.
PAID_PLANS = ("parceiro", "pro", "premium", "exclusivo")
PLAN_PRICE = 89.0  # R$/mês do Plano Parceiro


class StatusUpdate(BaseModel):
    active: bool


@router.get("/stats")
async def get_stats(_=Depends(get_superadmin)):
    """Métricas globais da rede SaaS."""
    stores = supabase.table("stores").select("id, plan, active", count="exact").execute()
    vehicles = supabase.table("vehicles").select("id", count="exact").execute()
    leads = supabase.table("vehicle_contacts").select("id", count="exact").execute()

    active_paid = [
        s for s in (stores.data or [])
        if s.get("active") and s.get("plan") in PAID_PLANS
    ]

    return {
        "total_stores": stores.count or 0,
        "total_vehicles": vehicles.count or 0,
        "total_leads": leads.count or 0,
        "mrr_estimated": len(active_paid) * PLAN_PRICE,
    }


@router.get("/stores")
async def list_all_stores(_=Depends(get_superadmin)):
    """Lista todas as lojas com contagem de veículos e leads."""
    res = supabase.table("stores").select(
        "id, name, phone, slug, active, plan, created_at, "
        "vehicles(count), leads:vehicle_contacts(count)"
    ).order("created_at", desc=True).execute()
    return res.data


@router.patch("/stores/{store_id}/status")
async def set_store_status(store_id: str, body: StatusUpdate, _=Depends(get_superadmin)):
    """Ativa ou bloqueia o acesso de uma loja."""
    res = supabase.table("stores").update({"active": body.active}).eq("id", store_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Loja não encontrada")
    return res.data[0]
