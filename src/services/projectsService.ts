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
