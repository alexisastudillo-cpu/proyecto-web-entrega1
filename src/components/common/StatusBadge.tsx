import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';

export const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const styles: Record<TaskStatus, string> = {
    PENDIENTE: 'bg-slate-100 text-slate-700 border-slate-300',
    EN_PROGRESO: 'bg-blue-100 text-blue-700 border-blue-300',
    EN_REVISION: 'bg-amber-100 text-amber-800 border-amber-300',
    COMPLETADA: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  const styles: Record<TaskPriority, string> = {
    BAJA: 'bg-gray-100 text-gray-600',
    MEDIA: 'bg-sky-100 text-sky-700',
    ALTA: 'bg-orange-100 text-orange-700',
    CRITICA: 'bg-red-100 text-red-700 font-semibold',
  };

  return (
    <span className={`px-2 py-0.5 text-xs rounded ${styles[priority]}`}>
      {priority}
    </span>
  );
};