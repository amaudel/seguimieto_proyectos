import React, { useState, useEffect } from 'react';
import type { Project, ExecutionStyle } from '../types';
import { getLeaders } from '../services/projectsService';
import { ArrowLeft, ArrowRight, Save, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface NewProjectProps {
  onSave: (projectData: Omit<Project, 'id' | 'leader_name'>) => Promise<void>;
  onCancel: () => void;
  userProfileId: string | null;
}

export const NewProject: React.FC<NewProjectProps> = ({ onSave, onCancel, userProfileId }) => {
  const [step, setStep] = useState(1);
  const [leaders, setLeaders] = useState<{ id: string; first_name: string; last_name: string; }[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [executionStyle, setExecutionStyle] = useState<ExecutionStyle>('Híbrido');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  
  // Case Study Fields
  const [problemOpportunity, setProblemOpportunity] = useState('');
  const [justification, setJustification] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [strategicAlignment, setStrategicAlignment] = useState('');
  const [expectedBenefits, setExpectedBenefits] = useState('');
  const [riskOfNotDoing, setRiskOfNotDoing] = useState('');

  // Responsibles & Dates Fields
  const [sponsor, setSponsor] = useState('');
  const [responsibleFunc, setResponsibleFunc] = useState('');
  const [responsibleExec, setResponsibleExec] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');

  // Initial Monitoring Fields
  const [initialPhase, setInitialPhase] = useState<'Iniciación' | 'Planificación' | 'Ejecución' | 'Seguimiento' | 'Cierre'>('Iniciación');
  const [initialHealth, setInitialHealth] = useState<'Sin alertas' | 'Con alertas' | 'Crítica'>('Sin alertas');
  const [bpmoObservations, setBpmoObservations] = useState('');

  useEffect(() => {
    async function loadLeadersData() {
      try {
        const leadersData = await getLeaders();
        setLeaders(leadersData);
        if (leadersData.length > 0) {
          setLeaderId(String(leadersData[0].id));
        }
      } catch (err) {
        console.error('Error cargando líderes:', err);
      } finally {
        setLoadingLeaders(false);
      }
    }
    loadLeadersData();
  }, []);

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!code.trim() || !name.trim() || !area.trim()) {
        setError('Por favor, completa el Código, Nombre y Área del proyecto.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!objective.trim() || !scope.trim() || !expectedResult.trim()) {
        setError('Por favor, completa el Objetivo, Alcance y Resultado esperado.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!sponsor.trim() || !responsibleFunc.trim() || !responsibleExec.trim() || !leaderId || !startDate || !endDate || !estimatedHours) {
        setError('Por favor, completa todos los responsables, fechas y esfuerzo estimado.');
        return false;
      }
      
      // Validar que esfuerzo estimado sea >= 0
      const hours = Number(estimatedHours);
      if (isNaN(hours) || hours < 0) {
        setError('El esfuerzo estimado en horas debe ser un número mayor o igual a 0.');
        return false;
      }

      // Validar fechas end_date >= start_date
      if (endDate < startDate) {
        setError('La fecha objetivo de entrega no puede ser anterior a la fecha de inicio.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setStep(3);
      return;
    }

    if (!userProfileId) {
      setError('Error de seguridad: No se pudo resolver tu perfil de usuario en la base de datos de la cooperativa. Inserción denegada.');
      return;
    }

    setSaving(true);
    setError(null);

    const projectData: Omit<Project, 'id' | 'leader_name'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim(),
      estimatedEffortHours: Number(estimatedHours),
      status: 'Borrador', // Inicialmente ingresado en borrador
      leader_id: leaderId,
      sponsor: sponsor.trim(),
      responsible_func: responsibleFunc.trim(),
      responsible_exec: responsibleExec.trim(),
      area_solicitante: area.trim(),
      start_date: startDate,
      end_date: endDate,
      objective: objective.trim(),
      scope: scope.trim(),
      expected_result: expectedResult.trim(),
      execution_style: executionStyle,
      priority,
      problem_opportunity: problemOpportunity.trim() || undefined,
      justification: justification.trim() || undefined,
      strategic_alignment: strategicAlignment.trim() || undefined,
      expected_benefits: expectedBenefits.trim() || undefined,
      risk_of_not_doing: riskOfNotDoing.trim() || undefined,
      initial_phase: initialPhase,
      initial_health: initialHealth,
      bpmo_observations: bpmoObservations.trim() || undefined
    };

    try {
      await onSave(projectData);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar el proyecto en base de datos.');
    } finally {
      setSaving(false);
    }
  };

  const stepsTitle = ['Datos Generales', 'Caso de Negocio', 'Responsables y Fechas', 'Seguimiento', 'Confirmación'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top navbar indicator */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Cancelar y volver
        </button>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Progreso Wizard</span>
          <span className="text-sm font-black text-sky-600">{step} / 5: {stepsTitle[step - 1]}</span>
        </div>
      </div>

      {/* Progress Circles */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-slate-100 z-0" />
          <div 
            className="absolute left-[10%] top-4 h-0.5 bg-sky-600 transition-all duration-300 z-0" 
            style={{ width: `${((step - 1) / 4) * 80}%` }}
          />

          {stepsTitle.map((title, idx) => {
            const isCompleted = idx + 1 < step;
            const isActive = idx + 1 === step;
            return (
              <div key={title} className="flex flex-col items-center relative z-10 w-1/5">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white border-emerald-500' 
                    : isActive 
                      ? 'bg-sky-600 text-white border-sky-600 ring-4 ring-sky-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-[9px] mt-1.5 font-bold tracking-tight text-center hidden md:block ${
                  isActive ? 'text-sky-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Error Box */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">Atención</h4>
            <p className="text-xs font-semibold text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: GENERAL DATA */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800">Paso 1: Datos Generales de la Iniciativa</h2>
              <p className="text-xs text-slate-400">Identificación básica del proyecto de la cooperativa.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Código del Proyecto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: PRJ-056"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nombre del Proyecto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sistema Transaccional SPI Móvil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Área Solicitante <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tecnología, Riesgos, etc."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Enfoque del Proyecto
                </label>
                <select
                  value={executionStyle}
                  onChange={(e) => setExecutionStyle(e.target.value as ExecutionStyle)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Híbrido">Híbrido</option>
                  <option value="Ágil">Ágil</option>
                  <option value="Cascada">Cascada</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Prioridad Inicial
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'Alta' | 'Media' | 'Baja')}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Resumen Ejecutivo / Descripción
              </label>
              <textarea
                rows={4}
                placeholder="Describe brevemente la justificación general y el propósito del proyecto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
              />
            </div>
          </div>
        )}

        {/* STEP 2: BUSINESS CASE */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800">Paso 2: Caso de Negocio e Impacto Cooperativo</h2>
              <p className="text-xs text-slate-400">Justificación metodológica del proyecto de mejora continua.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Problema u Oportunidad Detectada
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Qué problema actual de la cooperativa se busca solucionar?"
                  value={problemOpportunity}
                  onChange={(e) => setProblemOpportunity(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Justificación del Proyecto
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Por qué es indispensable realizar este proyecto ahora?"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Objetivo Esperado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Reducir tiempos en un 30%"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Alcance <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Módulo SPI y Biometría de Socios"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Resultado Esperado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sistema homologado en producción"
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Alineación Estratégica
                </label>
                <input
                  type="text"
                  placeholder="Ej: Plan estratégico 2026 - Pilar Transformación"
                  value={strategicAlignment}
                  onChange={(e) => setStrategicAlignment(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Riesgo de No Ejecutar la Iniciativa
                </label>
                <input
                  type="text"
                  placeholder="Ej: Pérdida de cuota de mercado, sanciones, etc."
                  value={riskOfNotDoing}
                  onChange={(e) => setRiskOfNotDoing(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                beneficios institucionales, operativos y para socios
              </label>
              <textarea
                rows={3}
                placeholder="Especifica los beneficios proyectados para la cooperativa, su operación y los socios..."
                value={expectedBenefits}
                onChange={(e) => setExpectedBenefits(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-y"
              />
            </div>
          </div>
        )}

        {/* STEP 3: RESPONSIBLES & DATES */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800">Paso 3: Ficha de Responsables, Fechas y Esfuerzo</h2>
              <p className="text-xs text-slate-400">Asignación de roles y cronograma del proyecto.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Patrocinador (Sponsor Principal) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ing. Jorge Castro - Gerente General"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Líder del Proyecto (Profiles) <span className="text-red-500">*</span>
                </label>
                {loadingLeaders ? (
                  <div className="text-xs text-slate-450 py-2">Cargando perfiles de líderes...</div>
                ) : (
                  <select
                    value={leaderId}
                    onChange={(e) => setLeaderId(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                  >
                    {leaders.map(l => (
                      <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Responsable Funcional <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Lic. Mercedes Polo - Jefa de Operaciones"
                  value={responsibleFunc}
                  onChange={(e) => setResponsibleFunc(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Responsable Ejecutor Técnico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ing. Andrés Delgado - Mejora Continua"
                  value={responsibleExec}
                  onChange={(e) => setResponsibleExec(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Fecha de Inicio Planificada <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Fecha Objetivo de Entrega <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Esfuerzo Estimado (Horas) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej: 360"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INITIAL MONITORING */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800">Paso 4: Seguimiento e Indicadores Iniciales</h2>
              <p className="text-xs text-slate-400">Parámetros de arranque del proyecto.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Fase del Ciclo de Vida Inicial
                </label>
                <select
                  value={initialPhase}
                  onChange={(e) => setInitialPhase(e.target.value as any)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Iniciación">Iniciación</option>
                  <option value="Planificación">Planificación</option>
                  <option value="Ejecución">Ejecución</option>
                  <option value="Seguimiento">Seguimiento</option>
                  <option value="Cierre">Cierre</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Semáforo de Salud Inicial
                </label>
                <select
                  value={initialHealth}
                  onChange={(e) => setInitialHealth(e.target.value as any)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                >
                  <option value="Sin alertas">🟢 Sin alertas (Salud Buena)</option>
                  <option value="Con alertas">🟡 Con alertas (Advertencia)</option>
                  <option value="Crítica">🔴 Crítica (Retraso Crítico)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Observaciones BPMO / Mejora Continua
              </label>
              <textarea
                rows={4}
                placeholder="Añade recomendaciones, observaciones iniciales o indicaciones metodológicas..."
                value={bpmoObservations}
                onChange={(e) => setBpmoObservations(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-y"
              />
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5.5 h-5.5 text-emerald-500" />
                Paso 5: Resumen y Confirmación de Registro
              </h2>
              <p className="text-xs text-slate-400">Verifica los datos del proyecto antes de guardarlos en el servidor.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/60 space-y-5 text-xs">
              {/* Bloque 1 */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-200/50 pb-1 mb-2 uppercase tracking-wide text-[10px] text-sky-700">
                  1. Datos Generales
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                  <div><strong className="text-slate-400 font-medium">Código:</strong> <span className="font-bold">{code}</span></div>
                  <div><strong className="text-slate-400 font-medium">Nombre:</strong> <span className="font-semibold">{name}</span></div>
                  <div><strong className="text-slate-400 font-medium">Área:</strong> <span className="font-semibold">{area}</span></div>
                  <div><strong className="text-slate-400 font-medium">Enfoque:</strong> <span className="font-semibold">{executionStyle}</span></div>
                </div>
              </div>

              {/* Bloque 2 */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-200/50 pb-1 mb-2 uppercase tracking-wide text-[10px] text-sky-700">
                  2. Caso de Negocio y Objetivos
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div><strong className="text-slate-400 font-medium block">Objetivo:</strong> {objective}</div>
                  <div><strong className="text-slate-400 font-medium block">Alcance:</strong> {scope}</div>
                  <div><strong className="text-slate-400 font-medium block">Resultado:</strong> {expectedResult}</div>
                  {justification && <div><strong className="text-slate-400 font-medium block">Justificación:</strong> {justification}</div>}
                  {expectedBenefits && <div><strong className="text-slate-400 font-medium block">beneficios institucionales, operativos y para socios:</strong> {expectedBenefits}</div>}
                </div>
              </div>

              {/* Bloque 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 border-b border-slate-200/50 pb-1 mb-2 uppercase tracking-wide text-[10px] text-sky-700">
                    3. Ficha de Responsables
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <div><strong className="text-slate-400 font-medium">Sponsor:</strong> <span className="font-semibold">{sponsor}</span></div>
                    <div><strong className="text-slate-400 font-medium">Líder:</strong> <span className="font-semibold">{leaders.find(l => String(l.id) === String(leaderId))?.first_name} {leaders.find(l => String(l.id) === String(leaderId))?.last_name}</span></div>
                    <div><strong className="text-slate-400 font-medium">Funcional:</strong> <span className="font-semibold">{responsibleFunc}</span></div>
                    <div><strong className="text-slate-400 font-medium">Ejecutor:</strong> <span className="font-semibold">{responsibleExec}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 border-b border-slate-200/50 pb-1 mb-2 uppercase tracking-wide text-[10px] text-sky-700">
                    4. Fechas y Horas
                  </h4>
                  <div className="space-y-1 text-slate-700">
                    <div><strong className="text-slate-400 font-medium">Fecha Inicio:</strong> <span className="font-semibold">{startDate}</span></div>
                    <div><strong className="text-slate-400 font-medium">Fecha Objetivo:</strong> <span className="font-semibold">{endDate}</span></div>
                    <div><strong className="text-slate-400 font-medium">Esfuerzo:</strong> <span className="font-bold">{estimatedHours} horas</span></div>
                  </div>
                </div>
              </div>

              {/* Bloque 4 */}
              <div>
                <h4 className="font-bold text-slate-900 border-b border-slate-200/50 pb-1 mb-2 uppercase tracking-wide text-[10px] text-sky-700">
                  5. Seguimiento BPMO
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div><strong className="text-slate-400 font-medium">Fase Inicial:</strong> <span className="font-semibold">{initialPhase}</span></div>
                  <div><strong className="text-slate-400 font-medium">Salud Inicial:</strong> <span className="font-semibold">{initialHealth}</span></div>
                  {bpmoObservations && <div className="col-span-2"><strong className="text-slate-400 font-medium block">Observaciones:</strong> {bpmoObservations}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
          <button
            onClick={step === 1 ? onCancel : handleBack}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {step === 1 ? 'Cancelar' : 'Atrás'}
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Registrar Proyecto
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
