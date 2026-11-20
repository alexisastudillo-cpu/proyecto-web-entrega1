import React, { createContext, useContext, useState } from 'react';
import { User, Project, Task, TaskStatus } from '../types';
import { MOCK_USERS, MOCK_PROJECTS, MOCK_TASKS } from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  isLoading: boolean;
  simulateNetworkError: boolean;
  toasts: ToastMessage[];
  setSimulateNetworkError: (val: boolean) => void;
  switchUser: (userId: string) => void;
  addProject: (project: Omit<Project, 'id'>) => Promise<boolean>;
  updateProject: (project: Project) => Promise<boolean>;
  assignMemberToProject: (projectId: string, userId: string) => Promise<boolean>;
  removeMemberFromProject: (projectId: string, userId: string) => Promise<boolean>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<boolean>;
  updateTask: (task: Task) => Promise<boolean>;
  changeTaskStatus: (taskId: string, status: TaskStatus) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [users] = useState<User[]>(MOCK_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => dismissToast(id), 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simula latencia de red y posibles fallos de servidor (500)
  const simulateRequest = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setIsLoading(false);

    if (simulateNetworkError) {
      showToast('error', 'Error simulado (500): No se pudo conectar con el servidor.');
      return false;
    }
    return true;
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast('info', `Sesión cambiada a ${found.name} (${found.role})`);
    }
  };

  const addProject = async (data: Omit<Project, 'id'>) => {
    if (!(await simulateRequest())) return false;
    const newProject: Project = {
      ...data,
      id: `p${Date.now()}`,
      memberIds: Array.from(new Set([data.leaderId, ...data.memberIds])),
    };
    setProjects((prev) => [newProject, ...prev]);
    showToast('success', 'Proyecto creado correctamente.');
    return true;
  };

  const updateProject = async (updated: Project) => {
    if (!(await simulateRequest())) return false;
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast('success', 'Proyecto actualizado.');
    return true;
  };

  const assignMemberToProject = async (projectId: string, userId: string) => {
    if (!(await simulateRequest())) return false;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId && !p.memberIds.includes(userId)
          ? { ...p, memberIds: [...p.memberIds, userId] }
          : p
      )
    );
    showToast('success', 'Integrante asignado al proyecto.');
    return true;
  };

  const removeMemberFromProject = async (projectId: string, userId: string) => {
    const hasAssignedTasks = tasks.some(
      (t) => t.projectId === projectId && t.assigneeId === userId && t.status !== 'COMPLETADA'
    );
    if (hasAssignedTasks) {
      showToast('error', 'No se puede remover: el integrante tiene tareas activas en este proyecto.');
      return false;
    }
    if (!(await simulateRequest())) return false;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, memberIds: p.memberIds.filter((id) => id !== userId) } : p
      )
    );
    showToast('info', 'Integrante removido del proyecto.');
    return true;
  };

  const addTask = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    if (!(await simulateRequest())) return false;
    const newTask: Task = {
      ...data,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('success', 'Tarea creada y asignada.');
    return true;
  };

  const updateTask = async (updated: Task) => {
    if (!(await simulateRequest())) return false;
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast('success', 'Tarea actualizada correctamente.');
    return true;
  };

  const changeTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!(await simulateRequest())) return false;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    showToast('success', `Estado actualizado a ${status.replace('_', ' ')}`);
    return true;
  };

  const deleteTask = async (taskId: string) => {
    if (!(await simulateRequest())) return false;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('info', 'Tarea eliminada.');
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        projects,
        tasks,
        isLoading,
        simulateNetworkError,
        toasts,
        setSimulateNetworkError,
        switchUser,
        addProject,
        updateProject,
        assignMemberToProject,
        removeMemberFromProject,
        addTask,
        updateTask,
        changeTaskStatus,
        deleteTask,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
};