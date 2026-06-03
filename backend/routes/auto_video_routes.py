from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel
from typing import Optional
import uuid

from auth import get_current_store_id
from services.auto_video.supabase_service import get_vehicle_with_photos, list_vehicles, upload_video
from services.auto_video.copy_service import generate_spin_copy
from services.auto_video.tts_service import generate_tts
from services.auto_video.video_service import render_video
from services.auto_video import job_store

router = APIRouter()


class VideoRequest(BaseModel):
    vehicle_id: str
    site_url: Optional[str] = "www.seusite.com.br"
    site_nome: Optional[str] = "Sua Loja"
    whatsapp: Optional[str] = "(11) 99999-9999"


class VideoStatusResponse(BaseModel):
    job_id: str
    status: str
    video_url: Optional[str] = None
    copy: Optional[dict] = None
    error: Optional[str] = None


@router.post("/generate", response_model=VideoStatusResponse)
async def generate_video(req: VideoRequest, background_tasks: BackgroundTasks, store_id: str = Depends(get_current_store_id)):
    job_id = str(uuid.uuid4())
    job_store.set_job(job_id, {"status": "pending", "video_url": None, "copy": None, "error": None, "store_id": store_id})

    background_tasks.add_task(
        _run_pipeline,
        job_id=job_id,
        store_id=store_id,
        vehicle_id=req.vehicle_id,
        site_url=req.site_url,
        site_nome=req.site_nome,
        whatsapp=req.whatsapp,
    )

    return VideoStatusResponse(job_id=job_id, status="pending")


@router.get("/status/{job_id}", response_model=VideoStatusResponse)
def get_status(job_id: str):
    job = job_store.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    # Mantém só os campos do response model (descarta store_id interno)
    return VideoStatusResponse(
        job_id=job_id,
        status=job.get("status", "pending"),
        video_url=job.get("video_url"),
        copy=job.get("copy"),
        error=job.get("error"),
    )


@router.get("/vehicles")
async def list_available_vehicles(store_id: str = Depends(get_current_store_id)):
    vehicles = await list_vehicles(store_id)
    return {"vehicles": vehicles}


async def _run_pipeline(
    job_id: str,
    store_id: str,
    vehicle_id: str,
    site_url: str,
    site_nome: str,
    whatsapp: str,
):
    try:
        job_store.update_job(job_id, status="buscando_fotos")
        vehicle = await get_vehicle_with_photos(vehicle_id, store_id)

        if not vehicle or not vehicle.get("fotos"):
            raise ValueError("Veículo não encontrado ou sem fotos")

        job_store.update_job(job_id, status="gerando_copy")
        copy = await generate_spin_copy(vehicle)
        job_store.update_job(job_id, copy=copy)

        job_store.update_job(job_id, status="gerando_audio")
        audio_path = await generate_tts(texto=copy["narracao"], job_id=job_id)

        job_store.update_job(job_id, status="renderizando")
        local_path = await render_video(
            vehicle=vehicle,
            copy=copy,
            audio_path=audio_path,
            job_id=job_id,
            site_url=site_url,
            site_nome=site_nome,
            whatsapp=whatsapp,
        )

        # Sobe o MP4 para o Storage (durável e acessível entre workers)
        job_store.update_job(job_id, status="publicando")
        video_url = await upload_video(local_path, store_id, job_id)

        job_store.update_job(job_id, status="done", video_url=video_url)
    except Exception as exc:
        job_store.update_job(job_id, status="error", error=str(exc))
