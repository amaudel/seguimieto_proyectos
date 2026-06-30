-- Migración: Habilitar Registro de Tiempos para Administradores
-- Fase 6D: RLS INSERT

drop policy if exists "Inserción de logs de tiempo para administradores" on public.time_logs;

create policy "Inserción de logs de tiempo para administradores"
on public.time_logs
for insert to authenticated
with check (public.is_admin());
