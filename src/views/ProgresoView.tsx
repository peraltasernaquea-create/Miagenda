import { Check, Pencil, RotateCcw } from 'lucide-react';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { COURSE_MODULES, CourseClass, CourseNote, CourseTask } from '../types';
import { formatShortDate } from '../utils/dateUtils';

interface ProgresoViewProps {
  tasks: CourseTask[];
  classes: CourseClass[];
  notes: CourseNote[];
  onToggleTaskStatus: (taskId: string) => void;
  onEditTask: (task: CourseTask) => void;
  onRequestResetSampleData: () => void;
}

export function ProgresoView({
  tasks,
  classes,
  notes,
  onToggleTaskStatus,
  onEditTask,
  onRequestResetSampleData,
}: ProgresoViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada');
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente');
  const percentage = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // SVG Ring math
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const moduleBreakdown = COURSE_MODULES.map((mod) => {
    const modTasks = tasks.filter((t) => t.module === mod);
    const modDone = modTasks.filter((t) => t.status === 'completada').length;
    const modPct = modTasks.length > 0 ? Math.round((modDone / modTasks.length) * 100) : 0;
    return {
      module: mod,
      total: modTasks.length,
      done: modDone,
      pending: modTasks.length - modDone,
      pct: modPct,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      {/* Main Progress Summary Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900">Progreso del curso</h2>
        <p className="text-sm text-slate-600 mt-1">
          Resumen general de tus tareas completadas y pendientes.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* SVG Circular Ring */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  fill="none"
                  stroke="#1D4ED8"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-[stroke-dashoffset] duration-300"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-900 tabular-nums">
                {percentage}%
              </span>
            </div>

            <div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {completedTasks.length} de {totalTasks}
              </p>
              <p className="text-sm text-slate-600 mt-0.5">tareas completadas</p>
            </div>
          </div>

          {/* 3 Clean Key Counters */}
          <div className="flex-1 grid grid-cols-3 gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
            <div>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                {completedTasks.length}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700 tabular-nums">
                {pendingTasks.length}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">Pendientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">
                {classes.length + notes.length}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">Clases y notas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress by Module */}
      {moduleBreakdown.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Avance por tema del curso</h3>
          <div className="space-y-4">
            {moduleBreakdown.map((item) => (
              <div key={item.module} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-slate-800">{item.module}</span>
                  <span className="text-slate-600 tabular-nums shrink-0">
                    {item.done}/{item.total} ({item.pct}%)
                  </span>
                </div>
                <div
                  className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={item.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.module}: ${item.pct}% completado`}
                >
                  <div
                    className="h-full bg-blue-700 rounded-full transition-all duration-300"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending & Completed Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Pendientes ({pendingTasks.length})
          </h3>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-slate-600 pt-4">
              No tienes tareas pendientes en este momento.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {pendingTasks.map((task) => (
                <li
                  key={task.id}
                  className="py-3.5 flex flex-col gap-2.5"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-bold text-slate-900">{task.title}</p>
                      <span className="text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                        {formatShortDate(task.dueDate)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                      <PriorityIndicator priority={task.priority} />
                      <span aria-hidden="true">·</span>
                      <span>{task.module}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-800 transition-colors"
                    >
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Completar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4 shrink-0" />
                      <span>Editar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Completadas ({completedTasks.length})
          </h3>
          {completedTasks.length === 0 ? (
            <p className="text-sm text-slate-600 pt-4">
              Aún no has marcado ninguna tarea como completada.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {completedTasks.map((task) => (
                <li
                  key={task.id}
                  className="py-3.5 flex flex-col gap-2.5"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-bold text-slate-600 line-through">{task.title}</p>
                      <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">
                        {formatShortDate(task.dueDate)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                      <PriorityIndicator priority={task.priority} />
                      <span aria-hidden="true">·</span>
                      <span>{task.module}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>Marcar pendiente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditTask(task)}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4 shrink-0" />
                      <span>Editar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Reset Sample Data */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Datos de ejemplo del curso</h3>
          <p className="text-sm text-slate-600">
            Si editaste o eliminaste elementos, puedes restaurar la agenda inicial de Google AI Studio.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestResetSampleData}
          className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          Restablecer datos de ejemplo
        </button>
      </section>
    </div>
  );
}
