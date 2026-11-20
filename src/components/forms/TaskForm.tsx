import React, { useState } from 'react';
import { Project, Task, TaskPriority, TaskStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface TaskFormProps {
  project: Project;
  initialData?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ project, initialData, onSuccess, onCancel }) => {
  const { users, addTask, updateTask, isLoading } = useApp();

  // Regla de negocio: Solo usuarios miembros del proyecto pueden ser asignados
  const projectMembers = users.filter((u) => project.memberIds.includes(u.id));

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || projectMembers[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'MEDIA');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'PENDIENTE');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres.';
    }
    if (!assigneeId) {
      newErrors.assigneeId = 'Debes asignar un integrante del proyecto.';
    }
    if (!dueDate) {
      newErrors.dueDate = 'La fecha límite es obligatoria.';
    } else if (dueDate < project.startDate || dueDate > project.endDate) {
      newErrors.dueDate = `La fecha debe estar dentro del rango del proyecto (${project.startDate} a ${project.endDate}).`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = initialData
      ? await updateTask({
          ...initialData,
          title: title.trim(),
          description: description.trim(),
          assigneeId,
          priority,
          status,
          dueDate,
        })
      : await addTask({
          projectId: project.id,
          title: title.trim(),
          description: description.trim(),
          assigneeId,
          priority,
          status,
          dueDate,
        });

    if (ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título de la Tarea *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Configurar autenticación JWT"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles técnicos o criterios de aceptación..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Responsable (Miembro) *</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {projectMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
          {errors.assigneeId && <p className="text-xs text-red-600 mt-1">{errors.assigneeId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Límite *</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.dueDate && <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Estado Inicial</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="EN_REVISION">En Revisión</option>
            <option value="COMPLETADA">Completada</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Tarea' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
};