-- Migration: Configuración de Supabase Auth y Row Level Security (RLS)
-- Fase 4B: Alcance Simplificado para un único usuario Administrador

-- =======================================================
-- 1. Agregar columna de vinculación a profiles
-- =======================================================
alter table public.profiles 
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;

-- =======================================================
-- 2. Habilitación de Row Level Security (RLS) en todas las tablas
-- =======================================================
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_advances enable row level security;
alter table public.project_items enable row level security;
alter table public.project_meetings enable row level security;
alter table public.meeting_attendees enable row level security;
alter table public.meeting_commitments enable row level security;
alter table public.time_logs enable row level security;
alter table public.project_risks enable row level security;
alter table public.project_evidence enable row level security;
alter table public.audit_logs enable row level security;

-- =======================================================
-- 3. Función de Seguridad Helper (SECURITY DEFINER con search_path)
-- =======================================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.auth_user_id = auth.uid()
      and r.name = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public, auth;

-- =======================================================
-- 4. Definición de Políticas RLS para lectura (SELECT) - IDEMPOTENTES
-- =======================================================

-- Tabla: profiles
drop policy if exists "Lectura de perfiles para administradores o dueño" on public.profiles;
create policy "Lectura de perfiles para administradores o dueño" on public.profiles 
  for select to authenticated 
  using (public.is_admin() or auth_user_id = auth.uid());

-- Tabla: roles
drop policy if exists "Lectura de roles para administradores" on public.roles;
create policy "Lectura de roles para administradores" on public.roles 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: projects
drop policy if exists "Lectura de proyectos para administradores" on public.projects;
create policy "Lectura de proyectos para administradores" on public.projects 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: project_advances
drop policy if exists "Lectura de avances para administradores" on public.project_advances;
create policy "Lectura de avances para administradores" on public.project_advances 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: project_items
drop policy if exists "Lectura de actividades para administradores" on public.project_items;
create policy "Lectura de actividades para administradores" on public.project_items 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: project_meetings
drop policy if exists "Lectura de reuniones para administradores" on public.project_meetings;
create policy "Lectura de reuniones para administradores" on public.project_meetings 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: meeting_attendees
drop policy if exists "Lectura de asistentes para administradores" on public.meeting_attendees;
create policy "Lectura de asistentes para administradores" on public.meeting_attendees 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: meeting_commitments
drop policy if exists "Lectura de compromisos para administradores" on public.meeting_commitments;
create policy "Lectura de compromisos para administradores" on public.meeting_commitments 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: time_logs
drop policy if exists "Lectura de registros de tiempo para administradores" on public.time_logs;
create policy "Lectura de registros de tiempo para administradores" on public.time_logs 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: project_risks
drop policy if exists "Lectura de riesgos para administradores" on public.project_risks;
create policy "Lectura de riesgos para administradores" on public.project_risks 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: project_evidence
drop policy if exists "Lectura de evidencias para administradores" on public.project_evidence;
create policy "Lectura de evidencias para administradores" on public.project_evidence 
  for select to authenticated 
  using (public.is_admin());

-- Tabla: audit_logs
drop policy if exists "Lectura de logs de auditoría para administradores" on public.audit_logs;
create policy "Lectura de logs de auditoría para administradores" on public.audit_logs 
  for select to authenticated 
  using (public.is_admin());

-- =======================================================
-- 5. Consultas de Validación RLS y Esquema
-- =======================================================

-- A. Validar que la columna auth_user_id existe en profiles:
-- select column_name, data_type 
-- from information_schema.columns 
-- where table_schema = 'public' and table_name = 'profiles' and column_name = 'auth_user_id';

-- B. Validar estado de RLS en todas las tablas del esquema public:
-- select tablename, rowsecurity 
-- from pg_tables 
-- where schemaname = 'public' 
--   and tablename in ('roles', 'profiles', 'projects', 'project_advances', 'project_items', 'project_meetings', 'meeting_attendees', 'meeting_commitments', 'time_logs', 'project_risks', 'project_evidence', 'audit_logs');

-- C. Validar la vinculación correcta tras insertar el usuario Auth (debe retornar tu usuario con rol admin):
-- select p.email, p.first_name, p.last_name, r.name as role_name, p.auth_user_id
-- from public.profiles p
-- join public.roles r on r.id = p.role_id
-- where p.auth_user_id is not null;
