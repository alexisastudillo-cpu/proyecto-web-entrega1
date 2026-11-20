import React from 'react';
import { FolderKanban, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityBadge, TaskStatusBadge } from '../components/common/StatusBadge';

interface DashboardProps {
  onSelectProject: (projectId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectProject }) => {
  const { currentUser, projects, tasks, users } = useApp();
  const today = new Date().toISOString().split('T')[0];

  // Filtrar proyectos visibles según perfil
  const visibleProjects =
    currentUser.role === 'ADMIN'
      ? projects
      : projects.filter((p) => p.memberIds.includes(currentUser.id));

  const visibleProjectIds = new Set(visibleProjects.map((p) => p.id));

  // Si es MEMBER, prioriza sus tareas asignadas; si es ADMIN/LEADER, ve las de sus proyectos
  const relevantTasks =
    currentUser.role === 'MEMBER'
      ? tasks.filter((t) => t.assigneeId === currentUser.id)
      : tasks.filter((t) => visibleProjectIds.has(t.projectId));

  const pendingTasks = relevantTasks.filter((t) => t.status !== 'COMPLETADA');
  const overdueTasks = pendingTasks.filter((t) => t.dueDate < today);
  const completedTasks = relevantTasks.filter((t) => t.status === 'COMPLETADA');

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name || 'Sin asignar';
  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || 'Proyecto';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {currentUser.name}
        </h1>
        <p className="text-sm text-slate-500">
          Vista general como <span className="font-semibold text-indigo-600">{currentUser.role}</span> — Fecha de corte: {today}
        </p>
      </div>

      {/* Tarjetas de KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Proyectos Activos</span>
            <FolderKanban className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{visibleProjects.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Tareas Pendientes</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{pendingTasks.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-red-200 bg-red-50/30 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-red-700">Tareas Vencidas</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700 mt-2">{overdueTasks.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Completadas</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{completedTasks.length}</p>
        </div>
      </div>

      {/* Sección de Tareas Vencidas y Próximas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-red-50/40">
            <h2 className="font-semibold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Atención Requerida (Tareas Vencidas)
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {overdueTasks.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {overdueTasks.length === 0 ? (
              <p className="p-6 text-sm text-slate-500 text-center">No tienes tareas vencidas.</p>
            ) : (
              overdueTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {getProjectName(task.projectId)} • Resp: {getUserName(task.assigneeId)}
                    </p>
                    <p className="text-xs font-medium text-red-600 mt-1">Venció el: {task.dueDate}</p>
                  </div>
                  <button
                    onClick={() => onSelectProject(task.projectId)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 shrink-0"
                  >
                    Ir <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resumen de Proyectos */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Avance por Proyecto</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {visibleProjects.map((proj) => {
              const projTasks = tasks.filter((t) => t.projectId === proj.id);
              const done = projTasks.filter((t) => t.status === 'COMPLETADA').length;
              const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="p-4 hover:bg-slate-50 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-sm text-slate-900">{proj.name}</span>
                    <span className="text-xs font-semibold text-slate-600">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                    <span>{done} de {projTasks.length} tareas completadas</span>
                    <span>Entrega: {proj.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};