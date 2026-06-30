import React, { useState, useEffect } from 'react';
import type { ProjectActivity, EntityId, KanbanStatus, ActivityPriority } from '../types';
import { getLeaders } from '../services/projectsService';
import { X, Calendar, FileText, Shield, AlertCircle, Save, Layers, Clock } from 'lucide-react';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityData: Omit<ProjectActivity, 'id' | 'assignee'>) => Promise<void>;
  projectId: EntityId;
  adminName: string;
}

export const NewActivityModal: React.FC<NewActivityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectId,
  adminName
}) => {
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ActivityPriority>('Media');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [estimatedHours, setEstimatedHours] = useState('0');
  const [notes, setNotes] = useState('');

  const [leaders, setLeaders] = useState<{ id: string; first_name: string; last_name: string; }[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      async function loadLeadersData() {
        try {
          setLoadingLeaders(true);
          const data = await getLeaders();
          setLeaders(data);
          if (data.length > 0) {
            setAssigneeId(data[0].id);
          }
        } catch (err) {
          console.error('Error cargando líderes en actividades:', err);
        } finally {
          setLoadingLeaders(false);
        }
      }
      loadLeadersData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Por favor, ingresa el nombre de la actividad.');
      return;
    }

    if (!assigneeId) {
      setError('Por favor, selecciona un responsable asignado (Obligatorio).');
      return;
    }

    if (!dueDate) {
      setError('Por favor, selecciona una fecha límite/objetivo (Obligatorio).');
      return;
    }

    const hours = parseFloat(estimatedHours);
    if (isNaN(hours) || hours < 0) {
      setError('Las horas estimadas deben ser un número mayor o igual a cero.');
      return;
    }

    setSaving(true);

    const activityData: Omit<ProjectActivity, 'id' | 'assignee'> = {
      project_id: projectId,
      name: name.trim(),
      description: description.trim(),
      type: 'General',
      assignee_id: assigneeId,
      priority: priority,
      kanban_status: 'Por hacer' as KanbanStatus,
      start_date: getTodayDateString(),
      due_date: dueDate,
      estimated_hours: hours,
      actual_hours: 0,
      progress_pct: 0,
      acceptance_criteria: '',
      notes: notes.trim()
    };

    try {
      await onSave(activityData);
      // Resetear campos
      setName('');
      setDescription('');
      setPriority('Media');
      setDueDate(getTodayDateString());
      setEstimatedHours('0');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la actividad.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Registrar Nueva Actividad
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">
                Planificación del Backlog y Kanban
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Activity Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nombre de la Actividad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ej. Redacción de requerimientos de APIs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Descripción de la Actividad <span className="text-slate-400">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Detalla las especificaciones de esta tarea o entregable..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Responsable (Obligatorio) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Responsable Asignado <span className="text-red-500">*</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium cursor-pointer"
                disabled={loadingLeaders}
              >
                {loadingLeaders ? (
                  <option value="">Cargando catálogo...</option>
                ) : (
                  <>
                    <option value="">-- Selecciona Responsable --</option>
                    {leaders.map(l => (
                      <option key={l.id} value={l.id}>
                        {l.first_name} {l.last_name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Fecha Límite (Obligatoria) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Fecha Objetivo / Límite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prioridad */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Prioridad de la Tarea <span className="text-red-500">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as ActivityPriority)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium cursor-pointer"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>

            {/* Horas Estimadas */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Horas Estimadas <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ej. 12"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Notas Adicionales <span className="text-slate-400">(Opcional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Anotaciones extra para el desarrollo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-none"
            />
          </div>

          {/* Audit Panel */}
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] text-slate-500 font-semibold">
              Registrado por administrador: <strong className="text-slate-700">{adminName}</strong>
            </span>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loadingLeaders}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar Actividad'}
          </button>
        </div>
      </div>
    </div>
  );
};
