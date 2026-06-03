-- ============================================
-- AUTO RACER — Hardening de Segurança + correções de default
-- Data: 2026-06-03
-- Aplicada no projeto Supabase auto-racer (xdgiuozkumguhcsshugr).
-- ============================================
begin;

-- 1) Remove políticas "USING(true)" que expunham PII/cobrança ao público.
--    (O backend usa service_key e continua funcionando — service role ignora RLS.)
drop policy if exists "Admins podem ver billing_cycles"        on public.billing_cycles;
drop policy if exists "Admins podem ver billing_logs"          on public.billing_logs;
drop policy if exists "Admins podem ver email_configurations"  on public.email_configurations;
drop policy if exists "Admins podem ver email_logs"            on public.email_logs;
drop policy if exists "Admins podem ver trial_reminders"       on public.trial_reminders;
drop policy if exists "Admins podem ver trials"                on public.trials;

-- 2) Views deixam de rodar como "dono" (corrige UNRESTRICTED / nível ERRO).
alter view public.active_trials  set (security_invoker = on);
alter view public.pending_billing set (security_invoker = on);

-- 3) Políticas faltantes para a vitrine pública (analytics) e leitura por loja.
create policy "public_insert_views"    on public.vehicle_views    for insert with check (true);
create policy "public_insert_contacts" on public.vehicle_contacts for insert with check (true);
create policy "public_insert_leads"    on public.leads            for insert with check (true);

create policy "store_select_views" on public.vehicle_views for select
  using (store_id in (select store_id from public.store_users where id = (select auth.uid())));
create policy "store_select_contacts" on public.vehicle_contacts for select
  using (store_id in (select store_id from public.store_users where id = (select auth.uid())));
create policy "store_select_leads" on public.leads for select
  using (store_id in (select store_id from public.store_users where id = (select auth.uid())));

-- 4) Corrige defaults desalinhados com o sistema (trial 15 dias, plano R$89).
alter table public.stores         alter column trial_ends_at set default (now() + interval '15 days');
alter table public.billing_cycles alter column amount        set default 89.00;

commit;
