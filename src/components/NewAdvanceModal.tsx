import React, { useState } from 'react';
import type { ProjectAdvance, EntityId } from '../types';
import { X, Calendar, Percent, FileText, CheckSquare, Shield, AlertCircle, Save } from 'lucide-react';

interface NewAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (advanceData: Omit<ProjectAdvance, 'id' | 'reporter'>) => Promise<void>;
  projectId: EntityId;
  adminName: string;
}

export const NewAdvanceModal: React.FC<NewAdvanceModalProps> = ({
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

  const [date, setDate] = useState(getTodayDateString());
  const [progressPct, setProgressPct] = useState('');
  const [summary, setSummary] = useState('');
  const [completedTasks, setCompletedTasks] = useState('');
  const [valueDelivered, setValueDelivered] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [notes, setNotes] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError('Por favor, selecciona una fecha para el avance.');
      return;
    }

    if (!progressPct) {
      setError('Por favor, ingresa el porcentaje de avance.');
      return;
    }

    const pctNum = Number(progressPct);
    if (isNaN(pctNum) || pctNum < 0 || pctNum > 100) {
      setError('El porcentaje de avance debe ser un número entero entre 0 y 100.');
      return;
    }

    if (!summary.trim()) {
      setError('Por favor, ingresa un resumen del avance.');
      return;
    }

    setSaving(true);
    
    const advanceData: Omit<ProjectAdvance, 'id' | 'reporter'> = {
      project_id: projectId,
      date,
      progress_pct: pctNum,
      summary: summary.trim(),
      completed_tasks: completedTasks.trim(),
      value_delivered: valueDelivered.trim(),
      next_steps: nextSteps.trim(),
      notes: notes.trim(),
      evidence: '' // No se requiere evidencias en esta fase
    };

    try {
      await onSave(advanceData);
      // Limpiar campos
      setProgressPct('');
      setSummary('');
      setCompletedTasks('');
      setValueDelivered('');
      setNextSteps('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el reporte de avance.');
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
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Registrar Avance del Proyecto</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Gobernanza y Bitácora de Proyecto</p>
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

          {/* Row 1: Fecha y Porcentaje */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Fecha del Avance <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Porcentaje de Avance (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ej: 45"
                  value={progressPct}
                  onChange={(e) => {
                    const cleanVal = e.target.value.replace(/[^0-9]/g, '');
                    // Asegurar que no sea mayor a 100
                    if (Number(cleanVal) <= 100) {
                      setProgressPct(cleanVal);
                    }
                  }}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Resumen / Summary */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Resumen del Avance / Logro Principal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                placeholder="Describe brevemente el principal hito alcanzado en este reporte..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
              />
            </div>
          </div>

          {/* Row 3: Logros alcanzados */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Logros Alcanzados / Tareas Completadas
            </label>
            <div className="relative">
              <CheckSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={2}
                placeholder="Detalla las actividades y tareas específicas que fueron finalizadas..."
                value={completedTasks}
                onChange={(e) => setCompletedTasks(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
              />
            </div>
          </div>

          {/* Row 4: Valor entregado */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Valor Entregado
            </label>
            <textarea
              rows={2}
              placeholder="¿Qué beneficios operativos o ventajas aporta este avance a los socios y la cooperativa?"
              value={valueDelivered}
              onChange={(e) => setValueDelivered(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
            />
          </div>

          {/* Row 5: Próximos pasos */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Próximos Pasos
            </label>
            <textarea
              rows={2}
              placeholder="¿Cuáles son las siguientes actividades críticas en el plan de trabajo?"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
            />
          </div>

          {/* Row 6: Dificultades / Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Dificultades / Observaciones BPMO
            </label>
            <textarea
              rows={2}
              placeholder="Indica si existen dificultades, desviaciones o bloqueos metodológicos..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-y"
            />
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
                <Save className="w-4 h-4" /> Guardar Avance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
