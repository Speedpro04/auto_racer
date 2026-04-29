import os
import base64
import httpx
import edge_tts

GOOGLE_TTS_KEY = os.getenv("GOOGLE_TTS_API_KEY")

# Voz masculina pt-BR de alta qualidade
TTS_CONFIG = {
    "languageCode": "pt-BR",
    "name": "pt-BR-Neural2-B",   # Masculino neural — melhor qualidade gratuita
    "ssmlGender": "MALE",
}

AUDIO_CONFIG = {
    "audioEncoding": "MP3",
    "speakingRate": 1.0,          # 1.0 = normal; aumente para 1.1 se quiser mais dinâmico
    "pitch": -1.0,                # Tom levemente grave — mais autoridade
    "volumeGainDb": 2.0,
}


async def generate_tts(texto: str, job_id: str) -> str:
    """
    Gera áudio MP3 com Google TTS e salva em outputs/{job_id}_audio.mp3.
    Retorna o path do arquivo gerado.
    """
    output_path = f"outputs/{job_id}_audio.mp3"

    if not GOOGLE_TTS_KEY:
        communicate = edge_tts.Communicate(
            texto,
            voice="pt-BR-AntonioNeural",
            rate="+0%",
            pitch="-2Hz",
            volume="+0%",
        )
        await communicate.save(output_path)
        return output_path

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_TTS_KEY}",
            json={
                "input": {"text": texto},
                "voice": TTS_CONFIG,
                "audioConfig": AUDIO_CONFIG,
            },
        )
        res.raise_for_status()
        data = res.json()

    audio_bytes = base64.b64decode(data["audioContent"])

    with open(output_path, "wb") as f:
        f.write(audio_bytes)

    return output_path
