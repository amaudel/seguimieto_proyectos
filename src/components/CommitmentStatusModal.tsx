import React, { useState } from 'react';
import type { CommitmentStatus } from '../types';
import { X, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

interface CommitmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (finalNotes: string) => Promise<void>;
  status: CommitmentStatus | null;
  currentNotes: string;
}

export const CommitmentStatusModal: React.FC<CommitmentStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  status,
  currentNotes
}) => {
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !status) return null;

  const isVencido = status === 'Vencido';
  const isCumplido = status === 'Cumplido';

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedNote = newNote.trim();

    if (isVencido && !trimmedNote) {
      setError('Debes ingresar obligatoriamente una nota explicando el motivo del retraso o vencimiento.');
      return;
    }

    setSaving(true);

    let finalNotes = currentNotes;
    if (trimmedNote) {
      const prefix = currentNotes ? '\n' : '';
      finalNotes = `${currentNotes}${prefix}[${getTodayDateString()} - ${status}]: ${trimmedNote}`;
    }

    try {
      await onConfirm(finalNotes);
      setNewNote('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del compromiso.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {isCumplido ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                Confirmar Cambio a {status}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">
                Gobernanza y Control de Acuerdos
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex gap-2 items-start">
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          )}

          <div className="text-xs text-slate-600 leading-relaxed font-medium">
            {isCumplido && (
              <p>
                Vas a marcar este compromiso como <strong className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">Cumplido</strong>.
                Puedes agregar una nota u observación final sobre la entrega (opcional).
              </p>
            )}
            {isVencido && (
              <p>
                Vas a marcar este compromiso como <strong className="text-red-700 bg-red-50 px-1 py-0.5 rounded">Vencido</strong>.
                Esta acción requiere que expliques de forma obligatoria los motivos del incumplimiento del cronograma.
              </p>
            )}
          </div>

          {/* Text Area for Note */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Observación / Comentario {isVencido ? <span className="text-red-500">*</span> : <span className="text-slate-400">(Opcional)</span>}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                placeholder={isVencido ? "Explica detalladamente por qué se venció el compromiso..." : "Añade notas del cierre, enlace a entregable, etc."}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium resize-none"
              />
            </div>
          </div>

          {currentNotes && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Historial de Notas Previas</span>
              <p className="text-[10px] text-slate-500 leading-tight font-semibold max-h-24 overflow-y-auto whitespace-pre-wrap">
                {currentNotes}
              </p>
            </div>
          )}
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
            className={`flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              isCumplido ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};
