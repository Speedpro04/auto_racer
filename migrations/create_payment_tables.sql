-- =============================================
-- AUTO RACER - Tabelas de Pagamento (PagBank)
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Registros pendentes de pagamento (antes de criar a conta)
CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  store_name TEXT NOT NULL,
  phone TEXT,
  owner_name TEXT,
  reference_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'EXPIRED', 'CANCELLED')),
  pagbank_checkout_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 2. Assinaturas ativas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID,
  plan TEXT DEFAULT 'parceiro' CHECK (plan IN ('parceiro', 'exclusivo')),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED')),
  amount INTEGER DEFAULT 6990,
  currency TEXT DEFAULT 'BRL',
  pagbank_order_id TEXT,
  pagbank_charge_id TEXT,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Log de transações
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  pagbank_order_id TEXT,
  pagbank_charge_id TEXT,
  type TEXT CHECK (type IN ('CHECKOUT', 'SUBSCRIPTION_RENEWAL', 'REFUND')),
  status TEXT,
  amount INTEGER,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Índices para performance
CREATE INDEX IF NOT EXISTS idx_pending_reg_reference ON public.pending_registrations(reference_id);
CREATE INDEX IF NOT EXISTS idx_pending_reg_status ON public.pending_registrations(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_store ON public.subscriptions(store_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_ref ON public.payment_transactions(reference_id);
