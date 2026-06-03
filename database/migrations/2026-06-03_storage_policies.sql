-- ============================================
-- AUTO RACER — Policies de Storage (bucket autoracer_media)
-- Data: 2026-06-03
-- Permite que o lojista autenticado gerencie arquivos APENAS da pasta
-- da própria loja ({store_id}/...). Leitura pública. Limites de upload.
-- ============================================

-- Leitura pública do bucket
create policy "autoracer_public_read" on storage.objects
  for select using (bucket_id = 'autoracer_media');

-- Inserção: só na pasta da própria loja
create policy "autoracer_store_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'autoracer_media'
    and (storage.foldername(name))[1] in (
      select store_id::text from public.store_users where id = (select auth.uid())
    )
  );

-- Atualização (upsert do logo): só na pasta da própria loja
create policy "autoracer_store_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'autoracer_media'
    and (storage.foldername(name))[1] in (
      select store_id::text from public.store_users where id = (select auth.uid())
    )
  );

-- Remoção: só na pasta da própria loja
create policy "autoracer_store_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'autoracer_media'
    and (storage.foldername(name))[1] in (
      select store_id::text from public.store_users where id = (select auth.uid())
    )
  );

-- Limites do bucket: 50MB e apenas imagens/vídeos
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/quicktime']
where id = 'autoracer_media';
