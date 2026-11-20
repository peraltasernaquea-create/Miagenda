import { useState } from 'react';
import { Check, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { CourseTask } from '../types';
import { formatShortDate, getRelativeDayLabel, getTodayISO } from '../utils/dateUtils';

interface TareasViewProps {
  tasks: CourseTask[];
  onAddTask: () => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

type FilterState = 'todas' | 'pendientes' | 'completadas';

export function TareasView({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: TareasViewProps) {
  const [filter, setFilter] = useState<FilterState>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const todayISO = getTodayISO();

  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...tasks]
    .filter((t) => {
      if (filter === 'pendientes') return t.status === 'pendiente';
      if (filter === 'completadas') return t.status === 'completada';
      return true;
    })
    .filter((t) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.module.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pendiente' ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-5">
      {/* Top Action & Filter Controls */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Tareas y actividades</h2>
            <p className="text-sm text-slate-600 mt-0.5 tabular-nums">
              {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'} · {completedCount}{' '}
              {completedCount === 1 ? 'completada' : 'completadas'}
            </p>
          </div>
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar nueva tarea</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarea por nombre o tema..."
            aria-label="Buscar tareas"
            className="w-full min-h-[48px] pl-11 pr-4 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        {/* Segmented Filter Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter('todas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'todas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pendientes')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'pendientes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completadas')}
            className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
              filter === 'completadas'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hechas ({completedCount})
          </button>
        </div>
      </section>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <section className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-base text-slate-600">
            {searchQuery
              ? 'No se encontraron tareas con esa búsqueda.'
              : 'No hay tareas en esta categoría.'}
          </p>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50"
            >
              Limpiar búsqueda
            </button>
          ) : (
            <button
              type="button"
              onClick={onAddTask}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800"
            >
              Agregar primera tarea
            </button>
          )}
        </section>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completada';
            const isOverdue = !isDone && task.dueDate < todayISO;
            const dayLabel = getRelativeDayLabel(task.dueDate, todayISO);

            return (
              <li
                key={task.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-medium flex flex-wrap items-center gap-x-2 gap-y-1 tabular-nums">
                    <span
                      className={
                        isDone
                          ? 'text-emerald-700 font-bold'
                          : isOverdue
                          ? 'text-red-700 font-bold'
                          : 'text-amber-700 font-bold'
                      }
                    >
                      {isDone ? 'Completada' : isOverdue ? 'Pendiente (atrasada)' : 'Pendiente'}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <PriorityIndicator priority={task.priority} />
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-slate-500">{task.module}</span>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3
                      className={`text-lg font-bold leading-snug ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span className="text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                      {dayLabel} ({formatShortDate(task.dueDate)})
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                      isDone
                        ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <RotateCcw className="w-4 h-4 shrink-0" />
                        <span>Marcar pendiente</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Marcar completada</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4 shrink-0" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task)}
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
