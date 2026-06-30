import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { 
  Project, 
  ProjectAdvance, 
  ProjectActivity, 
  ProjectMeeting, 
  ProjectCommitment, 
  TimeLog, 
  ProjectRisk,
  EntityId
} from '../types';
import { 
  mockProjects, 
  mockAdvances, 
  mockActivities, 
  mockMeetings, 
  mockCommitments, 
  mockTimeLogs, 
  mockRisks 
} from '../mockData';

// --- Mappers to transform DB records into Frontend interfaces ---

const mapProject = (dbProj: any): Project => ({
  id: dbProj.id,
  code: dbProj.project_code,
  name: dbProj.name,
  description: dbProj.description || '',
  estimatedEffortHours: dbProj.estimated_effort_hours || 0,
  status: dbProj.status,
  leader_id: dbProj.leader_id || '',
  leader_name: dbProj.leader 
    ? `${dbProj.leader.first_name} ${dbProj.leader.last_name}` 
    : 'Sin asignar',
  sponsor: dbProj.sponsor,
  responsible_func: dbProj.responsible_func,
  responsible_exec: dbProj.responsible_exec,
  area_solicitante: dbProj.area_solicitante,
  start_date: dbProj.start_date,
  end_date: dbProj.end_date,
  objective: dbProj.objective || '',
  scope: dbProj.scope || '',
  expected_result: dbProj.expected_result || '',
  execution_style: dbProj.execution_style,
  
  // Nuevas columnas de la Fase 5A
  priority: dbProj.priority || 'Media',
  problem_opportunity: dbProj.problem_opportunity || '',
  justification: dbProj.justification || '',
  strategic_alignment: dbProj.strategic_alignment || '',
  expected_benefits: dbProj.expected_benefits || '',
  risk_of_not_doing: dbProj.risk_of_not_doing || '',
  initial_phase: dbProj.initial_phase || 'Iniciación',
  initial_health: dbProj.initial_health || 'Sin alertas',
  bpmo_observations: dbProj.bpmo_observations || ''
});

const mapAdvance = (dbAdv: any): ProjectAdvance => ({
  id: dbAdv.id,
  project_id: dbAdv.project_id,
  date: dbAdv.date,
  progress_pct: dbAdv.progress_pct,
  summary: dbAdv.summary,
  completed_tasks: dbAdv.completed_tasks || '',
  value_delivered: dbAdv.value_delivered || '',
  evidence: dbAdv.project_evidence?.[0]?.file_name || '',
  reporter: dbAdv.reporter 
    ? `${dbAdv.reporter.first_name} ${dbAdv.reporter.last_name}` 
    : 'Anonimo',
  next_steps: dbAdv.next_steps || '',
  notes: dbAdv.notes || '',
});

const mapActivity = (dbAct: any): ProjectActivity => ({
  id: dbAct.id,
  project_id: dbAct.project_id,
  name: dbAct.name,
  description: dbAct.description || '',
  type: dbAct.type || 'General',
  assignee: dbAct.assignee 
    ? `${dbAct.assignee.first_name} ${dbAct.assignee.last_name}` 
    : 'Sin asignar',
  priority: dbAct.priority,
  kanban_status: dbAct.kanban_status,
  start_date: dbAct.start_date || '',
  due_date: dbAct.due_date || '',
  end_date: dbAct.end_date || undefined,
  estimated_hours: dbAct.estimated_hours || 0,
  actual_hours: dbAct.actual_hours || 0,
  progress_pct: dbAct.progress_pct || 0,
  acceptance_criteria: dbAct.acceptance_criteria || '',
  notes: dbAct.notes || '',
});

const mapMeeting = (dbMeet: any): ProjectMeeting => {
  const attendeesList = dbMeet.meeting_attendees?.map((att: any) => {
    return att.profile ? `${att.profile.first_name} ${att.profile.last_name}` : 'Usuario';
  }) || [];

  return {
    id: dbMeet.id,
    project_id: dbMeet.project_id,
    date_time: dbMeet.date_time,
    type: dbMeet.type,
    attendees: attendeesList,
    topics: dbMeet.topics,
    decisions: dbMeet.decisions || '',
    agreements: dbMeet.agreements || '',
    impediments: dbMeet.impediments || '',
    notes: dbMeet.notes || '',
  };
};

const mapCommitment = (dbComm: any): ProjectCommitment => ({
  id: dbComm.id,
  project_id: dbComm.project_id,
  meeting_id: dbComm.meeting_id,
  description: dbComm.description,
  assignee: dbComm.assignee 
    ? `${dbComm.assignee.first_name} ${dbComm.assignee.last_name}` 
    : 'Sin asignar',
  assignee_id: dbComm.assignee_id || undefined,
  due_date: dbComm.due_date,
  status: dbComm.status,
  evidence: dbComm.project_evidence?.[0]?.file_name || '',
  notes: dbComm.notes || '',
});

const mapTimeLog = (dbLog: any): TimeLog => ({
  id: dbLog.id,
  project_id: dbLog.project_id,
  activity_id: dbLog.activity_id,
  activity_name: dbLog.activity?.name || 'Sin actividad',
  date: dbLog.date,
  user: dbLog.user 
    ? `${dbLog.user.first_name} ${dbLog.user.last_name}` 
    : 'Usuario',
  description: dbLog.description,
  type: dbLog.type,
  estimated_hours: dbLog.activity?.estimated_hours || 0,
  actual_hours: dbLog.actual_hours || 0,
  notes: dbLog.notes || '',
});

const mapRisk = (dbRisk: any): ProjectRisk => ({
  id: dbRisk.id,
  project_id: dbRisk.project_id,
  type: dbRisk.type,
  description: dbRisk.description,
  impact: dbRisk.impact,
  probability: dbRisk.probability,
  assignee: dbRisk.assignee 
    ? `${dbRisk.assignee.first_name} ${dbRisk.assignee.last_name}` 
    : 'Sin asignar',
  date_identified: dbRisk.date_identified,
  resolution_date: dbRisk.resolution_date || undefined,
  status: dbRisk.status,
  mitigation_action: dbRisk.mitigation_action || '',
  notes: dbRisk.notes || '',
});

// --- Services with Fallback to Mock Data ---

export const getProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return mockProjects;
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*, leader:profiles!projects_leader_id_fkey(first_name, last_name)')
      .eq('is_deleted', false);
      
    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn('Supabase respondió 0 proyectos; usando mockData de respaldo para demo.');
      return mockProjects;
    }
    return data.map(mapProject);
  } catch (err) {
    console.warn('Fallo de lectura en Supabase (projects). Usando mockData de respaldo.', err);
    return mockProjects;
  }
};

export const getAdvances = async (projectId?: EntityId): Promise<ProjectAdvance[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockAdvances.filter(a => String(a.project_id) === String(projectId))
      : mockAdvances;
  }
  try {
    let query = supabase.from('project_advances').select('*, reporter:profiles!project_advances_reporter_id_fkey(first_name, last_name), project_evidence(file_name)');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 avances; usando mockData de respaldo para demo.');
      return mockAdvances;
    }
    return (data || []).map(mapAdvance);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (advances). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockAdvances.filter(a => String(a.project_id) === String(projectId))
      : mockAdvances;
  }
};

export const getActivities = async (projectId?: EntityId): Promise<ProjectActivity[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockActivities.filter(a => String(a.project_id) === String(projectId))
      : mockActivities;
  }
  try {
    let query = supabase.from('project_items').select('*, assignee:profiles!project_items_assignee_id_fkey(first_name, last_name)');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 actividades; usando mockData de respaldo para demo.');
      return mockActivities;
    }
    return (data || []).map(mapActivity);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (activities). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockActivities.filter(a => String(a.project_id) === String(projectId))
      : mockActivities;
  }
};

export const getMeetings = async (projectId?: EntityId): Promise<ProjectMeeting[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockMeetings.filter(m => String(m.project_id) === String(projectId))
      : mockMeetings;
  }
  try {
    let query = supabase.from('project_meetings').select('*, meeting_attendees(profile:profiles(first_name, last_name))');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 reuniones; usando mockData de respaldo para demo.');
      return mockMeetings;
    }
    return (data || []).map(mapMeeting);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (meetings). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockMeetings.filter(m => String(m.project_id) === String(projectId))
      : mockMeetings;
  }
};

export const getCommitments = async (projectId?: EntityId): Promise<ProjectCommitment[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockCommitments.filter(c => String(c.project_id) === String(projectId))
      : mockCommitments;
  }
  try {
    let query = supabase.from('meeting_commitments').select('*, assignee:profiles!meeting_commitments_assignee_id_fkey(first_name, last_name), project_evidence(file_name)');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 compromisos; usando mockData de respaldo para demo.');
      return mockCommitments;
    }
    return (data || []).map(mapCommitment);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (commitments). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockCommitments.filter(c => String(c.project_id) === String(projectId))
      : mockCommitments;
  }
};

export const getTimeLogs = async (projectId?: EntityId): Promise<TimeLog[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockTimeLogs.filter(t => String(t.project_id) === String(projectId))
      : mockTimeLogs;
  }
  try {
    let query = supabase.from('time_logs').select('*, user:profiles!time_logs_user_id_fkey(first_name, last_name), activity:project_items(name, estimated_hours)');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 registros de tiempo; usando mockData de respaldo para demo.');
      return mockTimeLogs;
    }
    return (data || []).map(mapTimeLog);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (timeLogs). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockTimeLogs.filter(t => String(t.project_id) === String(projectId))
      : mockTimeLogs;
  }
};

export const getRisks = async (projectId?: EntityId): Promise<ProjectRisk[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return projectId 
      ? mockRisks.filter(r => String(r.project_id) === String(projectId))
      : mockRisks;
  }
  try {
    let query = supabase.from('project_risks').select('*, assignee:profiles!project_risks_assignee_id_fkey(first_name, last_name)');
    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!projectId && (!data || data.length === 0)) {
      console.warn('Supabase respondió 0 riesgos; usando mockData de respaldo para demo.');
      return mockRisks;
    }
    return (data || []).map(mapRisk);
  } catch (err) {
    console.warn(`Fallo de lectura en Supabase (risks). Usando mockData de respaldo.`, err);
    return projectId 
      ? mockRisks.filter(r => String(r.project_id) === String(projectId))
      : mockRisks;
  }
};

export const getLeaders = async (): Promise<{ id: string; first_name: string; last_name: string; }[]> => {
  const localLeaders = [
    { id: '11111111-1111-1111-1111-111111111101', first_name: 'Carlos', last_name: 'Mendoza' },
    { id: '11111111-1111-1111-1111-111111111102', first_name: 'Elena', last_name: 'Ríos' },
    { id: '11111111-1111-1111-1111-111111111103', first_name: 'Jorge', last_name: 'Paz' }
  ];

  if (!isSupabaseConfigured || !supabase) {
    return localLeaders;
  }
  try {
    const { data, error } = await supabase!
      .from('profiles')
      .select('id, first_name, last_name');
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.warn("La consulta a profiles devolvió 0 registros. Usando líderes locales de respaldo.");
      return localLeaders;
    }
    return data;
  } catch (err) {
    console.warn("Fallo de lectura en profiles (líderes). Retornando locales.", err);
    return localLeaders;
  }
};

export const createProject = async (
  project: Omit<Project, 'id' | 'leader_name'>,
  userId: string
): Promise<Project> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la creación.');
  }

  const payload = {
    project_code: project.code,
    name: project.name,
    description: project.description,
    estimated_effort_hours: Number(project.estimatedEffortHours),
    status: project.status,
    leader_id: project.leader_id || null,
    sponsor: project.sponsor,
    responsible_func: project.responsible_func,
    responsible_exec: project.responsible_exec,
    area_solicitante: project.area_solicitante,
    start_date: project.start_date,
    end_date: project.end_date,
    objective: project.objective,
    scope: project.scope,
    expected_result: project.expected_result,
    execution_style: project.execution_style,
    created_by: userId,
    updated_by: userId,
    priority: project.priority || 'Media',
    problem_opportunity: project.problem_opportunity || null,
    justification: project.justification || null,
    strategic_alignment: project.strategic_alignment || null,
    expected_benefits: project.expected_benefits || null,
    risk_of_not_doing: project.risk_of_not_doing || null,
    initial_phase: project.initial_phase || 'Iniciación',
    initial_health: project.initial_health || 'Sin alertas',
    bpmo_observations: project.bpmo_observations || null
  };

  if (!isSupabaseConfigured || !supabase) {
    const newProj: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      leader_name: 'Líder Asignado (Mock)'
    };
    mockProjects.push(newProj);
    return newProj;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select('*, leader:profiles!projects_leader_id_fkey(first_name, last_name)')
      .single();

    if (error) {
      if (error.code === '23505' || (error.message && error.message.includes('duplicate'))) {
        throw new Error('Ya existe un proyecto con ese código.');
      }
      throw error;
    }

    return mapProject(data);
  } catch (err: any) {
    console.error('Error insertando proyecto en Supabase:', err);
    throw err;
  }
};

export const createProjectAdvance = async (
  advance: Omit<ProjectAdvance, 'id' | 'reporter'>,
  userId: string
): Promise<ProjectAdvance> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la creación del avance.');
  }

  const payload = {
    project_id: advance.project_id,
    date: advance.date,
    progress_pct: Number(advance.progress_pct),
    summary: advance.summary,
    completed_tasks: advance.completed_tasks || null,
    value_delivered: advance.value_delivered || null,
    reporter_id: userId,
    next_steps: advance.next_steps || null,
    notes: advance.notes || null,
    created_by: userId,
    updated_by: userId
  };

  if (!isSupabaseConfigured || !supabase) {
    const newAdv: ProjectAdvance = {
      ...advance,
      id: Math.random().toString(36).substr(2, 9),
      reporter: 'Administrador (Mock)'
    };
    mockAdvances.push(newAdv);
    return newAdv;
  }

  try {
    const { data, error } = await supabase!
      .from('project_advances')
      .insert([payload])
      .select('*, reporter:profiles!project_advances_reporter_id_fkey(first_name, last_name)')
      .single();

    if (error) throw error;
    return mapAdvance(data);
  } catch (err: any) {
    console.error('Error insertando avance en Supabase:', err);
    throw err;
  }
};

export const createProjectRisk = async (
  risk: Omit<ProjectRisk, 'id' | 'assignee'>,
  userId: string
): Promise<ProjectRisk> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la creación del riesgo.');
  }

  const payload = {
    project_id: risk.project_id,
    type: risk.type,
    description: risk.description,
    impact: risk.impact,
    probability: risk.probability,
    status: risk.status,
    date_identified: risk.date_identified,
    mitigation_action: risk.mitigation_action || null,
    notes: risk.notes || null,
    assignee_id: null,
    created_by: userId,
    updated_by: userId
  };

  if (!isSupabaseConfigured || !supabase) {
    const newRisk: ProjectRisk = {
      ...risk,
      id: Math.random().toString(36).substr(2, 9),
      assignee: 'Sin asignar'
    };
    mockRisks.push(newRisk);
    return newRisk;
  }

  try {
    const { data, error } = await supabase!
      .from('project_risks')
      .insert([payload])
      .select('*, assignee:profiles!project_risks_assignee_id_fkey(first_name, last_name)')
      .single();

    if (error) throw error;
    return mapRisk(data);
  } catch (err: any) {
    console.error('Error insertando riesgo en Supabase:', err);
    throw err;
  }
};

export const createProjectCommitment = async (
  commitment: Omit<ProjectCommitment, 'id' | 'assignee'>,
  userId: string
): Promise<ProjectCommitment> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la creación del compromiso.');
  }

  const payload = {
    project_id: commitment.project_id,
    meeting_id: null,
    description: commitment.description,
    assignee_id: commitment.assignee_id || null,
    due_date: commitment.due_date,
    status: commitment.status,
    notes: commitment.notes || null,
    created_by: userId,
    updated_by: userId
  };

  if (!isSupabaseConfigured || !supabase) {
    const newComm: ProjectCommitment = {
      ...commitment,
      id: Math.random().toString(36).substr(2, 9),
      assignee: 'Líder Asignado (Mock)'
    };
    mockCommitments.push(newComm);
    return newComm;
  }

  try {
    const { data, error } = await supabase!
      .from('meeting_commitments')
      .insert([payload])
      .select('*, assignee:profiles!meeting_commitments_assignee_id_fkey(first_name, last_name)')
      .single();

    if (error) throw error;
    return mapCommitment(data);
  } catch (err: any) {
    console.error('Error insertando compromiso en Supabase:', err);
    throw err;
  }
};

export const updateProjectCommitmentStatus = async (
  commitmentId: string,
  status: string,
  notes: string,
  userId: string
): Promise<ProjectCommitment> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la actualización del compromiso.');
  }

  const payload = {
    status,
    notes,
    updated_by: userId
  };

  if (!isSupabaseConfigured || !supabase) {
    const idx = mockCommitments.findIndex(c => String(c.id) === String(commitmentId));
    if (idx !== -1) {
      mockCommitments[idx] = {
        ...mockCommitments[idx],
        status: status as any,
        notes: notes
      };
      return mockCommitments[idx];
    }
    throw new Error('Compromiso no encontrado en mockData.');
  }

  try {
    const { data, error } = await supabase!
      .from('meeting_commitments')
      .update(payload)
      .eq('id', commitmentId)
      .select('*, assignee:profiles!meeting_commitments_assignee_id_fkey(first_name, last_name)')
      .single();

    if (error) throw error;
    return mapCommitment(data);
  } catch (err: any) {
    console.error('Error actualizando compromiso en Supabase:', err);
    throw err;
  }
};

export const updateProjectRiskStatus = async (
  riskId: string,
  status: string,
  notes: string,
  userId: string
): Promise<ProjectRisk> => {
  if (!userId) {
    throw new Error('El identificador del perfil de usuario no está disponible. No se puede auditar la actualización del riesgo.');
  }

  const payload = {
    status,
    notes,
    updated_by: userId
  };

  if (!isSupabaseConfigured || !supabase) {
    const idx = mockRisks.findIndex(r => String(r.id) === String(riskId));
    if (idx !== -1) {
      mockRisks[idx] = {
        ...mockRisks[idx],
        status: status as any,
        notes: notes
      };
      return mockRisks[idx];
    }
    throw new Error('Riesgo no encontrado en mockData.');
  }

  try {
    const { data, error } = await supabase!
      .from('project_risks')
      .update(payload)
      .eq('id', riskId)
      .select('*, assignee:profiles!project_risks_assignee_id_fkey(first_name, last_name)')
      .single();

    if (error) throw error;
    return mapRisk(data);
  } catch (err: any) {
    console.error('Error actualizando riesgo en Supabase:', err);
    throw err;
  }
};
