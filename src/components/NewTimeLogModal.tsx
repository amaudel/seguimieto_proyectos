import React, { useState, useEffect } from 'react';
import { getLeaders } from '../services/projectsService';
import type { TimeLog, ProjectActivity, EntityId } from '../types';
import { X, Clock, AlertCircle } from 'lucide-react';

interface NewTimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logData: Omit<TimeLog, 'id' | 'user' | 'activity_name' | 'estimated_hours'>) => Promise<void>;
  projectId: EntityId;
  activities: ProjectActivity[];
}

interface LeaderProfile {
  id: string;
  name: string;
}

export const NewTimeLogModal: React.FC<NewTimeLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectId,
  activities
}) => {
  const [activityId, setActivityId] = useState('');
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [actualHours, setActualHours] = useState('');
  const [type, setType] = useState('Desarrollo');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const [leaders, setLeaders] = useState<LeaderProfile[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Obtener fecha de hoy en formato local para validación
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      // Cargar perfiles reales
      const fetchLeaders = async () => {
        setLoadingLeaders(true);
        try {
          const list = await getLeaders();
          const mapped = list.map(l => ({ id: l.id, name: `${l.first_name} ${l.last_name}` }));
          setLeaders(mapped);
          if (mapped.length > 0) {
            setUserId(mapped[0].id);
          }
        } catch (err) {
          console.error('Error fetching profiles in NewTimeLogModal:', err);
        } finally {
          setLoadingLeaders(false);
        }
      };

      fetchLeaders();

      // Inicializar campos
      setActivityId(activities.length > 0 ? String(activities[0].id) : '');
      setDate(new Date().toISOString().split('T')[0]);
      setActualHours('');
      setType('Desarrollo');
      setDescription('');
      setNotes('');
      setErrorMsg(null);
    }
  }, [isOpen, activities]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones Obligatorias
    if (!activityId) {
      setErrorMsg('Debe seleccionar una actividad del backlog de forma obligatoria.');
      return;
    }
    if (!userId) {
      setErrorMsg('Debe seleccionar el colaborador responsable de forma obligatoria.');
      return;
    }
    if (!date) {
      setErrorMsg('Debe especificar la fecha de realización de forma obligatoria.');
      return;
    }
    if (date > todayStr) {
      setErrorMsg('No se permite registrar horas de esfuerzo con fecha futura.');
      return;
    }
    if (!type) {
      setErrorMsg('Debe seleccionar el tipo de esfuerzo de forma obligatoria.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Debe ingresar la descripción detallada del trabajo realizado.');
      return;
    }

    const hoursNum = Number(actualHours);
    if (!actualHours || isNaN(hoursNum) || hoursNum <= 0) {
      setErrorMsg('Debe registrar una cantidad de horas válida mayor a cero.');
      return;
    }
    if (!Number.isInteger(hoursNum)) {
      setErrorMsg('Debe ingresar una cantidad entera de horas. No se permiten decimales.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        project_id: projectId,
        activity_id: activityId,
        user_id: userId,
        date,
        actual_hours: hoursNum,
        type,
        description: description.trim(),
        notes: notes.trim() || ''
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error guardando el log de esfuerzo en el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const effortTypes = [
    'Desarrollo',
    'Diseño',
    'Pruebas',
    'Gestión',
    'Reunión',
    'Análisis',
    'Documentación',
    'Soporte'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">Registrar Tiempos de Esfuerzo</h3>
              <p className="text-[10px] text-slate-300">Imputación de horas a tareas del backlog</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 font-medium leading-tight">{errorMsg}</span>
            </div>
          )}

          {activities.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 leading-tight">
                <strong>Atención:</strong> Este proyecto no cuenta con actividades en su backlog. Debes crear al menos una actividad en la pestaña <strong>Actividades</strong> antes de poder registrar horas de trabajo.
              </div>
            </div>
          )}

          {/* Actividad */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Actividad Asociada *
            </label>
            <div className="relative">
              <select
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                disabled={activities.length === 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all appearance-none cursor-pointer disabled:opacity-50"
              >
                <option value="">-- Selecciona una actividad del backlog --</option>
                {activities.map(act => (
                  <option key={String(act.id)} value={String(act.id)}>
                    {act.name} ({act.kanban_status})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Responsable */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Colaborador / Responsable *
              </label>
              <div className="relative">
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loadingLeaders}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all appearance-none cursor-pointer"
                >
                  {loadingLeaders ? (
                    <option>Cargando perfiles...</option>
                  ) : (
                    leaders.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))
                  )}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fecha del esfuerzo *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  max={todayStr}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Horas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Horas Reales (Entero mayor a 0) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Ej. 8"
                value={actualHours}
                onChange={(e) => setActualHours(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all"
              />
            </div>

            {/* Tipo de Esfuerzo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tipo de esfuerzo *
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all appearance-none cursor-pointer"
                >
                  {effortTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Descripción del trabajo realizado *
            </label>
            <textarea
              rows={2}
              placeholder="Detalla qué tareas se completaron en esta sesión..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
            />
          </div>

          {/* Observación BPMO */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Observaciones / Notas BPMO (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Notas del proyecto o comentarios de la oficina de proyectos..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || activities.length === 0}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando...' : 'Guardar Tiempo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
