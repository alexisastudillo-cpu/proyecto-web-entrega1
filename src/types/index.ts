export type UserRole = 'ADMIN' | 'LEADER' | 'MEMBER';

export type TaskStatus = 'PENDIENTE' | 'EN_PROGRESO' | 'EN_REVISION' | 'COMPLETADA';

export type TaskPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVO' | 'PAUSADO' | 'FINALIZADO';
  memberIds: string[]; // Representa la tabla intermedia project_members
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}