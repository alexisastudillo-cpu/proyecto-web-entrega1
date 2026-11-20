import React, { useState } from 'react';
import { Plus, Search, Users, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import { EmptyState } from '../components/common/EmptyState';

interface ProjectsListProps {
  onSelectProject: (projectId: string) => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ onSelectProject }) => {
  const { currentUser, projects, users, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreateProject = currentUser.role === 'ADMIN' || currentUser.role === 'LEADER';

  const visibleProjects =
    currentUser.role === 'ADMIN'
      ? projects
      : projects.filter((p) => p.memberIds.includes(currentUser.id));

  const filtered = visibleProjects.filter((p) => {
    const matchesText =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'TODOS' || p.status === statusFilter;
    return matchesText && matchesStatus;
  });

  const getLeaderName = (id: string) => users.find((u) => u.id === id)?.name || 'Desconocido';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proyectos</h1>
          <p className="text-sm text-slate-500">Gestiona iniciativas, equipos asignados y cronogramas</p>
        </div>

        {canCreateProject && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proyecto
          </button>
        )}
      </div>

      {/* Barra de búsqueda y filtro */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar proyecto por nombre o descripción..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Activos</option>
          <option value="PAUSADO">Pausados</option>
          <option value="FINALIZADO">Finalizados</option>
        </select>
      </div>

      {/* Grid de Proyectos */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No se encontraron proyectos"
          description="Intenta ajustar los términos de búsqueda o crea un nuevo proyecto."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const taskCount = tasks.filter((t) => t.projectId === project.id).length;
            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        project.status === 'ACTIVO'
                          ? 'bg-emerald-100 text-emerald-700'
                          : project.status === 'PAUSADO'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {project.status}
                    </span>
                    <span className="text-xs text-slate-400">{taskCount} tareas</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">{project.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {project.memberIds.length} integrantes
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {project.endDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Líder: {getLeaderName(project.leaderId)}</span>
                    <button
                      onClick={() => onSelectProject(project.id)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Ver detalle <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear Nuevo Proyecto">
        <ProjectForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};