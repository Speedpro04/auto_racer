-- ============================================
-- CONFIGURAÇÃO DE EMAIL E TRIAL - AUTO RACER
-- Email: autoracershop@gmail.com
-- ============================================

-- 1. Tabela de configuração de email
CREATE TABLE IF NOT EXISTS email_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_email TEXT DEFAULT 'autoracershop@gmail.com',
  sender_name TEXT DEFAULT 'Auto Racer',
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INTEGER DEFAULT 587,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO email_configurations (sender_email, sender_name) 
VALUES ('autoracershop@gmail.com', 'Auto Racer')
ON CONFLICT DO NOTHING;

-- 2. Tabela de trials (15 dias)
CREATE TABLE IF NOT EXISTS trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted', 'cancelled')),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  payment_method_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de logs de envio de email
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES store_users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'trial_boas_vindas',
    'trial_lembrete_5_dias',
    'trial_lembrete_2_dias',
    'trial_ultimo_dia',
    'trial_expirado',
    'cobranca_realizada',
    'cobranca_falhou_2_dias',
    'cobranca_falhou_5_dias',
    'cobranca_falhou_10_dias',
    'cobranca_falhou_15_dias',
    'cobranca_falhou_20_dias',
    'servico_suspenso'
  )),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de lembretes de trial
CREATE TABLE IF NOT EXISTS trial_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_id UUID REFERENCES trials(id) ON DELETE CASCADE,
  reminder_day INTEGER NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de cobranças (mensalidade)
CREATE TABLE IF NOT EXISTS billing_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  trial_id UUID REFERENCES trials(id) ON DELETE CASCADE,
  cycle_start TIMESTAMPTZ NOT NULL,
  cycle_end TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  amount NUMERIC(10,2) DEFAULT 69.90,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  stripe_invoice_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de logs de cobrança
CREATE TABLE IF NOT EXISTS billing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_cycle_id UUID REFERENCES billing_cycles(id) ON DELETE CASCADE,
  log_type TEXT NOT NULL CHECK (log_type IN (
    'cobranca_enviada',
    'cobranca_paga',
    'cobranca_falhou',
    'lembrete_2_dias',
    'lembrete_5_dias',
    'lembrete_10_dias',
    'lembrete_15_dias',
    'lembrete_20_dias',
    'servico_suspenso'
  )),
  log_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Index para performance
CREATE INDEX IF NOT EXISTS idx_trials_ends_at ON trials(ends_at);
CREATE INDEX IF NOT EXISTS idx_trials_status ON trials(status);
CREATE INDEX IF NOT EXISTS idx_billing_due_date ON billing_cycles(due_date);
CREATE INDEX IF NOT EXISTS idx_billing_status ON billing_cycles(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_store ON email_logs(store_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);

-- 8. View: Trials ativos
CREATE OR REPLACE VIEW active_trials AS
SELECT t.*, s.name as store_name, s.slug as store_slug, 
       u.email as user_email, u.name as user_name
FROM trials t
JOIN stores s ON t.store_id = s.id
JOIN store_users u ON t.user_id = u.id
WHERE t.status = 'active';

-- 9. View: Cobranças pendentes
CREATE OR REPLACE VIEW pending_billing AS
SELECT b.*, s.name as store_name, s.slug as store_slug
FROM billing_cycles b
JOIN stores s ON b.store_id = s.id
WHERE b.status IN ('pending', 'failed');

-- 10. Grants de segurança
ALTER TABLE email_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admins podem ver tudo
CREATE POLICY "Admins podem ver email_configurations" ON email_configurations FOR ALL USING (true);
CREATE POLICY "Admins podem ver trials" ON trials FOR ALL USING (true);
CREATE POLICY "Admins podem ver email_logs" ON email_logs FOR ALL USING (true);
CREATE POLICY "Admins podem ver trial_reminders" ON trial_reminders FOR ALL USING (true);
CREATE POLICY "Admins podem ver billing_cycles" ON billing_cycles FOR ALL USING (true);
CREATE POLICY "Admins podem ver billing_logs" ON billing_logs FOR ALL USING (true);
