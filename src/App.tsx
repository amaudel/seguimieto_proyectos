import { useState, useEffect } from 'react';
import { 
  mockProjects, 
  mockAdvances, 
  mockActivities, 
  mockMeetings, 
  mockCommitments, 
  mockTimeLogs, 
  mockRisks 
} from './mockData';
import { Dashboard } from './components/Dashboard';
import { ProjectList } from './components/ProjectList';
import { ProjectDetail } from './components/ProjectDetail';
import type { EntityId, Project, ProjectAdvance, ProjectActivity, ProjectMeeting, ProjectCommitment, TimeLog, ProjectRisk } from './types';
import {
  getProjects,
  getAdvances,
  getActivities,
  getMeetings,
  getCommitments,
  getTimeLogs,
  getRisks
} from './services/projectsService';
import { 
  LayoutDashboard, 
  Briefcase, 
  Menu, 
  X, 
  Building2
} from 'lucide-react';


function App() {
  const [view, setView] = useState<'dashboard' | 'projects' | 'detail'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<EntityId | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estados dinámicos para datos con fallback a mock inicial en memoria
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [advances, setAdvances] = useState<ProjectAdvance[]>(mockAdvances);
  const [activities, setActivities] = useState<ProjectActivity[]>(mockActivities);
  const [meetings, setMeetings] = useState<ProjectMeeting[]>(mockMeetings);
  const [commitments, setCommitments] = useState<ProjectCommitment[]>(mockCommitments);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [risks, setRisks] = useState<ProjectRisk[]>(mockRisks);

  // Carga asíncrona de datos desde Supabase con fallback automático
  useEffect(() => {
    async function loadData() {
      try {
        const [
          projs,
          advs,
          acts,
          meets,
          comms,
          times,
          rsks
        ] = await Promise.all([
          getProjects(),
          getAdvances(),
          getActivities(),
          getMeetings(),
          getCommitments(),
          getTimeLogs(),
          getRisks()
        ]);
        
        setProjects(projs);
        setAdvances(advs);
        setActivities(acts);
        setMeetings(meets);
        setCommitments(comms);
        setTimeLogs(times);
        setRisks(rsks);
      } catch (err) {
        console.error("Error cargando datos de Supabase. Fallback activo.", err);
      }
    }
    loadData();
  }, []);

  // Find active project if detail view
  const activeProject = projects.find(p => String(p.id) === String(selectedProjectId));

  const handleSelectProject = (projectId: EntityId) => {
    setSelectedProjectId(projectId);
    setView('detail');
    setIsSidebarOpen(false);
  };

  const handleNavigate = (newView: 'dashboard' | 'projects' | 'detail') => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 antialiased font-sans">
      
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden bg-[#0c4a6e] text-white px-4 py-3 flex items-center justify-between shadow-md z-40 shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-400" />
          <span className="font-bold text-sm tracking-wide">COOPAC - Proyectos</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:text-sky-200 transition-colors p-1"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-[#0c4a6e] text-slate-100 flex flex-col justify-between shrink-0 z-50 shadow-lg md:shadow-none
      `}>
        {/* Top brand header */}
        <div>
          <div className="p-6 border-b border-sky-900 hidden md:flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-sky-400" />
            <div>
              <span className="font-extrabold text-sm block tracking-wide text-white">COOPAC</span>
              <span className="text-[10px] text-sky-300 font-semibold block uppercase">Seguimiento</span>
            </div>
          </div>

          {/* Menus */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                view === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-sky-900/40 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              Dashboard Ejecutivo
            </button>
            
            <button
              onClick={() => handleNavigate('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                view === 'projects' || view === 'detail'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-sky-900/40 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              Listado de Proyectos
            </button>
          </nav>
        </div>

        {/* User profile / Footer area */}
        <div className="p-4 border-t border-sky-900">
          <div className="flex items-center gap-3 bg-sky-950/40 p-3 rounded-lg border border-sky-900/40">
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-bold text-xs text-white">
              AD
            </div>
            <div>
              <span className="font-semibold text-xs block text-white">Andrés Delgado</span>
              <span className="text-[10px] text-sky-300 font-medium block">BPMO Cooperativa</span>
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
            Versión 1.0.0 (Fase 1 Mock)
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
        />
      )}

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        
        {/* Render View conditionally */}
        {view === 'dashboard' && (
          <Dashboard 
            projects={projects}
            activities={activities}
            commitments={commitments}
            risks={risks}
            meetings={meetings}
            onSelectProject={handleSelectProject}
            onNavigate={handleNavigate}
          />
        )}

        {view === 'projects' && (
          <ProjectList 
            projects={projects}
            onSelectProject={handleSelectProject}
          />
        )}

        {view === 'detail' && activeProject ? (
          <ProjectDetail 
            project={activeProject}
            advances={advances}
            activities={activities}
            meetings={meetings}
            commitments={commitments}
            timeLogs={timeLogs}
            risks={risks}
            onBack={() => setView('projects')}
          />
        ) : view === 'detail' ? (
          <div className="text-center py-12">
            <p className="text-slate-400 font-semibold">Proyecto no encontrado.</p>
            <button 
              onClick={() => setView('projects')}
              className="mt-4 bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2 rounded-lg font-semibold text-xs"
            >
              Volver al listado
            </button>
          </div>
        ) : null}

      </main>

    </div>
  );
}

export default App;
