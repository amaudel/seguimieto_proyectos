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
import { NewProject } from './components/NewProject';
import type { EntityId, Project, ProjectAdvance, ProjectActivity, ProjectMeeting, ProjectCommitment, TimeLog, ProjectRisk } from './types';
import {
  getProjects,
  getAdvances,
  getActivities,
  getMeetings,
  getCommitments,
  getTimeLogs,
  getRisks,
  createProject
} from './services/projectsService';
import { 
  LayoutDashboard, 
  Briefcase, 
  Menu, 
  X, 
  Building2,
  LogOut,
  Database
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { Login } from './components/Login';


function App() {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(isSupabaseConfigured);
  const [view, setView] = useState<'dashboard' | 'projects' | 'detail' | 'new-project'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<EntityId | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  // Estados dinámicos para datos con fallback a mock inicial en memoria
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [advances, setAdvances] = useState<ProjectAdvance[]>(mockAdvances);
  const [activities, setActivities] = useState<ProjectActivity[]>(mockActivities);
  const [meetings, setMeetings] = useState<ProjectMeeting[]>(mockMeetings);
  const [commitments, setCommitments] = useState<ProjectCommitment[]>(mockCommitments);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [risks, setRisks] = useState<ProjectRisk[]>(mockRisks);

  // Escuchar sesión de Supabase Auth
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setSession({ user: { email: 'andres.delgado@coop.fi' } });
      setUserProfileId('11111111-1111-1111-1111-111111111101');
      setLoadingSession(false);
      return;
    }

    const fetchUserProfileId = async (authUserId: string) => {
      try {
        const { data, error } = await supabase!
          .from('profiles')
          .select('id')
          .eq('auth_user_id', authUserId)
          .single();
        if (error) throw error;
        if (data) {
          setUserProfileId(data.id);
        }
      } catch (err) {
        console.error('Error resolviendo profile_id del usuario administrador:', err);
        setUserProfileId(null);
      }
    };

    // Cargar sesión inicial
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setLoadingSession(false);
      if (initialSession?.user) {
        fetchUserProfileId(initialSession.user.id);
      }
    });

    // Suscribirse a cambios
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoadingSession(false);
      if (currentSession?.user) {
        fetchUserProfileId(currentSession.user.id);
      } else {
        setUserProfileId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Carga asíncrona de datos desde Supabase con fallback automático
  useEffect(() => {
    // Si Supabase está configurado pero no hay sesión, no cargar datos de base de datos
    if (isSupabaseConfigured && !session) return;

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
  }, [session]);

  // Find active project if detail view
  const activeProject = projects.find(p => String(p.id) === String(selectedProjectId));

  const handleSelectProject = (projectId: EntityId) => {
    setSelectedProjectId(projectId);
    setView('detail');
    setIsSidebarOpen(false);
  };

  const handleNavigate = (newView: 'dashboard' | 'projects' | 'detail' | 'new-project') => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  const handleSaveNewProject = async (projectData: Omit<Project, 'id' | 'leader_name'>) => {
    if (!userProfileId) {
      throw new Error('No se ha podido resolver tu identificador de perfil (profile_id) en el sistema. Creación bloqueada.');
    }
    try {
      const newProj = await createProject(projectData, userProfileId);
      setProjects(prev => [newProj, ...prev]);
      setView('projects');
    } catch (err) {
      console.error('Error guardando el nuevo proyecto:', err);
      throw err;
    }
  };

  // Pantalla de carga mientras se verifica sesión
  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-slate-600 font-semibold text-sm">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  // Si Supabase está configurado pero no hay sesión iniciada, mostrar únicamente el Login
  if (isSupabaseConfigured && !session) {
    return <Login onLoginSuccess={() => setView('dashboard')} />;
  }

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
        <div className="p-4 border-t border-sky-900 space-y-3">
          <div className="flex items-center gap-3 bg-sky-950/40 p-3 rounded-lg border border-sky-900/40">
            <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {session?.user?.email ? session.user.email.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs block text-white truncate">
                {session?.user?.email || 'Andrés Delgado'}
              </span>
              <span className="text-[10px] text-sky-300 font-medium block">
                {isSupabaseConfigured ? 'Admin Mejora Continua' : 'BPMO Cooperativa'}
              </span>
            </div>
          </div>

          {isSupabaseConfigured && session && (
            <button
              onClick={() => supabase?.auth.signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-sky-800/60 rounded-lg text-xs font-semibold tracking-wide text-sky-300 hover:bg-sky-900/40 hover:text-white transition-all duration-200 ease-in-out cursor-pointer bg-sky-950/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          )}

          <div className="text-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
            Versión 1.2.0 (Fase 4D)
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
        
        {/* Banner de Origen de Datos (Fase 4D) */}
        <div className={`mb-4 px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-between border ${
          isSupabaseConfigured 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <Database className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span>
              {isSupabaseConfigured 
                ? 'Conexión activa a base de datos de producción (Supabase)' 
                : 'Modo Offline: Operando con base de datos local (Mock)'}
            </span>
          </div>
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-75">
            {isSupabaseConfigured ? 'Producción' : 'Offline / Demo'}
          </span>
        </div>
        
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
            risks={risks}
            onCreateProject={() => setView('new-project')}
          />
        )}

        {view === 'new-project' && (
          <NewProject 
            onSave={handleSaveNewProject}
            onCancel={() => setView('projects')}
            userProfileId={userProfileId}
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
            userProfileId={userProfileId}
            adminName={session?.user?.email || 'Andrés Delgado'}
            onAddAdvance={(newAdv) => setAdvances(prev => [...prev, newAdv])}
            onAddRisk={(newRisk) => setRisks(prev => [...prev, newRisk])}
            onAddCommitment={(newComm) => setCommitments(prev => [...prev, newComm])}
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
