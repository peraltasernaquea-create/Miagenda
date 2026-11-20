import { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { CourseClass, CourseTask } from '../types';
import {
  formatLongDate,
  formatShortDate,
  formatWeekRange,
  formatWeekdayDay,
  getMondayOfWeek,
  getRelativeDateISO,
  getTodayISO,
  getWeekDays,
} from '../utils/dateUtils';

interface CalendarioViewProps {
  classes: CourseClass[];
  tasks: CourseTask[];
  onAddClassForDate: (dateISO: string) => void;
  onEditClass: (cls: CourseClass) => void;
  onDeleteClass: (cls: CourseClass) => void;
  onAddTaskForDate: (dateISO: string) => void;
  onEditTask: (task: CourseTask) => void;
  onDeleteTask: (task: CourseTask) => void;
  onToggleTaskStatus: (taskId: string) => void;
}

export function CalendarioView({
  classes,
  tasks,
  onAddClassForDate,
  onEditClass,
  onDeleteClass,
  onAddTaskForDate,
  onEditTask,
  onDeleteTask,
  onToggleTaskStatus,
}: CalendarioViewProps) {
  const todayISO = getTodayISO();
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [weekMonday, setWeekMonday] = useState<string>(getMondayOfWeek(todayISO));

  const weekDays = getWeekDays(weekMonday);

  const handleSelectDay = (dayISO: string) => {
    setSelectedDate(dayISO);
  };

  const handleShiftWeek = (deltaWeeks: number) => {
    const nextMonday = getRelativeDateISO(deltaWeeks * 7, weekMonday);
    setWeekMonday(nextMonday);
    setSelectedDate(nextMonday);
  };

  const handleGoToday = () => {
    setSelectedDate(todayISO);
    setWeekMonday(getMondayOfWeek(todayISO));
  };

  const dayClasses = classes
    .filter((c) => c.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);

  return (
    <div className="space-y-5">
      {/* Header & View Mode Switcher */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Calendario del curso</h2>
            <p className="text-sm text-slate-600 mt-0.5 capitalize">
              Semana del {formatWeekRange(weekMonday)}
            </p>
          </div>

          {/* Segmented Toggle: Vista por día / Vista por semana */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl sm:w-64">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'dia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por día
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'semana'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Por semana
            </button>
          </div>
        </div>

        {/* Week Navigation Controls */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleShiftWeek(-1)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span>Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleGoToday}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-blue-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>Ir a hoy</span>
          </button>

          <button
            type="button"
            onClick={() => handleShiftWeek(1)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* 7-Day Interactive Selector Strip */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {weekDays.map((dayISO) => {
            const { weekdayShort, dayNumber } = formatWeekdayDay(dayISO);
            const isSelected = dayISO === selectedDate && viewMode === 'dia';
            const isToday = dayISO === todayISO;
            const activityCount =
              classes.filter((c) => c.date === dayISO).length +
              tasks.filter((t) => t.dueDate === dayISO).length;

            return (
              <button
                key={dayISO}
                type="button"
                onClick={() => {
                  handleSelectDay(dayISO);
                  if (viewMode === 'semana') setViewMode('dia');
                }}
                aria-label={`${weekdayShort} ${dayNumber}, ${activityCount} actividades`}
                className={`min-h-[60px] py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-blue-700 text-white'
                    : isToday
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-[11px] font-medium opacity-85">{weekdayShort}</span>
                <span className="text-base font-bold tabular-nums leading-tight mt-0.5">
                  {dayNumber}
                </span>
                <span
                  className={`text-[10px] tabular-nums mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {activityCount > 0 ? `${activityCount} act.` : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Content Area: Por día o Por semana */}
      {viewMode === 'dia' ? (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{formatLongDate(selectedDate)}</h3>
              <p className="text-sm text-slate-500 tabular-nums mt-0.5">
                {dayClasses.length} {dayClasses.length === 1 ? 'clase' : 'clases'} · {dayTasks.length}{' '}
                {dayTasks.length === 1 ? 'entrega' : 'entregas'}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                onClick={() => onAddClassForDate(selectedDate)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Agregar clase</span>
              </button>
              <button
                type="button"
                onClick={() => onAddTaskForDate(selectedDate)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-blue-800 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Agregar tarea</span>
              </button>
            </div>
          </div>

          {dayClasses.length === 0 && dayTasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-base text-slate-600">
                No hay clases ni fechas de entrega registradas para este día.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {dayClasses.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Clases del día</h4>
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {dayClasses.map((cls) => (
                      <li key={cls.id} className="py-4">
                        <div className="text-xs font-medium text-slate-500 tabular-nums flex flex-wrap gap-x-2">
                          <span className="font-semibold text-blue-700">{cls.time} h</span>
                          <span aria-hidden="true">·</span>
                          <span>{cls.durationMinutes} min</span>
                          <span aria-hidden="true">·</span>
                          <span>{cls.module}</span>
                        </div>
                        <p className="text-base font-bold text-slate-900 mt-1">{cls.title}</p>
                        {cls.notes && <p className="text-sm text-slate-600 mt-1">{cls.notes}</p>}
                        <p className="text-xs text-slate-500 mt-1">{cls.modality}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-50"
                          >
                            <Pencil className="w-4 h-4 shrink-0" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(cls)}
                            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dayTasks.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Tareas con entrega este día</h4>
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {dayTasks.map((task) => {
                      const isDone = task.status === 'completada';
                      return (
                        <li key={task.id} className="py-4">
                          <div className="text-xs font-medium flex flex-wrap items-center gap-x-2">
                            <span className={isDone ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                              {isDone ? 'Completada' : 'Pendiente'}
                            </span>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <PriorityIndicator priority={task.priority} />
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span className="text-slate-500">{task.module}</span>
                          </div>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mt-1">
                            <p
                              className={`text-base font-bold ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </p>
                            <span className="text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                              {formatShortDate(task.dueDate)}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                                isDone
                                  ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
                              }`}
                            >
                              <Check className="w-4 h-4 shrink-0" />
                              <span>{isDone ? 'Marcar pendiente' : 'Marcar completada'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-50"
                            >
                              <Pencil className="w-4 h-4 shrink-0" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteTask(task)}
                              className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 shrink-0" />
                              <span>Eliminar</span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      ) : (
        /* Vista semanal */
        <section className="space-y-3">
          {weekDays.map((dayISO) => {
            const wClasses = classes
              .filter((c) => c.date === dayISO)
              .sort((a, b) => a.time.localeCompare(b.time));
            const wTasks = tasks.filter((t) => t.dueDate === dayISO);
            const isToday = dayISO === todayISO;
            const { weekdayShort } = formatWeekdayDay(dayISO);

            return (
              <div
                key={dayISO}
                className={`bg-white border rounded-2xl p-4 sm:p-5 ${
                  isToday ? 'border-blue-300' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {weekdayShort} · {formatShortDate(dayISO)}
                    </h3>
                    {isToday && (
                      <span className="text-xs font-bold text-blue-700">Hoy</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDate(dayISO);
                      setViewMode('dia');
                    }}
                    className="min-h-[44px] px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Ver día
                  </button>
                </div>

                {wClasses.length === 0 && wTasks.length === 0 ? (
                  <p className="text-sm text-slate-500 pt-3">Sin actividades programadas.</p>
                ) : (
                  <ul className="divide-y divide-slate-100 pt-1">
                    {wClasses.map((cls) => (
                      <li key={cls.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-slate-500 tabular-nums">
                            Clase · {cls.time} h · {cls.module}
                          </p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{cls.title}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteClass(cls)}
                            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}

                    {wTasks.map((task) => {
                      const isDone = task.status === 'completada';
                      return (
                        <li key={task.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-1.5">
                              <span>Tarea</span>
                              <span aria-hidden="true">·</span>
                              <span className={isDone ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                                {isDone ? 'Completada' : 'Pendiente'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <PriorityIndicator priority={task.priority} />
                              <span aria-hidden="true">·</span>
                              <span>{task.module}</span>
                            </p>
                            <p
                              className={`text-sm font-bold mt-0.5 ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {task.title}{' '}
                              <span className="text-xs font-medium text-slate-500 tabular-nums">
                                ({formatShortDate(task.dueDate)})
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => onToggleTaskStatus(task.id)}
                              className={`min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                isDone
                                  ? 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
                              }`}
                            >
                              {isDone ? 'Reabrir' : 'Completar'}
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditTask(task)}
                              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteTask(task)}
                              className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
