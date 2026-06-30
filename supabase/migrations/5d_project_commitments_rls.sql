-- Migración: Habilitar Inserción de Compromisos para Administradores
-- Fase 5D: RLS INSERT

drop policy if exists "Inserción de compromisos para administradores" on public.meeting_commitments;

create policy "Inserción de compromisos para administradores"
on public.meeting_commitments
for insert to authenticated
with check (public.is_admin());
