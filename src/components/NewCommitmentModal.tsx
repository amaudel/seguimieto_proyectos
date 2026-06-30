import React, { useState, useEffect } from 'react';
import type { ProjectCommitment, EntityId, CommitmentStatus } from '../types';
import { getLeaders } from '../services/projectsService';
import { X, Calendar, FileText, Shield, AlertCircle, Save, UserCheck } from 'lucide-react';

interface NewCommitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (commitmentData: Omit<ProjectCommitment, 'id' | 'assignee'>) => Promise<void>;
  projectId: EntityId;
  adminName: string;
}

export const NewCommitmentModal: React.FC<NewCommitmentModalProps> = ({
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

  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
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
          console.error('Error cargando líderes en compromisos:', err);
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

    if (!description.trim()) {
      setError('Por favor, ingresa la descripción del compromiso.');
      return;
    }

    if (!assigneeId) {
      setError('Por favor, selecciona un responsable asignado.');
      return;
    }

    if (!dueDate) {
      setError('Por favor, selecciona una fecha límite.');
      return;
    }

    // Validar que due_date no sea anterior a hoy
    const todayStr = getTodayDateString();
    if (dueDate < todayStr) {
      setError('La fecha límite no puede ser anterior a la fecha actual.');
      return;
    }

    setSaving(true);
    
    const commitmentData: Omit<ProjectCommitment, 'id' | 'assignee'> = {
      project_id: projectId,
      meeting_id: null,
      description: description.trim(),
      assignee_id: assigneeId,
      due_date: dueDate,
      status: 'Pendiente' as CommitmentStatus,
      notes: notes.trim(),
      evidence: '' // No se requiere evidencias en esta fase
    };

    try {
      await onSave(commitmentData);
      // Limpiar campos
      setDescription('');
      setNotes('');
      setDueDate(getTodayDateString());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el compromiso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Registrar Compromiso de Proyecto</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Acuerdos y Compromisos Directos</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-r-lg flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Row 1: Responsable y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Responsable Asignado <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {loadingLeaders ? (
                  <div className="pl-9 py-2 text-xs text-slate-400">Cargando líderes...</div>
                ) : (
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold cursor-pointer"
                  >
                    {leaders.map(l => (
                      <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Fecha Límite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Descripción */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Descripción del Compromiso <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Escribe claramente en qué consiste el compromiso, su entregable y fecha de cuadre..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
              />
            </div>
          </div>

          {/* Row 3: Notas / Observación BPMO */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Notas / Observaciones BPMO
            </label>
            <textarea
              rows={3}
              placeholder="Notas u observaciones de gobernanza adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
            />
          </div>

          {/* Row 4: Estado Inicial */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Estado Inicial
              </label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 font-bold select-none">
                Pendiente
              </div>
            </div>
          </div>

          {/* Auditor Panel */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-600" />
              <div>
                <span className="font-bold text-slate-700 block">Autor de Auditoría</span>
                <span className="font-semibold text-slate-500">{adminName}</span>
              </div>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider bg-slate-200/50 px-2 py-0.5 rounded text-slate-600">
              No Editable
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
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Guardar Compromiso
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
