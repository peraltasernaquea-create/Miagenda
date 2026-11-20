import { ArrowRight, Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { CourseClass, CourseTask, TabId } from '../types';
import {
  formatLongDate,
  formatShortDate,
  getRelativeDayLabel,
  getTodayISO,
} from '../utils/dateUtils';

interface InicioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onNavigate: (tab: TabId) => void;
  onAddClass: () => void;
  onEditClass: (item: CourseClass) => void;
  onDeleteClass: (item: CourseClass) => void;
  onAddTask: () => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onAddNote: () => void;
}

export function InicioView({
  classes,
  tasks,
  onNavigate,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
  onAddNote,
}: InicioViewProps) {
  const todayISO = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= todayISO)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 4);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Header Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <p className="text-sm font-medium text-slate-500">{formatLongDate(todayISO)}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 text-balance">
          Tu agenda de Google AI Studio
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 tabular-nums">
          <span>
            <strong className="font-semibold text-slate-900">{upcomingClasses.length}</strong>{' '}
            {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <strong className="font-semibold text-slate-900">{pendingTasks.length}</strong>{' '}
            {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Avance total: <strong className="font-semibold text-blue-700">{progressPercent}%</strong>
          </span>
        </div>

        {/* Quick Create Actions */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onAddTask}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar tarea</span>
          </button>
          <button
            type="button"
            onClick={onAddClass}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar clase</span>
          </button>
          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar nota</span>
          </button>
        </div>
      </section>

      {/* Main 2-column grid on desktop, single stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Próximas clases */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Próximas clases</h3>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="min-h-[44px] px-3 text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              <span>Ver calendario</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-base text-slate-600">No tienes clases programadas próximamente.</p>
              <button
                type="button"
                onClick={onAddClass}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
              >
                Programar nueva clase
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingClasses.map((cls) => {
                const dayLabel = getRelativeDayLabel(cls.date, todayISO);
                return (
                  <li key={cls.id} className="py-4 first:pt-3 last:pb-1">
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
                        <span className={dayLabel === 'Hoy' ? 'text-blue-700 font-bold' : 'text-slate-700 font-semibold'}>
                          {dayLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{cls.time} h</span>
                        <span aria-hidden="true">·</span>
                        <span>{cls.durationMinutes} min</span>
                        <span aria-hidden="true">·</span>
                        <span>{cls.module}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {cls.title}
                      </h4>

                      {cls.notes && (
                        <p className="text-sm text-slate-600 leading-relaxed">{cls.notes}</p>
                      )}

                      <p className="text-xs text-slate-500">{cls.modality}</p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onEditClass(cls)}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4 shrink-0" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteClass(cls)}
                          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Tareas pendientes */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Tareas pendientes</h3>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="min-h-[44px] px-3 text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-base text-slate-600">
                ¡Excelente! No tienes tareas pendientes por entregar.
              </p>
              <button
                type="button"
                onClick={onAddTask}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
              >
                Agregar nueva tarea
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingTasks.slice(0, 5).map((task) => {
                const isOverdue = task.dueDate < todayISO;
                const dayLabel = getRelativeDayLabel(task.dueDate, todayISO);
                return (
                  <li key={task.id} className="py-4 first:pt-3 last:pb-1">
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 tabular-nums">
                        <PriorityIndicator priority={task.priority} />
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            isOverdue
                              ? 'text-red-700 font-bold'
                              : dayLabel === 'Hoy'
                              ? 'text-amber-700 font-bold'
                              : 'text-slate-700 font-semibold'
                          }
                        >
                          {isOverdue ? 'Atrasada' : 'Pendiente'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{task.module}</span>
                      </div>

                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h4>
                        <span className="text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                          {dayLabel} ({formatShortDate(task.dueDate)})
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onToggleTaskStatus(task.id)}
                          className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-emerald-800 transition-colors"
                        >
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Marcar completada</span>
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
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
