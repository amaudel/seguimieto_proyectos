import React, { useState } from 'react';
import type { Project, EntityId } from '../types';
import { 
  Search, 
  Filter, 
  Briefcase, 
  User, 
  Calendar, 
  Clock
} from 'lucide-react';


interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: EntityId) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [styleFilter, setStyleFilter] = useState<string>('todos');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(search.toLowerCase()) || 
      project.code.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.leader_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || project.status === statusFilter;
    const matchesStyle = styleFilter === 'todos' || project.execution_style === styleFilter;

    return matchesSearch && matchesStatus && matchesStyle;
  });

  // Calculate project progress mapping
  const getProjectProgress = (id: EntityId): number => {
    const idStr = String(id);
    if (idStr === '1' || idStr === '22222222-2222-2222-2222-222222222201') return 48;
    if (idStr === '2' || idStr === '22222222-2222-2222-2222-222222222202') return 62;
    if (idStr === '3' || idStr === '22222222-2222-2222-2222-222222222203') return 0;
    if (idStr === '4' || idStr === '22222222-2222-2222-2222-222222222204') return 20;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Listado de Proyectos</h1>
        <p className="text-sm text-slate-500">Administración y control de iniciativas de la cooperativa.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre, líder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-48">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs focus:outline-none w-full font-semibold text-slate-600 cursor-pointer"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Borrador">Borrador</option>
              <option value="En curso">En curso</option>
              <option value="En revisión">En revisión</option>
              <option value="Pausado">Pausado</option>
              <option value="Con retraso">Con retraso</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          {/* Execution Style Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-full sm:w-44">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="bg-transparent text-xs focus:outline-none w-full font-semibold text-slate-600 cursor-pointer"
            >
              <option value="todos">Todos los Enfoques</option>
              <option value="Cascada">Cascada</option>
              <option value="Ágil">Ágil</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Projects (Table style for Desktop, Cards for Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-5 py-3">Código</th>
                <th className="px-5 py-3">Proyecto</th>
                <th className="px-5 py-3">Responsables</th>
                <th className="px-5 py-3">Fechas</th>
                <th className="px-5 py-3">Enfoque</th>
                <th className="px-5 py-3">Esfuerzo Estimado</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3 text-right">Avance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => {
                  const progress = getProjectProgress(project.id);
                  return (
                    <tr
                      key={project.id}
                      onClick={() => onSelectProject(project.id)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-slate-400 whitespace-nowrap">{project.code}</td>
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-bold text-slate-900 hover:text-[#0284c7] text-sm leading-tight">{project.name}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{project.description}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <div className="font-medium">{project.leader_name.replace('Ing. ', '').replace('Lic. ', '').replace('Dra. ', '')}</div>
                            <div className="text-[10px] text-slate-400">Func: {project.responsible_func}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <div>{project.start_date}</div>
                            <div className="text-[10px] text-slate-400">Fin: {project.end_date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          project.execution_style === 'Ágil' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                            : project.execution_style === 'Cascada' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {project.execution_style}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-semibold text-slate-800">
                        {project.estimatedEffortHours.toLocaleString('es-ES')} h
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          project.status === 'En curso' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : project.status === 'Con retraso' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : project.status === 'Pausado' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : project.status === 'Borrador'
                                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right font-bold text-slate-800">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>{progress}%</span>
                          <div className="w-16 bg-slate-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                project.status === 'Con retraso' ? 'bg-red-500' : 'bg-[#0284c7]'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No se encontraron proyectos con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => {
              const progress = getProjectProgress(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="p-4 hover:bg-slate-50 cursor-pointer space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400">{project.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                      project.status === 'En curso' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : project.status === 'Con retraso' 
                          ? 'bg-red-50 text-red-700 border-red-100' 
                          : project.status === 'Pausado' 
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{project.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.leader_name}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{project.estimatedEffortHours.toLocaleString('es-ES')} h</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-semibold">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          project.status === 'Con retraso' ? 'bg-red-500' : 'bg-[#0284c7]'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">No se encontraron proyectos.</p>
          )}
        </div>
      </div>
    </div>
  );
};
