from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import uuid

from services.auto_video.supabase_service import get_vehicle_with_photos, list_vehicles
from services.auto_video.copy_service import generate_spin_copy
from services.auto_video.tts_service import generate_tts
from services.auto_video.video_service import render_video

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


# Armazenamento simples em memória (MVP). Em produção, migrar para Redis.
jobs: dict[str, dict] = {}


@router.post("/generate", response_model=VideoStatusResponse)
async def generate_video(req: VideoRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pending", "video_url": None, "copy": None, "error": None}

    background_tasks.add_task(
        _run_pipeline,
        job_id=job_id,
        vehicle_id=req.vehicle_id,
        site_url=req.site_url,
        site_nome=req.site_nome,
        whatsapp=req.whatsapp,
    )

    return VideoStatusResponse(job_id=job_id, status="pending")


@router.get("/status/{job_id}", response_model=VideoStatusResponse)
def get_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job não encontrado")
    return VideoStatusResponse(job_id=job_id, **job)


@router.get("/vehicles")
async def list_available_vehicles():
    vehicles = await list_vehicles()
    return {"vehicles": vehicles}


async def _run_pipeline(
    job_id: str,
    vehicle_id: str,
    site_url: str,
    site_nome: str,
    whatsapp: str,
):
    try:
        jobs[job_id]["status"] = "buscando_fotos"
        vehicle = await get_vehicle_with_photos(vehicle_id)

        if not vehicle or not vehicle.get("fotos"):
            raise ValueError("Veículo não encontrado ou sem fotos")

        jobs[job_id]["status"] = "gerando_copy"
        copy = await generate_spin_copy(vehicle)
        jobs[job_id]["copy"] = copy

        jobs[job_id]["status"] = "gerando_audio"
        audio_path = await generate_tts(texto=copy["narracao"], job_id=job_id)

        jobs[job_id]["status"] = "renderizando"
        await render_video(
            vehicle=vehicle,
            copy=copy,
            audio_path=audio_path,
            job_id=job_id,
            site_url=site_url,
            site_nome=site_nome,
            whatsapp=whatsapp,
        )

        jobs[job_id]["status"] = "done"
        jobs[job_id]["video_url"] = f"/outputs/{job_id}.mp4"
    except Exception as exc:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(exc)
