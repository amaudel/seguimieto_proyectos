import React, { useState } from 'react';
import type { 
  Project, 
  ProjectAdvance, 
  ProjectActivity, 
  ProjectMeeting, 
  ProjectCommitment, 
  TimeLog, 
  ProjectRisk 
} from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  FolderGit2, 
  Users, 
  CheckCircle
} from 'lucide-react';


interface ProjectDetailProps {
  project: Project;
  advances: ProjectAdvance[];
  activities: ProjectActivity[];
  meetings: ProjectMeeting[];
  commitments: ProjectCommitment[];
  timeLogs: TimeLog[];
  risks: ProjectRisk[];
  onBack: () => void;
}

type TabType = 'resumen' | 'avances' | 'actividades' | 'reuniones' | 'compromisos' | 'tiempos' | 'riesgos' | 'reporte';

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project: projectRaw,
  advances,
  activities,
  meetings,
  commitments,
  timeLogs,
  risks,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('resumen');

  // Normalizar el ID del proyecto para textos condicionales del mock de la Fase 1
  const project = {
    ...projectRaw,
    id: String(projectRaw.id) === '22222222-2222-2222-2222-222222222201' ? 1 : 
        String(projectRaw.id) === '22222222-2222-2222-2222-222222222202' ? 2 : 
        String(projectRaw.id) === '22222222-2222-2222-2222-222222222203' ? 3 : 
        String(projectRaw.id) === '22222222-2222-2222-2222-222222222204' ? 4 : 
        projectRaw.id
  };

  // Filter project-specific records using normalized string comparison
  const projectAdvances = advances.filter(a => String(a.project_id) === String(projectRaw.id));
  const projectActivities = activities.filter(a => String(a.project_id) === String(projectRaw.id));
  const projectMeetings = meetings.filter(m => String(m.project_id) === String(projectRaw.id));
  const projectCommitments = commitments.filter(c => String(c.project_id) === String(projectRaw.id));
  const projectTimeLogs = timeLogs.filter(t => String(t.project_id) === String(projectRaw.id));
  const projectRisks = risks.filter(r => String(r.project_id) === String(projectRaw.id));

  // Latest progress percentage from advances or default
  const latestAdvance = projectAdvances.length > 0 
    ? projectAdvances.sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;
  const currentProgress = latestAdvance ? latestAdvance.progress_pct : 0;

  // Active blockages and high risks
  const activeBlockagesCount = projectRisks.filter(r => r.status === 'Abierto' && r.type === 'Bloqueo').length;
  const activeRisksCount = projectRisks.filter(r => r.status === 'Abierto' && r.type === 'Riesgo' && r.impact === 'Alto').length;

  // Time calculations
  const totalEstimatedHours = projectActivities.reduce((acc, a) => acc + a.estimated_hours, 0);
  const totalActualHours = projectActivities.reduce((acc, a) => acc + a.actual_hours, 0);
  const hourDeviation = totalActualHours - totalEstimatedHours;
  const deviationPct = totalEstimatedHours > 0 ? Math.round((hourDeviation / totalEstimatedHours) * 100) : 0;

  // Lógica de fases del ciclo de vida (Fase 4C)
  const getActiveStep = (): number => {
    const hasAdvances = projectAdvances.length > 0;
    switch (projectRaw.status) {
      case 'Borrador':
        return hasAdvances ? 1 : 0;
      case 'En curso':
      case 'Pausado':
        return 2;
      case 'En revisión':
      case 'Con retraso':
        return 3;
      case 'Cerrado':
      case 'Cancelado':
        return 4;
      default:
        return 0;
    }
  };
  const activeStep = getActiveStep();
  const steps = ['Iniciación', 'Planificación', 'Ejecución', 'Seguimiento', 'Cierre'];

  // Overdue counts
  const currentDateStr = '2026-06-25';
  const overdueActivitiesCount = projectActivities.filter(a => 
    a.kanban_status !== 'Terminado' && a.due_date < currentDateStr
  ).length;
  const overdueCommitmentsCount = projectCommitments.filter(c => 
    c.status === 'Vencido' || (c.status !== 'Cumplido' && c.due_date < currentDateStr)
  ).length;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'avances', label: 'Avances' },
    { id: 'actividades', label: 'Actividades' },
    { id: 'reuniones', label: 'Reuniones' },
    { id: 'compromisos', label: 'Compromisos' },
    { id: 'tiempos', label: 'Tiempos' },
    { id: 'riesgos', label: 'Riesgos' },
    { id: 'reporte', label: 'Reporte' }
  ];

  return (
    <div className="space-y-6">
      {/* Back button and quick header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al listado
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {project.code}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
            project.status === 'En curso' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : project.status === 'Con retraso' 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : project.status === 'Pausado' 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-xl font-bold text-slate-900 leading-tight">{project.name}</h2>
          <p className="text-xs text-slate-500">{project.description}</p>
          <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Líder: <strong className="text-slate-600">{project.leader_name}</strong></span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Sponsor: <strong className="text-slate-600">{project.sponsor}</strong></span>
            <span className="flex items-center gap-1"><FolderGit2 className="w-3.5 h-3.5" /> Área: <strong className="text-slate-600">{project.area_solicitante}</strong></span>
          </div>
        </div>
        
        {/* Progress Display */}
        <div className="shrink-0 flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full md:w-auto justify-between md:justify-start">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Avance</span>
            <span className="text-2xl font-black text-slate-800">{currentProgress}%</span>
          </div>
          <div className="w-24 bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${project.status === 'Con retraso' ? 'bg-red-500' : 'bg-[#0284c7]'}`}
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex space-x-6 min-w-max pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0284c7] text-[#0284c7]'
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
              }`}
            >
              {tab.label}
              {tab.id === 'compromisos' && overdueCommitmentsCount > 0 && (
                <span className="ml-1.5 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                  {overdueCommitmentsCount}
                </span>
              )}
              {tab.id === 'riesgos' && activeBlockagesCount > 0 && (
                <span className="ml-1.5 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                  {activeBlockagesCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="bg-slate-50 min-h-[300px]">
        {/* 1. RESUMEN TAB */}
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Scope & Objectives */}
            <div className="lg:col-span-2 space-y-6">

              {/* Stepper de Fases del Proyecto - Vista Desktop (Fase 4D) */}
              <div className="hidden sm:block bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Etapa del Ciclo de Vida del Proyecto
                </h3>
                <div className="relative flex items-center justify-between w-full mt-2">
                  {/* Línea de fondo */}
                  <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-slate-200 z-0" />
                  
                  {/* Línea activa */}
                  <div 
                    className="absolute left-[10%] top-4 h-0.5 bg-sky-600 transition-all duration-300 z-0" 
                    style={{ width: `${(activeStep / (steps.length - 1)) * 80}%` }}
                  />

                  {steps.map((step, idx) => {
                    const isCompleted = idx < activeStep;
                    const isActive = idx === activeStep;
                    
                    let circleClass = 'bg-slate-100 text-slate-400 border-slate-200';
                    if (isCompleted) {
                      circleClass = 'bg-emerald-500 text-white border-emerald-500';
                    } else if (isActive) {
                      circleClass = 'bg-sky-600 text-white border-sky-600 ring-4 ring-sky-100';
                    }

                    return (
                      <div key={step} className="flex flex-col items-center relative z-10 w-1/5">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${circleClass}`}>
                          {isCompleted ? (
                            <span className="text-white">✓</span>
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className={`text-[10px] mt-2 font-bold tracking-tight text-center ${
                          isActive ? 'text-sky-600 font-extrabold' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stepper de Fases del Proyecto - Vista Móvil Adaptativa (Fase 4D) */}
              <div className="block sm:hidden bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  Etapa del Ciclo de Vida
                </h3>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fase Actual</span>
                    <span className="text-sm font-black text-sky-600">
                      {activeStep + 1}/5 - {steps[activeStep]}
                    </span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {steps.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-3.5 h-2 rounded-full transition-colors ${
                          idx < activeStep 
                            ? 'bg-emerald-500' 
                            : idx === activeStep 
                              ? 'bg-sky-600' 
                              : 'bg-slate-200'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Conclusión Ejecutiva BPMO */}
              <div className="bg-sky-50 p-5 rounded-xl border border-sky-200 shadow-xs space-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0284c7]" />
                <h3 className="font-extrabold text-sky-950 text-xs pl-1">Conclusión Ejecutiva BPMO</h3>
                <p className="text-xs text-sky-900 leading-relaxed pl-1 font-medium">
                  {project.id === 1 && "El proyecto avanza a velocidad constante. La base de datos QA y el piloto inicial se concluyeron con éxito. Se registra una desviación menor en esfuerzo por la limpieza de datos históricos de socios, pero sin impacto en la fecha de entrega objetiva."}
                  {project.id === 2 && "Desarrollo técnico al día. Se reporta un riesgo moderado en el cronograma por la demora en la asignación de credenciales VPN del Banco Central del Ecuador (BCE) para el SPI. El resto de módulos (biometría, transferencias internas) operan con éxito en QA."}
                  {project.id === 3 && "Proyecto en fase de aprestamiento y parametrización de metodologías. El cronograma arranca formalmente en Julio de 2026 con el apoyo del Gerente General como Sponsor principal."}
                  {project.id === 4 && "Desviación crítica en cronograma por retrasos del proveedor externo de Buró de Crédito y bloqueo legal en la firma de convenio OTP. Se requiere escalamiento urgente del Sponsor a nivel directivo para reactivar las firmas digitales."}
                </p>
              </div>

              {/* Salud del Proyecto (3 dimensiones) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Salud del Proyecto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Dimensión 1: Tiempos */}
                  <div className="p-3 rounded-lg border border-slate-150 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Tiempos</span>
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        project.id === 4 ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : project.id === 2 ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                      }`} />
                    </div>
                    <div className="text-[11px] font-bold text-slate-700">
                      {project.id === 4 ? 'Retraso Crítico' : project.id === 2 ? 'En Alerta' : 'Al Día'}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {project.id === 1 && "Cronograma alineado al plan de migración."}
                      {project.id === 2 && "Pendiente de accesos del Banco Central."}
                      {project.id === 3 && "Cronograma planificado al inicio de Julio."}
                      {project.id === 4 && "Hitos vencidos en APIs e integración OTP."}
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-100 font-medium">
                      Objetivo: {project.end_date}
                    </div>
                  </div>

                  {/* Dimensión 2: Alcance */}
                  <div className="p-3 rounded-lg border border-slate-150 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Alcance</span>
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        project.id === 4 ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                      }`} />
                    </div>
                    <div className="text-[11px] font-bold text-slate-700">
                      {project.id === 4 ? 'Riesgo de Corte' : 'Alineado'}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {project.id === 1 && "Módulos de base de datos migrados con éxito."}
                      {project.id === 2 && "Diseño UX y biométricos entregados al 100%."}
                      {project.id === 3 && "Plantillas de gobernanza completadas."}
                      {project.id === 4 && "Riesgo de retirar la firma digital del MVP."}
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-100 font-medium">
                      Avance: {currentProgress}% global
                    </div>
                  </div>

                  {/* Dimensión 3: Esfuerzo / Capacidad */}
                  <div className="p-3 rounded-lg border border-slate-150 space-y-2 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase font-semibold">Esfuerzo / Capacidad</span>
                      <span className={`w-3.5 h-3.5 rounded-full ${
                        project.id === 1 || project.id === 4 ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                      }`} />
                    </div>
                    <div className="text-[11px] font-bold text-slate-700">
                      {project.id === 1 || project.id === 4 ? 'Desviación Menor' : 'En Orden'}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {project.id === 1 && "Extra esfuerzo por limpieza de datos de socios."}
                      {project.id === 2 && "Consumo de horas dentro de la estimación."}
                      {project.id === 3 && "Esfuerzo no registrado todavía."}
                      {project.id === 4 && "Esfuerzo alto con bajo nivel de avance."}
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-100 font-semibold">
                      Desviación: {hourDeviation > 0 ? `+${hourDeviation}h (${deviationPct}%)` : '0h (0%)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Objective */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Objetivo Estratégico</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{project.objective}</p>
              </div>

              {/* Scope */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Alcance del Proyecto</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{project.scope}</p>
              </div>

              {/* Expected Result */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Resultado Esperado</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{project.expected_result}</p>
              </div>

              {/* Caso de Negocio (Fase 4C) */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">Caso de Negocio e Impacto</h3>
                  <span className="text-[9px] text-amber-600 font-bold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded w-fit">
                    ⚠️ Pendiente de Formalización para Fase 5
                  </span>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Justificación</span>
                    <p className="text-slate-500 italic">
                      Información de justificación corporativa pendiente de integración con base de datos.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Alineación con Objetivos de la Cooperativa</span>
                    <p className="text-slate-500 italic">
                      Definición de pilares estratégicos institucionales pendiente de mapeo físico.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">beneficios institucionales, operativos y para socios</span>
                    <p className="text-slate-500 italic">
                      Cuantificación de impactos y retorno cooperativo pendiente de formalización.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Metadata Cards */}
            <div className="space-y-6">
              {/* Responsibility Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Ficha del Proyecto</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Líder Técnico Ejecutor</span>
                    <span className="text-slate-800 font-semibold">{project.responsible_exec}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Responsable Funcional</span>
                    <span className="text-slate-800 font-semibold">{project.responsible_func}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Patrocinador (Sponsor)</span>
                    <span className="text-slate-800 font-semibold">{project.sponsor}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Enfoque</span>
                      <span className="text-slate-800 font-semibold">{project.execution_style}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Esfuerzo Estimado</span>
                      <span className="text-slate-800 font-semibold">{project.estimatedEffortHours.toLocaleString('es-ES')} h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chronogram Info Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Cronograma Ejecución</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Fecha Inicio Planificada:</span>
                    <span className="font-semibold text-slate-700">{project.start_date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Fecha Objetivo Entrega:</span>
                    <span className="font-semibold text-slate-700">{project.end_date}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Total días planeados:</span>
                    <span className="font-semibold text-slate-600">
                      {Math.round((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))} días
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AVANCES TAB */}
        {activeTab === 'avances' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Línea de Tiempo de Avances (Bitácora)</h3>
            
            {projectAdvances.length > 0 ? (
              <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-8">
                {projectAdvances.sort((a, b) => b.date.localeCompare(a.date)).map(adv => (
                  <div key={adv.id} className="relative">
                    {/* Circle icon */}
                    <div className="absolute -left-[31px] top-0 bg-[#0284c7] text-white p-1 rounded-full border-4 border-white shadow-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    
                    {/* Advance Content */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">{adv.date}</span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                            Avance al {adv.progress_pct}%
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">Reportado por: {adv.reporter}</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-800 text-xs">{adv.summary}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <strong className="text-slate-600 block mb-1">Actividades Realizadas:</strong>
                          <p className="text-slate-700 leading-tight">{adv.completed_tasks}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <strong className="text-slate-600 block mb-1">Valor Entregado:</strong>
                          <p className="text-slate-700 leading-tight">{adv.value_delivered}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                        <div>
                          <strong className="text-slate-500">Próximos pasos:</strong> {adv.next_steps}
                        </div>
                        {adv.evidence && (
                          <div className="flex items-center gap-1 text-[#0284c7] font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                            <FileText className="w-3 h-3" />
                            <span>{adv.evidence}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-10">No se han registrado avances para este proyecto.</p>
            )}
          </div>
        )}

        {/* 3. ACTIVIDADES TAB */}
        {activeTab === 'actividades' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Backlog de Actividades / Kanban</h3>
                <p className="text-[11px] text-slate-400">Tareas operativas del cronograma o sprint.</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {projectActivities.filter(a => a.kanban_status === 'Terminado').length} Terminadas
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  {overdueActivitiesCount} Vencidas
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-4 py-3">Actividad</th>
                    <th className="px-4 py-3">Responsable</th>
                    <th className="px-4 py-3">Prioridad</th>
                    <th className="px-4 py-3">Fechas</th>
                    <th className="px-4 py-3">Tiempos (H)</th>
                    <th className="px-4 py-3">Avance</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {projectActivities.length > 0 ? (
                    projectActivities.map(act => (
                      <tr key={act.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="font-bold text-slate-800 line-clamp-1">{act.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{act.description}</div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{act.assignee}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            act.priority === 'Crítica' || act.priority === 'Alta'
                              ? 'bg-red-50 text-red-700 border-red-100'
                              : act.priority === 'Media'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {act.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="text-slate-500">{act.start_date}</div>
                          <div className={`text-[10px] font-semibold ${act.kanban_status !== 'Terminado' && act.due_date < currentDateStr ? 'text-red-600' : 'text-slate-400'}`}>
                            Límite: {act.due_date}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="text-slate-700">Plan: <span className="font-semibold">{act.estimated_hours}h</span></div>
                          <div className="text-[10px] text-slate-400">Real: <span className="font-semibold text-slate-600">{act.actual_hours}h</span></div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span>{act.progress_pct}%</span>
                            <div className="w-10 bg-slate-100 rounded-full h-1">
                              <div className="bg-[#0284c7] h-1 rounded-full" style={{ width: `${act.progress_pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                            act.kanban_status === 'Terminado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : act.kanban_status === 'En progreso'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : act.kanban_status === 'Bloqueado'
                                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {act.kanban_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No hay actividades cargadas para este proyecto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REUNIONES TAB */}
        {activeTab === 'reuniones' && (
          <div className="space-y-4">
            {projectMeetings.length > 0 ? (
              projectMeetings.map(meet => (
                <div key={meet.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  {/* Meeting Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                        {meet.type}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">Comité / Reunión de Seguimiento</h4>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{meet.date_time}</span>
                    </div>
                  </div>

                  {/* Meeting Body Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <strong className="text-slate-600 block mb-0.5">Temas Tratados:</strong>
                        <p className="text-slate-700 leading-tight bg-slate-50 p-2.5 rounded border border-slate-100">{meet.topics}</p>
                      </div>
                      <div>
                        <strong className="text-slate-600 block mb-0.5">Decisiones Tomadas:</strong>
                        <p className="text-slate-700 leading-tight bg-slate-50 p-2.5 rounded border border-slate-100">{meet.decisions}</p>
                      </div>
                      <div>
                        <strong className="text-slate-600 block mb-0.5">Acuerdos Generales:</strong>
                        <p className="text-slate-700 leading-tight bg-slate-50 p-2.5 rounded border border-slate-100">{meet.agreements}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <strong className="text-slate-600 block mb-1">Asistentes:</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                          {meet.attendees.map((att, i) => (
                            <li key={i}>{att}</li>
                          ))}
                        </ul>
                      </div>
                      {meet.impediments && (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-900">
                          <strong className="text-red-700 block mb-1">Impedimentos / Riesgos:</strong>
                          <p className="leading-tight">{meet.impediments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-10 bg-white rounded-xl border border-slate-200">No hay reuniones registradas.</p>
            )}
          </div>
        )}

        {/* 5. COMPROMISOS TAB */}
        {activeTab === 'compromisos' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Compromisos de Comités y Reuniones</h3>
              <p className="text-[11px] text-slate-400">Responsabilidades concretas acordadas y fechas límite.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-4 py-3">Compromiso / Descripción</th>
                    <th className="px-4 py-3">Responsable</th>
                    <th className="px-4 py-3">Fecha Límite</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Evidencia / Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {projectCommitments.length > 0 ? (
                    projectCommitments.map(comp => (
                      <tr key={comp.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 max-w-sm">
                          <p className="font-medium text-slate-800 leading-tight">{comp.description}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{comp.assignee}</td>
                        <td className="px-4 py-3.5 whitespace-nowrap font-semibold">
                          <span className={`${comp.status === 'Vencido' ? 'text-red-600' : 'text-slate-500'}`}>
                            {comp.due_date}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            comp.status === 'Cumplido'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : comp.status === 'En proceso'
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : comp.status === 'Vencido'
                                  ? 'bg-red-50 text-red-700 border-red-100 animate-pulse'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {comp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap text-slate-400 max-w-xs truncate">
                          {comp.evidence ? (
                            <span className="text-[#0284c7] font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100 text-[10px]">
                              {comp.evidence}
                            </span>
                          ) : (
                            <span>{comp.notes || '-'}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No hay compromisos asignados para este proyecto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. TIEMPOS TAB */}
        {activeTab === 'tiempos' && (
          <div className="space-y-6">
            {/* KPI Hour Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Planificadas</span>
                <span className="text-xl font-bold text-slate-800">{totalEstimatedHours}h</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Ejecutadas Reales</span>
                <span className="text-xl font-bold text-slate-800">{totalActualHours}h</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Desviación Absoluta</span>
                <span className={`text-xl font-bold ${hourDeviation > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {hourDeviation > 0 ? `+${hourDeviation}h` : `${hourDeviation}h`}
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Desviación %</span>
                <span className={`text-xl font-bold ${deviationPct > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {deviationPct > 0 ? `+${deviationPct}%` : `${deviationPct}%`}
                </span>
              </div>
            </div>

            {/* Time log table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">Registro de Esfuerzo de Tiempos</h3>
                <p className="text-[11px] text-slate-400">Resumen del trabajo incurrido por recurso.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="px-4 py-3">Actividad</th>
                      <th className="px-4 py-3">Colaborador</th>
                      <th className="px-4 py-3">Fecha Movimiento</th>
                      <th className="px-4 py-3">Descripción Trabajo</th>
                      <th className="px-4 py-3">Est. Horas</th>
                      <th className="px-4 py-3">Real Horas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {projectTimeLogs.length > 0 ? (
                      projectTimeLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3.5 max-w-xs">
                            <span className="font-semibold text-slate-700">{log.activity_name}</span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{log.user}</td>
                          <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{log.date}</td>
                          <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">{log.description}</td>
                          <td className="px-4 py-3.5 font-semibold text-slate-500">{log.estimated_hours}h</td>
                          <td className="px-4 py-3.5 font-bold text-slate-800">{log.actual_hours}h</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          No hay logs de tiempo ingresados para este proyecto.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. RIESGOS TAB */}
        {activeTab === 'riesgos' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Matriz de Riesgos, Bloqueos e Impedimentos</h3>
                <p className="text-[11px] text-slate-400">Eventos o condiciones que amenazan el cumplimiento del proyecto.</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  {activeBlockagesCount} Bloqueos Activos
                </span>
                <span className="font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  {activeRisksCount} Riesgos Altos
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Descripción</th>
                    <th className="px-4 py-3">Impacto / Probabilidad</th>
                    <th className="px-4 py-3">Responsable</th>
                    <th className="px-4 py-3">Fecha Identificación</th>
                    <th className="px-4 py-3">Acción de Mitigación</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {projectRisks.length > 0 ? (
                    projectRisks.map(risk => (
                      <tr key={risk.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            risk.type === 'Bloqueo'
                              ? 'bg-red-100 text-red-800 border-red-200 animate-pulse'
                              : risk.type === 'Riesgo'
                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {risk.type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="font-medium text-slate-800 leading-tight">{risk.description}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div>Imp: <span className={`font-bold ${risk.impact === 'Alto' ? 'text-red-600' : 'text-slate-600'}`}>{risk.impact}</span></div>
                            <div className="text-[10px] text-slate-400">Prob: <span className="font-semibold">{risk.probability}</span></div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{risk.assignee}</td>
                        <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{risk.date_identified}</td>
                        <td className="px-4 py-3.5 max-w-xs">
                          <p className="text-slate-600 leading-tight text-[11px]">{risk.mitigation_action}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            risk.status === 'Cerrado' || risk.status === 'Mitigado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {risk.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No hay riesgos registrados en el proyecto.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. REPORTE EJECUTIVO TAB */}
        {activeTab === 'reporte' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 max-w-4xl mx-auto">
            {/* Header Ficha */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Documento de Control</span>
                <h3 className="text-base font-extrabold text-slate-900">Ficha Ejecutiva BPMO / Sponsor / Comité</h3>
                <p className="text-[11px] text-slate-500">Estado de control de proyectos - Cooperativa de Ahorro y Crédito</p>
              </div>
              <div className="text-left sm:text-right text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                <div><strong>Fecha del Informe:</strong> 25 Jun 2026</div>
                <div><strong>Emisor:</strong> Oficina de Procesos y Proyectos (BPMO)</div>
              </div>
            </div>

            {/* Block 1: Datos Generales */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">1. Datos Generales del Proyecto</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Código del Proyecto:</span>
                  <span className="font-semibold text-slate-800">{project.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nombre de la Iniciativa:</span>
                  <span className="font-semibold text-slate-800">{project.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Líder del Proyecto:</span>
                  <span className="font-semibold text-slate-800">{project.leader_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Patrocinador Ejecutor (Sponsor):</span>
                  <span className="font-semibold text-slate-800">{project.sponsor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Responsable Funcional / Ejecutor:</span>
                  <span className="font-semibold text-slate-800">{project.responsible_func} / {project.responsible_exec}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fechas Planificadas (Inicio / Fin):</span>
                  <span className="font-semibold text-slate-800">{project.start_date} al {project.end_date}</span>
                </div>
              </div>
            </div>

            {/* Block 2 & 3: Estado de Salud y Avance Actual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Salud de 3 dimensiones */}
              <div className="md:col-span-2 space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">2. Semáforo de Salud del Proyecto</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded border border-slate-150 bg-slate-50/50">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Tiempos</span>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 ${
                      project.id === 4 ? 'bg-red-500' : project.id === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-[10px] block font-semibold text-slate-700 mt-1">
                      {project.id === 4 ? 'Retraso Crítico' : project.id === 2 ? 'En Alerta' : 'Al Día'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-150 bg-slate-50/50">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Alcance</span>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 ${
                      project.id === 4 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-[10px] block font-semibold text-slate-700 mt-1">
                      {project.id === 4 ? 'Riesgo' : 'Alineado'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-150 bg-slate-50/50">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Esfuerzo</span>
                    <span className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 ${
                      project.id === 1 || project.id === 4 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-[10px] block font-semibold text-slate-700 mt-1">
                      {project.id === 1 || project.id === 4 ? 'Desviado' : 'En Orden'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avance actual */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">3. Avance Actual</h4>
                <div className="p-3.5 bg-slate-50 rounded border border-slate-150 flex flex-col justify-center items-center h-[72px]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-800">{currentProgress}%</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Completado</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full ${project.status === 'Con retraso' ? 'bg-red-500' : 'bg-[#0284c7]'}`}
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Block 4 & 5: Hitos logrados y Pendientes relevantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
              
              {/* Hitos Logrados */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">4. Hitos y Avances Logrados</h4>
                {projectAdvances.length > 0 ? (
                  <ul className="space-y-2 list-none">
                    {projectAdvances.slice(0, 2).map(adv => (
                      <li key={adv.id} className="bg-slate-50 p-2.5 rounded border border-slate-100">
                        <div className="flex justify-between font-bold text-[10px] text-slate-400 mb-0.5">
                          <span>{adv.date}</span>
                          <span className="text-emerald-600 font-extrabold">{adv.progress_pct}%</span>
                        </div>
                        <p className="text-slate-800 font-semibold">{adv.summary}</p>
                        <p className="text-[10px] text-slate-500 mt-1"><strong>Entregado:</strong> {adv.value_delivered}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 italic">No hay avances registrados.</p>
                )}
              </div>

              {/* Pendientes Relevantes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">5. Actividades Pendientes Relevantes</h4>
                <div className="space-y-1.5">
                  {projectActivities.filter(a => a.kanban_status !== 'Terminado').length > 0 ? (
                    projectActivities.filter(a => a.kanban_status !== 'Terminado').slice(0, 3).map(act => (
                      <div key={act.id} className="flex justify-between items-start p-2 bg-slate-50 rounded border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-850 line-clamp-1">{act.name}</p>
                          <p className="text-[10px] text-slate-400">Responsable: {act.assignee}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          act.kanban_status === 'Bloqueado' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>{act.kanban_status}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No hay actividades pendientes en curso.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Block 6 & 7: Compromisos vencidos y Riesgos/Bloqueos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
              
              {/* Compromisos Vencidos */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">6. Compromisos Vencidos</h4>
                <div className="space-y-1.5">
                  {projectCommitments.filter(c => c.status === 'Vencido').length > 0 ? (
                    projectCommitments.filter(c => c.status === 'Vencido').map(comp => (
                      <div key={comp.id} className="p-2.5 bg-red-50 border border-red-150 rounded text-red-950 flex justify-between items-start gap-2">
                        <div>
                          <p className="font-semibold leading-tight">{comp.description}</p>
                          <span className="text-[10px] text-red-700 font-medium">Asignado a: {comp.assignee}</span>
                        </div>
                        <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded shrink-0">
                          Límite: {comp.due_date}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-150 rounded text-emerald-900 flex items-center gap-1.5 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Sin compromisos vencidos. Todos los acuerdos se encuentran al día.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Riesgos y Bloqueos */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">7. Riesgos y Bloqueos Activos</h4>
                <div className="space-y-1.5">
                  {projectRisks.filter(r => r.status === 'Abierto').length > 0 ? (
                    projectRisks.filter(r => r.status === 'Abierto').map(risk => (
                      <div key={risk.id} className={`p-2.5 rounded border flex justify-between items-start gap-2 ${
                        risk.type === 'Bloqueo' ? 'bg-red-50 border-red-150 text-red-950' : 'bg-amber-50 border-amber-150 text-amber-950'
                      }`}>
                        <div>
                          <p className="font-semibold leading-tight">[{risk.type}] {risk.description}</p>
                          <span className="text-[10px] opacity-80">Mitigación: {risk.mitigation_action}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          risk.type === 'Bloqueo' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {risk.impact}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 bg-slate-50 border border-slate-150 rounded text-slate-500 italic">
                      No se registran riesgos ni bloqueos activos.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Block 8, 9 & 10: Horas, Próximos pasos y Decisiones requeridas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
              
              {/* Horas planificadas vs reales */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">8. Control de Esfuerzo (Horas)</h4>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded text-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Estimado Planificado:</span>
                    <span className="font-bold">{totalEstimatedHours}h</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span>Consumido Incurrido:</span>
                    <span className="font-bold">{totalActualHours}h</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-slate-200">
                    <span>Desviación Total:</span>
                    <span className={`font-black ${hourDeviation > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {hourDeviation > 0 ? `+${hourDeviation}h (+${deviationPct}%)` : `${hourDeviation}h (${deviationPct}%)`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Próximos pasos */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">9. Próximos Pasos</h4>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded text-slate-700 h-[86px] overflow-y-auto">
                  <p className="italic leading-relaxed">
                    {latestAdvance ? latestAdvance.next_steps : 'No se registran próximos pasos.'}
                  </p>
                </div>
              </div>

              {/* Decisiones requeridas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">10. Decisiones Requeridas</h4>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded text-slate-700 h-[86px] overflow-y-auto font-medium">
                  <p className="leading-tight">
                    {project.id === 1 && "Ninguna decisión crítica requerida. Mantener monitoreo del avance del API de ventanillas."}
                    {project.id === 2 && "Sponsor debe gestionar con directivos del Banco Central la asignación de certificados VPN."}
                    {project.id === 3 && "Aprobación formal del Acta de Gobernanza por el Consejo de Administración."}
                    {project.id === 4 && "Junta/Sponsor debe aprobar la firma del convenio comercial para reactivar firma OTP."}
                  </p>
                </div>
              </div>

            </div>

            {/* Block 11: Conclusión Ejecutiva */}
            <div className="space-y-2 pt-2 text-xs">
              <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider border-b border-slate-100 pb-1">11. Conclusión Ejecutiva BPMO</h4>
              <div className="bg-sky-50 p-4 rounded-xl border border-sky-150 text-sky-950 font-medium leading-relaxed">
                {project.id === 1 && "El proyecto avanza a velocidad constante. La base de datos QA y el piloto inicial se concluyeron con éxito. Se registra una desviación menor en esfuerzo por la limpieza de datos históricos de socios, pero sin impacto en la fecha de entrega objetiva."}
                {project.id === 2 && "Desarrollo técnico al día. Se reporta un riesgo moderado en el cronograma por la demora en la asignación de credenciales VPN del Banco Central del Ecuador (BCE) para el SPI. El resto de módulos (biometría, transferencias internas) operan con éxito en QA."}
                {project.id === 3 && "Proyecto en fase de aprestamiento y parametrización de metodologías. El cronograma arranca formalmente en Julio de 2026 con el apoyo del Gerente General como Sponsor principal."}
                {project.id === 4 && "Desviación crítica en cronograma por retrasos del proveedor externo de Buró de Crédito y bloqueo legal en la firma de convenio OTP. Se requiere escalamiento urgente del Sponsor a nivel directivo para reactivar las firmas digitales."}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

