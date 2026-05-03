import os
import uuid
import stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class CheckoutRequest(BaseModel):
    email: str
    password: str
    store_name: str
    phone: str = ""
    owner_name: str = ""


@router.post("/create-checkout")
async def create_checkout(data: CheckoutRequest, request: Request):
    """
    1. Salva os dados do registro como pendente
    2. Cria um checkout no Stripe (R$69,90)
    3. Retorna a URL de pagamento para redirecionar o usuario
    """
    reference_id = f"AUTORACER-{uuid.uuid4().hex[:12].upper()}"

    try:
        pending = supabase.table("pending_registrations").insert({
            "email": data.email,
            "password_hash": data.password,
            "store_name": data.store_name,
            "phone": data.phone,
            "owner_name": data.owner_name,
            "reference_id": reference_id,
            "status": "PENDING"
        }).execute()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao salvar registro: {str(e)}")

    try:
        origin = request.headers.get("origin", "http://localhost:3007")
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': 'Auto Racer — Plano Parceiro (1º mês)',
                    },
                    'unit_amount': 6990,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{origin}/cadastro-sucesso?ref={reference_id}",
            cancel_url=f"{origin}/cadastro",
            client_reference_id=reference_id,
            customer_email=data.email
        )

        supabase.table("pending_registrations").update({
            "pagbank_checkout_id": session.id
        }).eq("reference_id", reference_id).execute()

        return {
            "checkout_id": session.id,
            "payment_url": session.url,
            "reference_id": reference_id
        }

    except stripe.StripeError as e:
        raise HTTPException(status_code=502, detail=f"Erro ao criar checkout no Stripe: {str(e)}")


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Webhook chamado pelo Stripe quando o pagamento é confirmado.
    Cria a conta do usuario e a loja automaticamente.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        reference_id = session.get('client_reference_id')
        order_id = session.get('id')
        charge_id = session.get('payment_intent', "")

        # Log da transação
        supabase.table("payment_transactions").insert({
            "reference_id": reference_id,
            "pagbank_order_id": order_id,
            "pagbank_charge_id": charge_id,
            "type": "STRIPE_CHECKOUT",
            "status": "PAID",
            "amount": 6990,
            "raw_payload": session
        }).execute()

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
        import re
        base_slug = re.sub(r'[^a-z0-9]+', '-', reg["store_name"].lower()).strip('-')
        slug = base_slug
        
        existing_slug = supabase.table("stores").select("id").eq("slug", slug).execute()
        if existing_slug.data:
            slug = f"{base_slug}-{user_id[:6]}"

        store_result = supabase.table("stores").insert({
            "name": reg["store_name"],
            "slug": slug,
            "phone": reg.get("phone", ""),
            "plan": "parceiro",
            "active": True
        }).execute()

        store_id = store_result.data[0]["id"]

        # Vincular usuario à loja
        supabase.table("store_users").insert({
            "store_id": store_id,
            "user_id": user_id,
            "role": "owner",
            "email": reg["email"]
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

    return {"status": "success"}

@router.get("/check-status/{reference_id}")
async def check_payment_status(reference_id: str):
    """
    Verifica se o pagamento de um registro pendente foi confirmado.
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
