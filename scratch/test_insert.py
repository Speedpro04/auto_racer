import os
import uuid
from supabase import create_client
from dotenv import load_dotenv

load_dotenv("c:\\auto-racer\\backend\\.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# 1. Let's try to insert a subscription with status TRIALING
try:
    print("Testing subscription status 'TRIALING'...")
    # First we need a dummy store_id or we can insert without it if it allows null, or we can fetch a store or create one.
    # Let's see if stores has any row or if we can insert a dummy store
    store_ref = supabase.table("stores").insert({
        "slug": f"test-store-{uuid.uuid4().hex[:6]}",
        "name": "Test Store",
        "phone": "123456",
        "active": True
    }).execute()
    
    store_id = store_ref.data[0]["id"]
    print(f"Created test store: {store_id}")
    
    sub_ref = supabase.table("subscriptions").insert({
        "store_id": store_id,
        "plan": "parceiro",
        "status": "TRIALING",
        "amount": 8900
    }).execute()
    print("SUCCESS: Subscription with status 'TRIALING' inserted successfully!", sub_ref.data)
    
    # Let's clean it up
    supabase.table("subscriptions").delete().eq("id", sub_ref.data[0]["id"]).execute()
    
except Exception as e:
    print("FAILED subscription insert:", e)

# 2. Let's try to insert a transaction with type 'STRIPE_CHECKOUT'
try:
    print("\nTesting transaction type 'STRIPE_CHECKOUT'...")
    tx_ref = supabase.table("payment_transactions").insert({
        "reference_id": "TEST-REF-123",
        "type": "STRIPE_CHECKOUT",
        "status": "TRIAL",
        "amount": 8900
    }).execute()
    print("SUCCESS: Transaction with type 'STRIPE_CHECKOUT' inserted successfully!", tx_ref.data)
    
    # Clean up
    supabase.table("payment_transactions").delete().eq("id", tx_ref.data[0]["id"]).execute()
    
except Exception as e:
    print("FAILED transaction insert:", e)

# Clean up store
try:
    if 'store_id' in locals():
        supabase.table("stores").delete().eq("id", store_id).execute()
        print("Cleaned up test store.")
except Exception as e:
    print("Error cleaning up store:", e)
