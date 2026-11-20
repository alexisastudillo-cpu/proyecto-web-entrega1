import React from 'react';
import { LayoutDashboard, FolderKanban, ShieldAlert, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  activeView: 'dashboard' | 'projects';
  onNavigate: (view: 'dashboard' | 'projects') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate }) => {
  const { currentUser, users, switchUser, simulateNetworkError, setSimulateNetworkError } = useApp();

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-3 gap-4">
          {/* Logo y Navegación */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 cursor-pointer font-bold text-lg tracking-tight text-indigo-400"
            >
              <FolderKanban className="w-6 h-6" />
              <span>TaskFlow<span className="text-white font-normal">Pro</span></span>
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeView === 'dashboard'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel Principal
              </button>
              <button
                onClick={() => onNavigate('projects')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeView === 'projects'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Proyectos
              </button>
            </nav>
          </div>

          {/* Controles de Demostración (Cambio de Rol y Simulación de Error) */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSimulateNetworkError(!simulateNetworkError)}
              title="Activa fallos HTTP 500 para probar manejo de errores"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition ${
                simulateNetworkError
                  ? 'bg-red-950 border-red-500 text-red-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {simulateNetworkError ? 'Error Red: ON' : 'Simular Error'}
            </button>

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <select
                value={currentUser.id}
                onChange={(e) => switchUser(e.target.value)}
                aria-label="Cambiar perfil de usuario"
                className="bg-transparent text-xs sm:text-sm text-white focus:outline-none cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-slate-800 text-white">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};