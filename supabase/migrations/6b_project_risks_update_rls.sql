-- Migración: Habilitar Actualización de Riesgos para Administradores
-- Fase 6B: RLS UPDATE

drop policy if exists "Actualización de riesgos para administradores" on public.project_risks;

create policy "Actualización de riesgos para administradores"
on public.project_risks
for update to authenticated
using (public.is_admin())
with check (public.is_admin());
