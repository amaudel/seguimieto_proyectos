-- Migración: Incorporar Columnas de Caso de Negocio e Iniciales a Projects
-- Fase 5A: Estructura Formal del Formulario Wizard

-- 1. Agregar las nuevas columnas a la tabla projects
alter table public.projects 
  add column if not exists priority text default 'Media' check (priority in ('Alta', 'Media', 'Baja')),
  add column if not exists problem_opportunity text,
  add column if not exists justification text,
  add column if not exists strategic_alignment text,
  add column if not exists expected_benefits text,
  add column if not exists risk_of_not_doing text,
  add column if not exists initial_phase text default 'Iniciación' check (initial_phase in ('Iniciación', 'Planificación', 'Ejecución', 'Seguimiento', 'Cierre')),
  add column if not exists initial_health text default 'Sin alertas' check (initial_health in ('Sin alertas', 'Con alertas', 'Crítica')),
  add column if not exists bpmo_observations text;

-- 2. Habilitar la política RLS para inserción segura de proyectos
drop policy if exists "Inserción de proyectos para administradores" on public.projects;
create policy "Inserción de proyectos para administradores" on public.projects
  for insert to authenticated
  with check (public.is_admin());
