-- =============================================
-- AUTO RACER - Adicionar colunas de assinatura
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Adicionar colunas de controle de expiração na tabela stores
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

-- 2. Expandir o CHECK de plan para incluir 'parceiro' e 'exclusivo'
-- Primeiro remover o constraint antigo (se existir)
ALTER TABLE public.stores DROP CONSTRAINT IF EXISTS stores_plan_check;
ALTER TABLE public.stores ADD CONSTRAINT stores_plan_check
  CHECK (plan IN ('basic', 'pro', 'premium', 'parceiro', 'exclusivo'));

-- 3. Corrigir o CHECK de type em payment_transactions para incluir STRIPE_CHECKOUT
ALTER TABLE public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_type_check;
ALTER TABLE public.payment_transactions ADD CONSTRAINT payment_transactions_type_check
  CHECK (type IN ('CHECKOUT', 'STRIPE_CHECKOUT', 'SUBSCRIPTION_RENEWAL', 'REFUND'));

-- 4. Criar bucket de storage (executar via API do Supabase ou Dashboard)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('autoracer_media', 'autoracer_media', true)
-- ON CONFLICT (id) DO NOTHING;
