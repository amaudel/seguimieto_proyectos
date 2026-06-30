export type EntityId = string | number;

export type UserRole = 'admin' | 'leader' | 'viewer';

export interface User {
  id: EntityId;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export type ProjectStatus = 'Borrador' | 'En curso' | 'En revisión' | 'Pausado' | 'Con retraso' | 'Cerrado' | 'Cancelado';
export type ExecutionStyle = 'Cascada' | 'Ágil' | 'Híbrido';

export interface Project {
  id: EntityId;
  code: string;
  name: string;
  description: string;
  estimatedEffortHours: number; // Reemplazó a budget
  status: ProjectStatus;
  leader_id: EntityId;
  leader_name: string;
  sponsor: string;
  responsible_func: string;
  responsible_exec: string;
  area_solicitante: string;
  start_date: string;
  end_date: string;
  objective: string;
  scope: string;
  expected_result: string;
  execution_style: ExecutionStyle;
  
  // Nuevas columnas de la Fase 5A (Caso de Negocio)
  priority?: 'Alta' | 'Media' | 'Baja';
  problem_opportunity?: string;
  justification?: string;
  strategic_alignment?: string;
  expected_benefits?: string;
  risk_of_not_doing?: string;
  initial_phase?: string;
  initial_health?: 'Sin alertas' | 'Con alertas' | 'Crítica';
  bpmo_observations?: string;
}

export interface ProjectAdvance {
  id: EntityId;
  project_id: EntityId;
  date: string;
  progress_pct: number;
  summary: string;
  completed_tasks: string;
  value_delivered: string;
  evidence: string;
  reporter: string;
  next_steps: string;
  notes: string;
}

export type KanbanStatus = 'Por hacer' | 'En progreso' | 'Bloqueado' | 'En revisión' | 'Terminado';
export type ActivityPriority = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export interface ProjectActivity {
  id: EntityId;
  project_id: EntityId;
  name: string;
  description: string;
  type: string;
  assignee: string;
  priority: ActivityPriority;
  kanban_status: KanbanStatus;
  start_date: string;
  due_date: string;
  end_date?: string;
  estimated_hours: number;
  actual_hours: number;
  progress_pct: number;
  acceptance_criteria: string;
  notes: string;
}

export type MeetingType = 'Seguimiento ejecutivo' | 'Comité' | 'Técnica' | 'Funcional' | 'Daily' | 'Planning' | 'Review / Demo' | 'Retrospectiva' | 'Cierre';

export interface ProjectMeeting {
  id: EntityId;
  project_id: EntityId;
  date_time: string;
  type: MeetingType;
  attendees: string[];
  topics: string;
  decisions: string;
  agreements: string;
  impediments: string;
  notes: string;
}

export type CommitmentStatus = 'Pendiente' | 'En proceso' | 'Cumplido' | 'Vencido';

export interface ProjectCommitment {
  id: EntityId;
  project_id: EntityId;
  meeting_id: EntityId | null;
  description: string;
  assignee: string;
  assignee_id?: string;
  due_date: string;
  status: CommitmentStatus;
  evidence: string;
  notes: string;
}

export interface TimeLog {
  id: EntityId;
  project_id: EntityId;
  activity_id: EntityId;
  activity_name: string;
  date: string;
  user: string;
  description: string;
  type: string;
  estimated_hours: number;
  actual_hours: number;
  notes: string;
}

export type RiskImpact = 'Bajo' | 'Medio' | 'Alto';
export type RiskProbability = 'Baja' | 'Media' | 'Alta';
export type RiskType = 'Riesgo' | 'Bloqueo' | 'Dependencia' | 'Incidencia' | 'Impedimento';
export type RiskStatus = 'Abierto' | 'En tratamiento' | 'Mitigado' | 'Cerrado';

export interface ProjectRisk {
  id: EntityId;
  project_id: EntityId;
  type: RiskType;
  description: string;
  impact: RiskImpact;
  probability: RiskProbability;
  assignee: string;
  date_identified: string;
  resolution_date?: string;
  status: RiskStatus;
  mitigation_action: string;
  notes: string;
}
