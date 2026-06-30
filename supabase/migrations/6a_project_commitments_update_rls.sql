-- Migración: Habilitar Actualización de Compromisos para Administradores
-- Fase 6A: RLS UPDATE

drop policy if exists "Actualización de compromisos para administradores" on public.meeting_commitments;

create policy "Actualización de compromisos para administradores"
on public.meeting_commitments
for update to authenticated
using (public.is_admin())
with check (public.is_admin());
