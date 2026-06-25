-- Esquema físico para Supabase PostgreSQL - Seguimiento de Proyectos Cooperativa

-- Habilitar extensión pgcrypto para generación de UUIDs si no está habilitada
create extension if not exists "pgcrypto";

-- 1. Tabla de Roles (Catálogo)
create table roles (
    id uuid primary key default gen_random_uuid(),
    name text unique not null check (name in ('admin', 'leader', 'viewer')),
    description text,
    created_at timestamp with time zone default now()
);

-- 2. Tabla de Perfiles de Usuario (Vinculada a auth.users de Supabase)
create table profiles (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    first_name text not null,
    last_name text not null,
    role_id uuid references roles(id),
    created_at timestamp with time zone default now()
);

-- 3. Tabla de Proyectos (Datos Maestros)
create table projects (
    id uuid primary key default gen_random_uuid(),
    project_code text unique not null,
    name text not null,
    description text,
    estimated_effort_hours integer not null check (estimated_effort_hours >= 0),
    status text not null check (status in ('Borrador', 'En curso', 'En revisión', 'Pausado', 'Con retraso', 'Cerrado', 'Cancelado')),
    leader_id uuid references profiles(id),
    sponsor text not null,
    responsible_func text not null,
    responsible_exec text not null,
    area_solicitante text not null,
    start_date date not null,
    end_date date not null check (end_date >= start_date),
    objective text not null,
    scope text not null,
    expected_result text not null,
    execution_style text not null check (execution_style in ('Cascada', 'Ágil', 'Híbrido')),
    
    -- Eliminación lógica
    is_deleted boolean default false not null,
    deleted_at timestamp with time zone,
    deleted_by uuid references profiles(id),
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 4. Tabla de Avances (Bitácora)
create table project_advances (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    date date not null,
    progress_pct integer not null check (progress_pct between 0 and 100),
    summary text not null,
    completed_tasks text,
    value_delivered text,
    reporter_id uuid references profiles(id),
    next_steps text,
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 5. Tabla de Actividades / Backlog (Kanban)
create table project_items (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    name text not null,
    description text,
    type text,
    assignee_id uuid references profiles(id),
    priority text not null check (priority in ('Baja', 'Media', 'Alta', 'Crítica')),
    kanban_status text not null check (kanban_status in ('Por hacer', 'En progreso', 'Bloqueado', 'En revisión', 'Terminado')),
    start_date date,
    due_date date,
    end_date date,
    estimated_hours integer not null check (estimated_hours >= 0),
    actual_hours integer default 0 check (actual_hours >= 0),
    progress_pct integer default 0 check (progress_pct between 0 and 100),
    acceptance_criteria text,
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 6. Tabla de Reuniones / Comités
create table project_meetings (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    date_time timestamp with time zone not null,
    type text not null check (type in ('Seguimiento ejecutivo', 'Comité', 'Técnica', 'Funcional', 'Daily', 'Planning', 'Review / Demo', 'Retrospectiva', 'Cierre')),
    topics text not null,
    decisions text,
    agreements text,
    impediments text,
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 7. Tabla Intermedia de Asistentes a Reuniones
create table meeting_attendees (
    meeting_id uuid references project_meetings(id) on delete cascade,
    profile_id uuid references profiles(id) on delete cascade,
    primary key (meeting_id, profile_id)
);

-- 8. Tabla de Compromisos (derivados de reuniones o proyectos)
create table meeting_commitments (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    meeting_id uuid references project_meetings(id) on delete cascade, -- Nullable si se genera directo
    description text not null,
    assignee_id uuid references profiles(id),
    due_date date not null,
    status text not null check (status in ('Pendiente', 'En proceso', 'Cumplido', 'Vencido')),
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 9. Tabla de Registro de Horas de Trabajo (Tiempos)
create table time_logs (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    activity_id uuid references project_items(id) on delete cascade not null,
    date date not null,
    user_id uuid references profiles(id) not null,
    description text not null,
    type text not null,
    actual_hours integer not null check (actual_hours > 0),
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 10. Tabla de Riesgos, Bloqueos e Impedimentos
create table project_risks (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    type text not null check (type in ('Riesgo', 'Bloqueo', 'Dependencia', 'Incidencia', 'Impedimento')),
    description text not null,
    impact text not null check (impact in ('Bajo', 'Medio', 'Alto')),
    probability text not null check (probability in ('Baja', 'Media', 'Alta')),
    assignee_id uuid references profiles(id),
    date_identified date not null,
    resolution_date date,
    status text not null check (status in ('Abierto', 'En tratamiento', 'Mitigado', 'Cerrado')),
    mitigation_action text,
    notes text,
    
    -- Auditoría
    created_at timestamp with time zone default now(),
    created_by uuid references profiles(id),
    updated_at timestamp with time zone default now(),
    updated_by uuid references profiles(id)
);

-- 11. Tabla de Evidencias Centralizada (Con Restricción Check Mutuamente Excluyente)
create table project_evidence (
    id uuid primary key default gen_random_uuid(),
    project_id uuid references projects(id) on delete restrict not null,
    file_name text not null,
    file_url text not null,
    
    -- Llaves foráneas a las entidades que pueden tener evidencias
    advance_id uuid references project_advances(id) on delete cascade,
    activity_id uuid references project_items(id) on delete cascade,
    meeting_id uuid references project_meetings(id) on delete cascade,
    commitment_id uuid references meeting_commitments(id) on delete cascade,
    risk_id uuid references project_risks(id) on delete cascade,
    
    uploaded_by uuid references profiles(id),
    uploaded_at timestamp with time zone default now(),
    
    -- Restricción check para asegurar asociación única por registro
    constraint check_only_one_parent check (
        (
            (advance_id is not null)::integer +
            (activity_id is not null)::integer +
            (meeting_id is not null)::integer +
            (commitment_id is not null)::integer +
            (risk_id is not null)::integer
        ) = 1
    )
);

-- 12. Tabla de Auditoría Básica (Cambios de estado)
create table audit_logs (
    id uuid primary key default gen_random_uuid(),
    entity_type text not null,
    entity_id uuid not null,
    action text not null,
    old_values jsonb,
    new_values jsonb,
    performed_by uuid references profiles(id),
    performed_at timestamp with time zone default now()
);

-- Triggers y Funciones de Auditoría Automática para updated_at

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at before update on projects for each row execute procedure update_updated_at_column();
create trigger update_project_advances_updated_at before update on project_advances for each row execute procedure update_updated_at_column();
create trigger update_project_items_updated_at before update on project_items for each row execute procedure update_updated_at_column();
create trigger update_project_meetings_updated_at before update on project_meetings for each row execute procedure update_updated_at_column();
create trigger update_meeting_commitments_updated_at before update on meeting_commitments for each row execute procedure update_updated_at_column();
create trigger update_time_logs_updated_at before update on time_logs for each row execute procedure update_updated_at_column();
create trigger update_project_risks_updated_at before update on project_risks for each row execute procedure update_updated_at_column();

-- Índices básicos para optimización de consultas
create index idx_projects_code on projects(project_code);
create index idx_project_advances_project_id on project_advances(project_id);
create index idx_project_items_project_id on project_items(project_id);
create index idx_project_meetings_project_id on project_meetings(project_id);
create index idx_meeting_commitments_project_id on meeting_commitments(project_id);
create index idx_time_logs_project_id on time_logs(project_id);
create index idx_project_risks_project_id on project_risks(project_id);
create index idx_project_evidence_project_id on project_evidence(project_id);
