import { User, Project, Task } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Carlos Mendoza', email: 'admin@empresa.com', role: 'ADMIN', avatar: 'CM' },
  { id: 'u2', name: 'Laura Gómez', email: 'laura.lider@empresa.com', role: 'LEADER', avatar: 'LG' },
  { id: 'u3', name: 'Andrés Silva', email: 'andres.dev@empresa.com', role: 'MEMBER', avatar: 'AS' },
  { id: 'u4', name: 'Sofía Castro', email: 'sofia.qa@empresa.com', role: 'MEMBER', avatar: 'SC' },
  { id: 'u5', name: 'Diego Rojas', email: 'diego.ui@empresa.com', role: 'MEMBER', avatar: 'DR' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Rediseño Portal E-Commerce',
    description: 'Migración de interfaz de usuario y optimización del flujo de checkout.',
    leaderId: 'u2',
    startDate: '2026-10-01',
    endDate: '2026-12-15',
    status: 'ACTIVO',
    memberIds: ['u2', 'u3', 'u5'],
  },
  {
    id: 'p2',
    name: 'API de Facturación Electrónica',
    description: 'Desarrollo de microservicios RESTful y conexión con PostgreSQL.',
    leaderId: 'u2',
    startDate: '2026-09-15',
    endDate: '2026-11-30',
    status: 'ACTIVO',
    memberIds: ['u2', 'u3', 'u4'],
  },
  {
    id: 'p3',
    name: 'Auditoría de Seguridad Q4',
    description: 'Pruebas de penetración y revisión de roles y permisos.',
    leaderId: 'u1',
    startDate: '2026-11-01',
    endDate: '2026-12-20',
    status: 'PAUSADO',
    memberIds: ['u1', 'u4'],
  },
];

// Fechas diseñadas respecto a Noviembre 2026 para mostrar tareas vencidas y próximas
export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Diseñar wireframes de carrito móvil',
    description: 'Adaptar vistas a pantallas menores de 480px.',
    assigneeId: 'u5',
    status: 'COMPLETADA',
    priority: 'ALTA',
    dueDate: '2026-11-10',
    createdAt: '2026-10-05',
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Implementar pasarela de validación de formularios',
    description: 'Validar campos obligatorios y mensajes de error en cliente.',
    assigneeId: 'u3',
    status: 'EN_PROGRESO',
    priority: 'CRITICA',
    dueDate: '2026-11-12', // VENCIDA
    createdAt: '2026-10-15',
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Pruebas de rendimiento Lighthouse',
    description: 'Alcanzar puntuación superior a 90 en accesibilidad.',
    assigneeId: 'u3',
    status: 'PENDIENTE',
    priority: 'MEDIA',
    dueDate: '2026-11-28',
    createdAt: '2026-11-01',
  },
  {
    id: 't4',
    projectId: 'p2',
    title: 'Modelado de tablas de impuestos en PostgreSQL',
    description: 'Definir claves foráneas e índices.',
    assigneeId: 'u3',
    status: 'EN_REVISION',
    priority: 'ALTA',
    dueDate: '2026-11-15', // VENCIDA
    createdAt: '2026-10-20',
  },
  {
    id: 't5',
    projectId: 'p2',
    title: 'Casos de prueba unitarios para endpoints',
    description: 'Cubrir errores HTTP 400, 401 y 404.',
    assigneeId: 'u4',
    status: 'PENDIENTE',
    priority: 'ALTA',
    dueDate: '2026-11-25',
    createdAt: '2026-11-02',
  },
];