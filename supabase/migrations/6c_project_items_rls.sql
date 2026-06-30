-- Migración: Habilitar Gestión de Actividades para Administradores
-- Fase 6C: RLS INSERT y UPDATE

drop policy if exists "Inserción de actividades para administradores" on public.project_items;

create policy "Inserción de actividades para administradores"
on public.project_items
for insert to authenticated
with check (public.is_admin());

drop policy if exists "Actualización de actividades para administradores" on public.project_items;

create policy "Actualización de actividades para administradores"
on public.project_items
for update to authenticated
using (public.is_admin())
with check (public.is_admin());
