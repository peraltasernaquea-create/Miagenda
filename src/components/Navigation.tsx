import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  FileText,
  Home,
} from 'lucide-react';
import { TabId } from '../types';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  pendingTasksCount: number;
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'calendario', label: 'Calendario', icon: CalendarDays },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare },
  { id: 'notas', label: 'Notas', icon: FileText },
  { id: 'progreso', label: 'Progreso', icon: BarChart3 },
];

export function Navigation({ activeTab, onSelectTab, pendingTasksCount }: NavigationProps) {
  return (
    <>
      {/* Desktop Top Header & Sidebar Navigation (hidden on mobile) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white border-r border-slate-200 z-30">
        <div className="px-6 py-6 border-b border-slate-100">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Mi Agenda de Aprendizaje
          </h1>
          <p className="text-xs text-slate-500 mt-1">Curso de Google AI Studio</p>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 min-h-[48px] rounded-xl text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.85} />
                  <span>{item.label}</span>
                </span>
                {item.id === 'tareas' && pendingTasksCount > 0 && (
                  <span className="text-xs tabular-nums font-semibold text-blue-700">
                    {pendingTasksCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-slate-100 text-xs text-slate-500">
          Datos guardados en este dispositivo
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar (fixed, compact <= 68px to stay well under 15% mobile viewport cap) */}
      <nav
        aria-label="Navegación inferior"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-5 h-16 max-w-xl mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center min-h-[48px] px-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                  isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.3 : 1.85} />
                  {item.id === 'tareas' && pendingTasksCount > 0 && (
                    <span
                      aria-label={`${pendingTasksCount} tareas pendientes`}
                      className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-700 text-white text-[10px] font-bold leading-4 text-center tabular-nums"
                    >
                      {pendingTasksCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[11px] mt-1 tracking-tight whitespace-nowrap ${
                    isActive ? 'font-bold text-blue-700' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
