import os
import uuid
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
PAGBANK_TOKEN = os.getenv("PAGBANK_TOKEN")
PAGBANK_API_URL = os.getenv("PAGBANK_API_URL", "https://sandbox.api.pagseguro.com")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class CheckoutRequest(BaseModel):
    email: str
    password: str
    store_name: str
    phone: str = ""
    owner_name: str = ""


@router.post("/create-checkout")
async def create_checkout(data: CheckoutRequest):
    """
    1. Salva os dados do registro como pendente
    2. Cria um checkout no PagBank (R$69,90)
    3. Retorna a URL de pagamento para redirecionar o usuario
    """
    reference_id = f"AUTORACER-{uuid.uuid4().hex[:12].upper()}"

    # Salvar registro pendente no Supabase
    try:
        pending = supabase.table("pending_registrations").insert({
            "email": data.email,
            "password_hash": data.password,  # Backend auth route will hash it
            "store_name": data.store_name,
            "phone": data.phone,
            "owner_name": data.owner_name,
            "reference_id": reference_id,
            "status": "PENDING"
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao salvar registro: {str(e)}")

    # Criar checkout no PagBank
    checkout_payload = {
        "reference_id": reference_id,
        "customer": {
            "name": data.owner_name or data.store_name,
            "email": data.email,
            "phones": [{
                "country": "55",
                "area": data.phone[:2] if len(data.phone) >= 2 else "11",
                "number": data.phone[2:].replace("-", "").replace(" ", "") if len(data.phone) > 2 else "999999999",
                "type": "MOBILE"
            }]
        },
        "items": [{
            "reference_id": "plano-parceiro",
            "name": "Auto Racer — Plano Parceiro (1º mês)",
            "quantity": 1,
            "unit_amount": 6990  # R$69,90 em centavos
        }],
        "redirect_urls": {
            "return_url": f"http://localhost:3005/cadastro-sucesso?ref={reference_id}",
        },
        "notification_urls": [
            "http://localhost:8000/api/v1/payments/webhook"
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{PAGBANK_API_URL}/checkouts",
                json=checkout_payload,
                headers={
                    "Authorization": f"Bearer {PAGBANK_TOKEN}",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                timeout=30.0
            )

        if response.status_code not in [200, 201]:
            print(f"PagBank error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=502,
                detail=f"Erro ao criar checkout no PagBank: {response.text}"
            )

        pagbank_data = response.json()

        # Extrair URL de pagamento
        payment_url = None
        for link in pagbank_data.get("links", []):
            if link.get("rel") == "PAY":
                payment_url = link.get("href")
                break

        if not payment_url:
            payment_url = pagbank_data.get("payment_url") or pagbank_data.get("url")

        # Atualizar registro pendente com o ID do checkout
        checkout_id = pagbank_data.get("id", "")
        supabase.table("pending_registrations").update({
            "pagbank_checkout_id": checkout_id
        }).eq("reference_id", reference_id).execute()

        return {
            "checkout_id": checkout_id,
            "payment_url": payment_url,
            "reference_id": reference_id
        }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Erro de conexão com PagBank: {str(e)}")


@router.post("/webhook")
async def pagbank_webhook(payload: dict):
    """
    Webhook chamado pelo PagBank quando o pagamento é confirmado.
    Cria a conta do usuario e a loja automaticamente.
    """
    try:
        # Log da transação
        reference_id = None
        charges = payload.get("charges", [])
        order_id = payload.get("id", "")

        # Tentar extrair reference_id
        reference_id = payload.get("reference_id")
        if not reference_id and charges:
            reference_id = charges[0].get("reference_id")

        charge_status = "UNKNOWN"
        charge_id = ""
        if charges:
            charge_status = charges[0].get("status", "UNKNOWN")
            charge_id = charges[0].get("id", "")

        # Salvar log da transação
        supabase.table("payment_transactions").insert({
            "reference_id": reference_id,
            "pagbank_order_id": order_id,
            "pagbank_charge_id": charge_id,
            "type": "CHECKOUT",
            "status": charge_status,
            "amount": 6990,
            "raw_payload": payload
        }).execute()

        # Se pagamento confirmado, criar a conta
        if charge_status in ["PAID", "AVAILABLE"]:
            # Buscar registro pendente
            pending = supabase.table("pending_registrations")\
                .select("*")\
                .eq("reference_id", reference_id)\
                .eq("status", "PENDING")\
                .execute()

            if not pending.data:
                return {"status": "ok", "message": "Registro não encontrado ou já processado"}

            reg = pending.data[0]

            # Criar usuário no Supabase Auth
            auth_response = supabase.auth.admin.create_user({
                "email": reg["email"],
                "password": reg["password_hash"],
                "email_confirm": True
            })

            user_id = auth_response.user.id

            # Criar loja
            slug = reg["store_name"].lower().replace(" ", "-").replace(".", "")
            store_result = supabase.table("stores").insert({
                "name": reg["store_name"],
                "slug": slug,
                "phone": reg.get("phone", ""),
                "status": "active"
            }).execute()

            store_id = store_result.data[0]["id"]

            # Vincular usuario à loja
            supabase.table("store_users").insert({
                "store_id": store_id,
                "user_id": user_id,
                "role": "owner"
            }).execute()

            # Criar assinatura
            supabase.table("subscriptions").insert({
                "store_id": store_id,
                "user_id": user_id,
                "plan": "parceiro",
                "status": "ACTIVE",
                "amount": 6990,
                "pagbank_order_id": order_id,
                "pagbank_charge_id": charge_id
            }).execute()

            # Atualizar registro pendente
            supabase.table("pending_registrations").update({
                "status": "PAID"
            }).eq("reference_id", reference_id).execute()

            return {"status": "ok", "message": "Conta criada com sucesso"}

        return {"status": "ok", "message": f"Status recebido: {charge_status}"}

    except Exception as e:
        print(f"Webhook error: {str(e)}")
        # Não retornar erro 500 para o PagBank não reenviar
        return {"status": "error", "message": str(e)}


@router.get("/check-status/{reference_id}")
async def check_payment_status(reference_id: str):
    """
    Verifica se o pagamento de um registro pendente foi confirmado.
    Usado pelo frontend para polling após retorno do PagBank.
    """
    result = supabase.table("pending_registrations")\
        .select("status, email, store_name")\
        .eq("reference_id", reference_id)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Registro não encontrado")

    reg = result.data[0]
    return {
        "status": reg["status"],
        "email": reg["email"],
        "store_name": reg["store_name"],
        "is_paid": reg["status"] == "PAID"
    }
