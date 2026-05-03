import os
import asyncio
import httpx
import tempfile
import shutil
from pathlib import Path
from mutagen.mp3 import MP3
from imageio_ffmpeg import get_ffmpeg_exe

# Dimensões 9:16 para Reels/TikTok
W, H = 1080, 1920

# Música de fundo (royalty-free — substitua pela sua)
BG_MUSIC_URL = os.getenv(
    "BG_MUSIC_URL",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kai_Engel/Satin/Kai_Engel_-_04_-_Satin.mp3",
)


async def render_video(
    vehicle: dict,
    copy: dict,
    audio_path: str,
    job_id: str,
    site_url: str,
    site_nome: str,
    whatsapp: str,
) -> str:
    """
    Pipeline completo:
    1. Download das fotos do Supabase
    2. Download da música de fundo
    3. Monta slideshow 9:16 com FFmpeg
    4. Overlay de texto animado (título, bullets, legenda, watermark)
    5. Mix de áudio (narração + música de fundo)
    6. Exporta MP4 em outputs/{job_id}.mp4
    """
    ffmpeg_bin = _get_ffmpeg_bin()

    os.makedirs("outputs", exist_ok=True)
    output_path = f"outputs/{job_id}.mp4"
    tmp_dir = Path(tempfile.gettempdir()) / f"video_{job_id}"
    tmp_dir.mkdir(exist_ok=True)

    # ── 1. Download fotos ─────────────────────────────────────────────────────
    foto_paths = []
    async with httpx.AsyncClient(timeout=30) as client:
        for i, url in enumerate(vehicle["fotos"][:8]):
            res = await client.get(url)
            ext = "jpg"
            path = tmp_dir / f"foto_{i:02d}.{ext}"
            path.write_bytes(res.content)
            foto_paths.append(str(path))

    if not foto_paths:
        raise ValueError("Nenhuma foto disponível para renderizar")

    # ── 2. Download música de fundo ───────────────────────────────────────────
    music_path = tmp_dir / "music.mp3"
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.get(BG_MUSIC_URL)
        music_path.write_bytes(res.content)

    # ── 3. Duração do áudio TTS ───────────────────────────────────────────────
    duration = await _get_audio_duration(audio_path)
    duration = max(15.0, min(30.0, duration + 1.5))  # clamp 15–30s

    # Tempo por foto
    n_fotos = len(foto_paths)
    tempo_foto = duration / n_fotos

    # ── 4. Monta concat list ──────────────────────────────────────────────────
    concat_file = tmp_dir / "concat.txt"
    with open(concat_file, "w") as f:
        for path in foto_paths:
            f.write(f"file '{path}'\n")
            f.write(f"duration {tempo_foto:.2f}\n")
        # Repete última foto (exigência do FFmpeg concat)
        f.write(f"file '{foto_paths[-1]}'\n")

    # ── 5. Monta filtergraph ──────────────────────────────────────────────────
    titulo = copy.get("titulo", "").upper()
    bullets = copy.get("destaque", [])
    legendas = copy.get("legendas", [])

    preco_fmt = _format_preco(vehicle.get("preco", ""))
    marca_modelo = f"{vehicle.get('marca', '')} {vehicle.get('modelo', '')} {vehicle.get('ano', '')}".strip()

    vf = _build_filtergraph(
        n_fotos=n_fotos,
        tempo_foto=tempo_foto,
        titulo=titulo,
        marca_modelo=marca_modelo,
        bullets=bullets,
        legendas=legendas,
        preco=preco_fmt,
        site_url=site_url,
        site_nome=site_nome,
        whatsapp=whatsapp,
        duration=duration,
    )

    # ── 6. Comando FFmpeg ─────────────────────────────────────────────────────
    cmd = [
        ffmpeg_bin, "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-i", audio_path,
        "-i", str(music_path),
        "-filter_complex",
        # Escala fotos para 9:16, mix de áudio (narração full + música 20%)
        f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,"
        f"crop={W}:{H},setsar=1,fps=30{vf}[vout];"
        f"[1:a]volume=1.0[tts];"
        f"[2:a]volume=0.18,atrim=0:{duration},afade=t=out:st={duration-2}:d=2[music];"
        f"[tts][music]amix=inputs=2:duration=first[aout]",
        "-map", "[vout]",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-t", str(duration),
        "-movflags", "+faststart",
        output_path,
    ]

    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()

    if proc.returncode != 0:
        raise RuntimeError(f"FFmpeg falhou:\n{stderr.decode()[-1000:]}")

    return output_path


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _format_preco(preco) -> str:
    try:
        v = float(str(preco).replace(".", "").replace(",", "."))
        return f"R$ {v:,.0f}".replace(",", ".")
    except Exception:
        return f"R$ {preco}"


async def _get_audio_duration(path: str) -> float:
    try:
        return float(MP3(path).info.length)
    except Exception:
        return 20.0


def _get_ffmpeg_bin() -> str:
    """Usa ffmpeg do PATH ou binário empacotado do imageio-ffmpeg."""
    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg:
        return ffmpeg
    try:
        return get_ffmpeg_exe()
    except Exception as exc:
        raise RuntimeError(
            "FFmpeg indisponível. Instale ffmpeg no sistema ou imageio-ffmpeg."
        ) from exc


def _escape(text: str) -> str:
    """Escapa caracteres especiais para o filtro drawtext do FFmpeg."""
    return (
        str(text)
        .replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace(":", "\\:")
        .replace(",", "\\,")
        .replace("[", "\\[")
        .replace("]", "\\]")
    )


def _build_filtergraph(
    n_fotos: int,
    tempo_foto: float,
    titulo: str,
    marca_modelo: str,
    bullets: list,
    legendas: list,
    preco: str,
    site_url: str,
    site_nome: str,
    whatsapp: str,
    duration: float,
) -> str:
    """
    Retorna a parte do filtergraph que vem DEPOIS do scale/crop/fps,
    adicionando todos os overlays de texto.
    Usa fonte padrão — sem dependência de fonte externa.
    """
    filters = []
    FW = W  # 1080

    # ── Fundo semi-transparente no topo (gradiente simulado com retângulo) ────
    # Retângulo escuro no topo para o título
    filters.append(
        f",drawbox=x=0:y=0:w={FW}:h=280:color=black@0.55:t=fill"
    )

    # ── Retângulo escuro na base (bullets + watermark) ────────────────────────
    filters.append(
        f",drawbox=x=0:y={H-420}:w={FW}:h=420:color=black@0.60:t=fill"
    )

    # ── TÍTULO (topo, animação fade-in slide-down) ────────────────────────────
    titulo_esc = _escape(titulo[:40])
    filters.append(
        f",drawtext=text='{titulo_esc}'"
        f":fontsize=62:fontcolor=white:x=(w-text_w)/2"
        f":y=60+20*(1-min(t/0.4\\,1))"   # slide-down simples
        f":alpha=min(t/0.4\\,1)"
        f":box=0:font=Sans:fontweight=bold"
    )

    # ── Marca/Modelo (subtítulo topo) ─────────────────────────────────────────
    mm_esc = _escape(marca_modelo[:50])
    filters.append(
        f",drawtext=text='{mm_esc}'"
        f":fontsize=38:fontcolor=0xFFD700:x=(w-text_w)/2:y=160"
        f":alpha=min(t/0.5\\,1):font=Sans"
    )

    # ── PREÇO (destaque central, aparece após 1s) ─────────────────────────────
    preco_esc = _escape(preco)
    filters.append(
        f",drawtext=text='{preco_esc}'"
        f":fontsize=80:fontcolor=white:fontweight=bold"
        f":x=(w-text_w)/2:y=(h/2)-40"
        f":alpha=if(lt(t\\,1)\\,0\\,min((t-1)/0.4\\,1))"
        f":box=1:boxcolor=0xC9A84C@0.85:boxborderw=20:font=Sans"
    )

    # ── BULLETS (base esquerda) ───────────────────────────────────────────────
    bullet_y_start = H - 400
    for i, bullet in enumerate(bullets[:3]):
        b_esc = _escape(f"• {bullet}")
        delay = 1.5 + i * 0.4
        filters.append(
            f",drawtext=text='{b_esc}'"
            f":fontsize=36:fontcolor=white:x=60:y={bullet_y_start + i*70}"
            f":alpha=if(lt(t\\,{delay})\\,0\\,min((t-{delay})/0.3\\,1))"
            f":font=Sans"
        )

    # ── LEGENDAS (centro-baixo, sincronizadas) ────────────────────────────────
    for leg in legendas:
        txt = _escape(leg.get("texto", ""))
        t_in = leg.get("inicio_seg", 0)
        t_out = leg.get("fim_seg", t_in + 1.5)
        filters.append(
            f",drawtext=text='{txt}'"
            f":fontsize=44:fontcolor=white:x=(w-text_w)/2:y={H-500}"
            f":enable='between(t\\,{t_in}\\,{t_out})'"
            f":box=1:boxcolor=black@0.6:boxborderw=12:font=Sans"
        )

    # ── WATERMARK / RODAPÉ ────────────────────────────────────────────────────
    site_esc = _escape(site_url)
    nome_esc = _escape(site_nome)
    wpp_esc = _escape(whatsapp)

    filters.append(
        f",drawtext=text='{nome_esc}'"
        f":fontsize=34:fontcolor=0xFFD700:x=(w-text_w)/2:y={H-120}"
        f":font=Sans:fontweight=bold"
    )
    filters.append(
        f",drawtext=text='{site_esc}  |  {wpp_esc}'"
        f":fontsize=28:fontcolor=white@0.85:x=(w-text_w)/2:y={H-76}"
        f":font=Sans"
    )

    return "".join(filters)
