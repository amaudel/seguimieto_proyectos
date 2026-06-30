-- Migración: Asegurar Columnas de Bitácora de Avances
-- Fase 5B: Gobernanza de Avances

alter table public.project_advances
  add column if not exists next_steps text,
  add column if not exists notes text;
