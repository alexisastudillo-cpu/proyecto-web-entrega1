import React, { useState } from 'react';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProjectFormProps {
  initialData?: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { users, addProject, updateProject, isLoading } = useApp();
  const leaders = users.filter((u) => u.role === 'LEADER' || u.role === 'ADMIN');

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [leaderId, setLeaderId] = useState(initialData?.leaderId || leaders[0]?.id || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [status, setStatus] = useState<Project['status']>(initialData?.status || 'ACTIVO');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (name.trim().length < 4) {
      newErrors.name = 'El nombre del proyecto debe tener al menos 4 caracteres.';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria.';
    }
    if (!startDate) {
      newErrors.startDate = 'Selecciona una fecha de inicio.';
    }
    if (!endDate) {
      newErrors.endDate = 'Selecciona una fecha de finalización.';
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const ok = initialData
      ? await updateProject({
          ...initialData,
          name: name.trim(),
          description: description.trim(),
          leaderId,
          startDate,
          endDate,
          status,
        })
      : await addProject({
          name: name.trim(),
          description: description.trim(),
          leaderId,
          startDate,
          endDate,
          status,
          memberIds: [leaderId],
        });

    if (ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Sistema de Inventarios"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Objetivo y alcance del proyecto..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Líder Responsable *</label>
          <select
            value={leaderId}
            onChange={(e) => setLeaderId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {leaders.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Project['status'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="ACTIVO">Activo</option>
            <option value="PAUSADO">Pausado</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Inicio *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Fin *</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
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
          {isLoading ? 'Guardando...' : initialData ? 'Guardar Cambios' : 'Crear Proyecto'}
        </button>
      </div>
    </form>
  );
};