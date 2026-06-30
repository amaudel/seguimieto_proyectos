-- Migración: Habilitar Gestión de Reuniones para Administradores
-- Fase 6E: RLS INSERT

drop policy if exists "Inserción de reuniones para administradores" on public.project_meetings;

create policy "Inserción de reuniones para administradores"
on public.project_meetings
for insert to authenticated
with check (public.is_admin());

drop policy if exists "Inserción de asistentes de reunión para administradores" on public.meeting_attendees;

create policy "Inserción de asistentes de reunión para administradores"
on public.meeting_attendees
for insert to authenticated
with check (public.is_admin());
