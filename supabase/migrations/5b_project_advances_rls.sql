-- Migración: Habilitar Inserción de Avances para Administradores
-- Fase 5B: RLS INSERT

drop policy if exists "Inserción de avances para administradores" on public.project_advances;

create policy "Inserción de avances para administradores"
on public.project_advances
for insert
to authenticated
with check (public.is_admin());
