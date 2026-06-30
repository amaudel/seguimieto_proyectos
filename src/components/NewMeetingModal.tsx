import React, { useState, useEffect } from 'react';
import { getLeaders } from '../services/projectsService';
import type { ProjectMeeting, EntityId } from '../types';
import { X, Users, AlertCircle } from 'lucide-react';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meetingData: Omit<ProjectMeeting, 'id' | 'attendees'>, attendeesProfileIds: string[]) => Promise<void>;
  projectId: EntityId;
}

interface LeaderProfile {
  id: string;
  name: string;
}

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectId
}) => {
  const [type, setType] = useState('Seguimiento ejecutivo');
  const [dateTime, setDateTime] = useState('');
  const [topics, setTopics] = useState('');
  const [decisions, setDecisions] = useState('');
  const [agreements, setAgreements] = useState('');
  const [impediments, setImpediments] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  const [leaders, setLeaders] = useState<LeaderProfile[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializar fecha y hora actual local en formato datetime-local
  const getLocalDateTimeString = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (isOpen) {
      // Cargar perfiles
      const fetchLeaders = async () => {
        setLoadingLeaders(true);
        try {
          const list = await getLeaders();
          const mapped = list.map(l => ({ id: l.id, name: `${l.first_name} ${l.last_name}` }));
          setLeaders(mapped);
        } catch (err) {
          console.error('Error fetching profiles in NewMeetingModal:', err);
        } finally {
          setLoadingLeaders(false);
        }
      };

      fetchLeaders();

      // Resetear campos
      setType('Seguimiento ejecutivo');
      setDateTime(getLocalDateTimeString());
      setTopics('');
      setDecisions('');
      setAgreements('');
      setImpediments('');
      setNotes('');
      setSelectedAttendees([]);
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleAttendee = (profileId: string) => {
    setSelectedAttendees(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validaciones Obligatorias
    if (!type) {
      setErrorMsg('Debe seleccionar el tipo de reunión de forma obligatoria.');
      return;
    }
    if (!dateTime) {
      setErrorMsg('Debe seleccionar la fecha y hora de la reunión.');
      return;
    }
    if (!topics.trim()) {
      setErrorMsg('Debe registrar los temas tratados en la reunión.');
      return;
    }
    if (selectedAttendees.length === 0) {
      setErrorMsg('Debe seleccionar al menos un asistente interno para la minuta.');
      return;
    }

    setSaving(true);
    try {
      // Formatear fecha y hora a ISO para Supabase
      const isoDateTime = new Date(dateTime).toISOString();

      await onSave({
        project_id: projectId,
        date_time: isoDateTime,
        type: type as any,
        topics: topics.trim(),
        decisions: decisions.trim() || '',
        agreements: agreements.trim() || '',
        impediments: impediments.trim() || '',
        notes: notes.trim() || ''
      }, selectedAttendees);
      
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error registrando la reunión en el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const meetingTypes = [
    'Seguimiento ejecutivo',
    'Comité',
    'Técnica',
    'Funcional',
    'Daily',
    'Planning',
    'Review / Demo',
    'Retrospectiva',
    'Cierre'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden transform transition-all scale-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase">Registrar Nueva Reunión / Minuta</h3>
              <p className="text-[10px] text-slate-300">Creación de bitácora y control de acuerdos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-xs text-red-700 font-medium leading-tight">{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de reunión */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tipo de Reunión *
              </label>
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all appearance-none cursor-pointer"
                >
                  {meetingTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Fecha y Hora *
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Temas Tratados */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Temas Tratados / Temario *
            </label>
            <textarea
              rows={3}
              placeholder="Escribe la agenda o puntos tratados en la reunión..."
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Acuerdos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Acuerdos Tomados (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Registrar acuerdos principales..."
                value={agreements}
                onChange={(e) => setAgreements(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
              />
            </div>

            {/* Decisiones */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Decisiones Clave (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Registrar definiciones o decisiones..."
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impedimentos */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Impedimentos / Bloqueos (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Registrar bloqueos identificados..."
                value={impediments}
                onChange={(e) => setImpediments(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
              />
            </div>

            {/* Notas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Notas Adicionales (Opcional)
              </label>
              <textarea
                rows={2}
                placeholder="Comentarios adicionales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-hidden transition-all resize-none"
              />
            </div>
          </div>

          {/* Asistentes Internos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Asistentes Internos (Selecciona al menos uno) *
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
              {loadingLeaders ? (
                <span className="text-xs text-slate-400">Cargando perfiles...</span>
              ) : (
                leaders.map(l => {
                  const isChecked = selectedAttendees.includes(l.id);
                  return (
                    <label 
                      key={l.id} 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md border cursor-pointer select-none transition-all text-xs ${
                        isChecked 
                          ? 'bg-sky-50 border-sky-200 text-sky-800 font-semibold' 
                          : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAttendee(l.id)}
                        className="rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                      <span>{l.name}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold uppercase transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Minuta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
