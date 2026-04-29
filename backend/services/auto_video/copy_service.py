import os
import json
import httpx

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

SPIN_PROMPT = """Você é um vendedor top performer de concessionária, especialista em SPIN Selling para vídeos curtos (15-30 segundos), com foco em conversão via WhatsApp.

Você receberá os dados de um veículo e deve gerar:
1. Uma NARRAÇÃO em português BR de 30-45 palavras (será convertida em áudio TTS). Tom: persuasivo, direto, confiante, humano, sem exageros falsos. Estrutura SPIN obrigatória:
   - Situação (1 frase): contexto do comprador
   - Problema (1 frase): dor que o carro resolve
   - Implicação (1 frase): o que acontece se não agir
   - Necessidade/Solução (1-2 frases): o carro como solução + CTA para WhatsApp

2. Use gatilhos de venda com responsabilidade:
   - Clareza de benefício (economia, conforto, segurança, praticidade ou status)
   - Urgência ética (sem mentir ou inventar escassez)
   - Redução de risco (transmitir confiança e direção para ação)

3. Trate objeções comuns implicitamente (preço, consumo, manutenção, revenda), conectando com os atributos reais do veículo.

4. LEGENDAS: array de objetos com {texto, inicio_seg, fim_seg} — sincronizadas com a narração, máx 5 palavras por bloco.

5. TITULO: frase de impacto para a primeira tela (máx 6 palavras), linguagem comercial forte.

6. DESTAQUE: 3 bullets curtos do veículo (máx 4 palavras cada), sempre orientados a valor percebido.

Regras rígidas:
- Não inventar itens técnicos ou opcionais não informados nos dados.
- Não usar promessas irreais.
- Sempre encerrar com CTA objetivo para chamar no WhatsApp agora.

Responda APENAS em JSON válido, sem markdown, neste formato exato:
{
  "narracao": "texto completo da narração",
  "titulo": "frase de impacto",
  "destaque": ["bullet 1", "bullet 2", "bullet 3"],
  "legendas": [
    {"texto": "Está esperando", "inicio_seg": 0.0, "fim_seg": 1.2},
    {"texto": "o carro ideal?", "inicio_seg": 1.2, "fim_seg": 2.5}
  ]
}"""


async def generate_spin_copy(vehicle: dict) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY não configurada")

    dados = f"""
Marca: {vehicle.get('marca')}
Modelo: {vehicle.get('modelo')}
Ano: {vehicle.get('ano')}
Quilometragem: {vehicle.get('km', 'não informado')} km
Preço: R$ {vehicle.get('preco')}
Cor: {vehicle.get('cor', 'não informado')}
Combustível: {vehicle.get('combustivel', 'Flex')}
Transmissão: {vehicle.get('transmissao', 'Manual')}
Diferenciais: {vehicle.get('diferenciais', 'não informado')}
""".strip()

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}",
            headers={"content-type": "application/json"},
            json={
                "system_instruction": {
                    "parts": [{"text": SPIN_PROMPT}]
                },
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": f"Gere o copy para este veículo:\n\n{dados}"}],
                    }
                ],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 800,
                    "responseMimeType": "application/json",
                },
            },
        )
        res.raise_for_status()
        data = res.json()

    candidates = data.get("candidates", [])
    if not candidates:
        raise RuntimeError(f"Gemini sem resposta útil: {data}")

    parts = candidates[0].get("content", {}).get("parts", [])
    if not parts:
        raise RuntimeError(f"Gemini retornou resposta vazia: {data}")

    raw = parts[0].get("text", "").strip()
    if not raw:
        raise RuntimeError(f"Gemini retornou texto vazio: {data}")

    # Remove markdown se vier com ```json
    if raw.startswith("```"):
        raw = raw.split("```", maxsplit=2)[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)
