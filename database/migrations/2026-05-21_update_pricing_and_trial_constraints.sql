-- =============================================
-- AUTO RACER - Update Pricing & Trial Constraints
-- Execute no SQL Editor do Supabase
-- =============================================

-- 1. Alter status check constraint on subscriptions table
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_status_check CHECK (status IN ('ACTIVE', 'TRIALING', 'CANCELLED', 'EXPIRED', 'SUSPENDED'));

-- 2. Alter amount default on subscriptions table to 8900 (R$ 89,00)
ALTER TABLE public.subscriptions ALTER COLUMN amount SET DEFAULT 8900;

-- 3. Alter type check constraint on payment_transactions table
ALTER TABLE public.payment_transactions DROP CONSTRAINT IF EXISTS payment_transactions_type_check;
ALTER TABLE public.payment_transactions ADD CONSTRAINT payment_transactions_type_check CHECK (type IN ('CHECKOUT', 'STRIPE_CHECKOUT', 'SUBSCRIPTION_RENEWAL', 'REFUND'));
