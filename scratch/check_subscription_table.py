import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Load from backend/.env
load_dotenv("c:\\auto-racer\\backend\\.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

print(f"Connecting to: {SUPABASE_URL}")
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# 1. Let's try to query the subscriptions table structure or some data
try:
    print("\n1. Querying subscriptions table:")
    res = supabase.table("subscriptions").select("*").limit(1).execute()
    print("Success! Data:", res.data)
except Exception as e:
    print("Error querying subscriptions:", e)

# 2. Let's try to query the pending_registrations table structure or some data
try:
    print("\n2. Querying pending_registrations table:")
    res = supabase.table("pending_registrations").select("*").limit(1).execute()
    print("Success! Data:", res.data)
except Exception as e:
    print("Error querying pending_registrations:", e)

# 3. Let's try to query the payment_transactions table structure or some data
try:
    print("\n3. Querying payment_transactions table:")
    res = supabase.table("payment_transactions").select("*").limit(1).execute()
    print("Success! Data:", res.data)
except Exception as e:
    print("Error querying payment_transactions:", e)
