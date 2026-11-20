import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  UserMinus,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus } from '../types';
import { PriorityBadge, TaskStatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/forms/TaskForm';
import { ProjectForm } from '../components/forms/ProjectForm';
import { EmptyState } from '../components/common/EmptyState';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  const {
    currentUser,
    projects,
    tasks,
    users,
    changeTaskStatus,
    deleteTask,
    assignMemberToProject,
    removeMemberFromProject,
  } = useApp();

  const project = projects.find((p) => p.id === projectId);

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [priorityFilter, setPriorityFilter] = useState<string>('TODOS');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('TODOS');
  const [dueDateFilter, setDueDateFilter] = useState<string>('');

  // Estados de modales
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [selectedNewMember, setSelectedNewMember] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  if (!project) {
    return (
      <EmptyState
        title="Proyecto no encontrado"
        description="El proyecto solicitado no existe o fue eliminado."
        action={
          <button onClick={onBack} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            Volver a proyectos
          </button>
        }
      />
    );
  }

  const canManageProject =
    currentUser.role === 'ADMIN' ||
    (currentUser.role === 'LEADER' && project.leaderId === currentUser.id);

  const projectMembers = users.filter((u) => project.memberIds.includes(u.id));
  const availableUsersToAdd = users.filter((u) => !project.memberIds.includes(u.id));

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  // Aplicación combinada de los 4 filtros exigidos en el documento
  const filteredTasks = projectTasks.filter((task) => {
    if (statusFilter !== 'TODOS' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'TODOS' && task.priority !== priorityFilter) return false;
    if (assigneeFilter !== 'TODOS' && task.assigneeId !== assigneeFilter) return false;
    if (dueDateFilter && task.dueDate > dueDateFilter) return false;
    return true;
  });

  const resetFilters = () => {
    setStatusFilter('TODOS');
    setPriorityFilter('TODOS');
    setAssigneeFilter('TODOS');
    setDueDateFilter('');
  };

  const handleAddMember = async () => {
    if (!selectedNewMember) return;
    await assignMemberToProject(project.id, selectedNewMember);
    setSelectedNewMember('');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Cabecera del Proyecto */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a proyectos
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                {project.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">{project.description}</p>
            <p className="text-xs text-slate-400 mt-2">
              Vigencia: {project.startDate} al {project.endDate}
            </p>
          </div>

          {canManageProject && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditProjectOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" /> Editar Proyecto
              </button>
              <button
                onClick={() => {
                  setEditingTask(undefined);
                  setIsTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Nueva Tarea
              </button>
            </div>
          )}
        </div>

        {/* Gestión de Integrantes del Proyecto */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Equipo Asignado ({projectMembers.length})
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {projectMembers.map((member) => (
              <div
                key={member.id}
                className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                  {member.avatar}
                </span>
                <span>{member.name}</span>
                {canManageProject && member.id !== project.leaderId && (
                  <button
                    onClick={() => removeMemberFromProject(project.id, member.id)}
                    title="Remover integrante"
                    className="text-slate-400 hover:text-red-600 ml-1"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}

            {canManageProject && availableUsersToAdd.length > 0 && (
              <div className="flex items-center gap-1.5 ml-2">
                <select
                  value={selectedNewMember}
                  onChange={(e) => setSelectedNewMember(e.target.value)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
                >
                  <option value="">+ Asignar integrante...</option>
                  {availableUsersToAdd.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedNewMember}
                  className="p-1.5 bg-slate-800 text-white rounded-lg disabled:opacity-40 hover:bg-slate-700"
                  title="Confirmar asignación"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel de Filtros de Tareas */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filtrar Tareas
          </span>
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="TODOS">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="EN_REVISION">En Revisión</option>
              <option value="COMPLETADA">Completada</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Prioridad</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="TODOS">Todas</option>
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Responsable</label>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="TODOS">Todos los integrantes</option>
              {projectMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Vence hasta (Fecha límite)</label>
            <input
              type="date"
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Listado de Tareas */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No hay tareas que coincidan"
          description="No se encontraron tareas con los filtros seleccionados en este proyecto."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                <th className="py-3 px-4">Tarea</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Prioridad</th>
                <th className="py-3 px-4">Fecha Límite</th>
                <th className="py-3 px-4">Estado (Cambio rápido)</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                const isOverdue = task.dueDate < today && task.status !== 'COMPLETADA';
                const canChangeStatus =
                  canManageProject || task.assigneeId === currentUser.id;

                return (
                  <tr key={task.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{task.description}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{assignee?.name || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-medium ${
                          isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {task.dueDate} {isOverdue && '(Vencida)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {canChangeStatus ? (
                        <select
                          value={task.status}
                          onChange={(e) => changeTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white font-medium"
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="EN_PROGRESO">En Progreso</option>
                          <option value="EN_REVISION">En Revisión</option>
                          <option value="COMPLETADA">Completada</option>
                        </select>
                      ) : (
                        <TaskStatusBadge status={task.status} />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canManageProject ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskModalOpen(true);
                            }}
                            title="Editar tarea"
                            className="p-1 text-slate-500 hover:text-indigo-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTaskToDelete(task)}
                            title="Eliminar tarea"
                            className="p-1 text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
      >
        <TaskForm
          project={project}
          initialData={editingTask}
          onSuccess={() => setIsTaskModalOpen(false)}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        title="Editar Proyecto"
      >
        <ProjectForm
          initialData={project}
          onSuccess={() => setIsEditProjectOpen(false)}
          onCancel={() => setIsEditProjectOpen(false)}
        />
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Confirmar Eliminación"
      >
        <p className="text-sm text-slate-600 mb-6">
          ¿Estás seguro de eliminar la tarea <strong>"{taskToDelete?.title}"</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setTaskToDelete(null)}
            className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (taskToDelete) {
                await deleteTask(taskToDelete.id);
                setTaskToDelete(null);
              }
            }}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sí, eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};