from fastapi import APIRouter, HTTPException, Query, Depends, Request
from typing import Optional
from database import supabase

router = APIRouter()


@router.get("/store")
async def get_store(request: Request):
    """Dados da loja atual baseado no subdomínio"""
    store = request.state.store
    if not store:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    response = supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, active, created_at"
    ).eq("id", store["id"]).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    return response.data[0]


@router.get("/vehicles")
async def list_vehicles(
    request: Request,
    type: Optional[str] = Query(None, description="carro ou moto"),
    brand: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    limit: int = Query(20, le=50),
    offset: int = Query(0)
):
    """Lista veículos da loja com filtros"""
    store_id = request.state.store_id

    # Select vehicles and join with stores table to get phone/whatsapp
    query = supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at, "
        "stores(name, slug, phone)"
    ).eq("status", "available")

    # If in a subdomain, filter by that store. Otherwise, show all (Global Catalog)
    if store_id:
        query = query.eq("store_id", store_id)

    if type:
        query = query.eq("type", type)
    if brand:
        query = query.ilike("brand", f"%{brand}%")
    if min_price is not None:
        query = query.gte("price", min_price)
    if max_price is not None:
        query = query.lte("price", max_price)

    query = query.order("created_at", desc=True).limit(limit)

    response = query.execute()

    # Buscar mídias para cada veículo
    vehicles = response.data
    for vehicle in vehicles:
        media_response = supabase.table("vehicle_media").select(
            "id, vehicle_id, store_id, url, type, order, size_bytes"
        ).eq("vehicle_id", vehicle["id"]).order("order").execute()
        vehicle["media"] = media_response.data

    return vehicles


@router.get("/vehicles/{slug_or_id}")
async def get_vehicle_detail(request: Request, slug_or_id: str):
    """Detalhes de um veículo com mídias (busca por slug ou ID)"""
    store_id = request.state.store_id

    # Tenta buscar por slug primeiro
    response = supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("slug", slug_or_id).eq("store_id", store_id).execute()

    # Se não encontrar por slug, tenta por ID
    if not response.data:
        response = supabase.table("vehicles").select(
            "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
        ).eq("id", slug_or_id).eq("store_id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    vehicle = response.data[0]
    vehicle_id = vehicle["id"]

    # Buscar mídias
    media_response = supabase.table("vehicle_media").select(
        "id, vehicle_id, store_id, url, type, order, size_bytes"
    ).eq("vehicle_id", vehicle_id).order("order").execute()

    vehicle["media"] = media_response.data

    # Registrar view (opcional)
    try:
        supabase.rpc("record_vehicle_view", {
            "p_vehicle_id": vehicle_id,
            "p_store_id": store_id
        }).execute()
    except:
        pass  # Ignorar erro de analytics

    return vehicle


@router.get("/stores")
async def list_stores():
    """Lista todas as lojas ativas"""
    response = supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, created_at"
    ).eq("active", True).order("created_at", desc=True).execute()

    return response.data
