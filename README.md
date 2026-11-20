# TaskFlow Pro - Plataforma de Gestión de Tareas y Proyectos (Entrega 1)

Aplicación web Frontend desarrollada en **React + TypeScript + Vite + Tailwind CSS** para la organización de proyectos, asignación de integrantes y seguimiento de tareas[cite: 1, 2, 3].

## Stack Tecnológico
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS[cite: 1, 2].
* **Persistencia simulada:** Estado global en memoria (Context API) con simulación de latencia HTTP y manejo de errores de red[cite: 2].

## Instrucciones de Ejecución
1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/alexisastudillo-cpu/proyecto-web-entrega1.git
   \`\`\`
2. Entrar a la carpeta e instalar dependencias:
   \`\`\`bash
   cd proyecto-web-entrega1
   npm install
   \`\`\`
3. Iniciar el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Abrir en el navegador la URL local (`http://localhost:5173`).

## Perfiles de Usuario y Datos Simulados
La barra superior incluye un selector rápido para probar los permisos de cada rol[cite: 3]:
* **Administrador (`ADMIN` - Carlos Mendoza):** Creación/edición de proyectos, gestión completa de integrantes y tareas[cite: 3].
* **Líder de Proyecto (`LEADER` - Laura Gómez):** Administración de proyectos liderados, asignación de miembros y gestión de tareas[cite: 3].
* **Integrante (`MEMBER` - Andrés Silva / Sofía Castro / Diego Rojas):** Visualización de proyectos asignados y actualización de estado en sus propias tareas[cite: 3].

## Funcionalidades Implementadas
* **Panel Principal:** Indicadores de proyectos activos, tareas pendientes, tareas vencidas y porcentaje de avance[cite: 3].
* **Gestión de Proyectos:** Listado con búsqueda, filtro por estado y formulario de creación/edición con validación de fechas[cite: 2, 3].
* **Detalle y Tareas:** Asignación/remoción de equipo, filtros combinados (estado, prioridad, responsable y fecha límite) y cambio rápido de estado[cite: 3].
* **Estados de Interfaz:** Indicadores de carga, estados vacíos (`EmptyState`), confirmaciones y botón para simular errores HTTP 500[cite: 2].