import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/layout/Toast';
import { Dashboard } from './pages/Dashboard';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectDetail } from './pages/ProjectDetail';

const MainLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'projects'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { isLoading } = useApp();

  const handleNavigate = (view: 'dashboard' | 'projects') => {
    setSelectedProjectId(null);
    setActiveView(view);
  };

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setActiveView('projects');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar activeView={activeView} onNavigate={handleNavigate} />

      {/* Barra superior de estado de carga */}
      {isLoading && (
        <div className="h-1 w-full bg-indigo-200 overflow-hidden">
          <div className="h-full bg-indigo-600 animate-pulse w-full" />
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProjectId ? (
          <ProjectDetail
            projectId={selectedProjectId}
            onBack={() => setSelectedProjectId(null)}
          />
        ) : activeView === 'dashboard' ? (
          <Dashboard onSelectProject={handleSelectProject} />
        ) : (
          <ProjectsList onSelectProject={handleSelectProject} />
        )}
      </main>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}