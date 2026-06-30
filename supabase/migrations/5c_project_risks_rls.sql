-- Migración: Habilitar Inserción de Riesgos para Administradores
-- Fase 5C: RLS INSERT

drop policy if exists "Inserción de riesgos para administradores" on public.project_risks;

create policy "Inserción de riesgos para administradores"
on public.project_risks
for insert to authenticated
with check (public.is_admin());
