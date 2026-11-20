import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { COURSE_MODULES, CourseTask, TaskPriority, TaskStatus } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: CourseTask | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (data: Omit<CourseTask, 'id'>, existingId?: string) => void;
}

export function TaskModal({
  isOpen,
  editingTask,
  defaultDate,
  onClose,
  onSave,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [module, setModule] = useState<string>(COURSE_MODULES[0]);
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate || getTodayISO());
      setModule(editingTask.module);
      setStatus(editingTask.status);
      setPriority(editingTask.priority || 'media');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(defaultDate || getTodayISO());
      setModule(COURSE_MODULES[0]);
      setStatus('pendiente');
      setPriority('media');
    }
  }, [isOpen, editingTask, defaultDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (error && value.trim().length > 0) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Debes escribir una actividad.');
      return;
    }
    const finalDate = dueDate.trim() ? dueDate : getTodayISO();
    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        dueDate: finalDate,
        module,
        status,
        priority,
      },
      editingTask?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="task-modal-title" className="text-lg font-bold text-slate-900">
            {editingTask ? 'Editar actividad' : 'Nueva actividad o tarea'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4">
          {error && (
            <p
              role="alert"
              className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              {error}
            </p>
          )}

          <div>
            <label htmlFor="task-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nombre de la actividad
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej. Probar esquema JSON con Gemini 2.5"
              className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Descripción
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pasos o requisitos para completar esta entrega..."
              className="w-full px-4 py-3 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-due" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Fecha
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                Si no eliges fecha, se usará la fecha de hoy.
              </p>
            </div>

            <div>
              <label htmlFor="task-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Tema del curso
              </label>
              <select
                id="task-module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                {COURSE_MODULES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nivel de prioridad
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setPriority('baja')}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  priority === 'baja'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Baja
              </button>
              <button
                type="button"
                onClick={() => setPriority('media')}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  priority === 'media'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Media
              </button>
              <button
                type="button"
                onClick={() => setPriority('alta')}
                className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  priority === 'alta'
                    ? 'bg-white text-red-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alta
              </button>
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-800 mb-1.5">
              Estado de la actividad
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setStatus('pendiente')}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  status === 'pendiente'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pendiente
              </button>
              <button
                type="button"
                onClick={() => setStatus('completada')}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  status === 'completada'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completada
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-base hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto sm:flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 transition-colors"
            >
              {editingTask ? 'Guardar cambios' : 'Guardar actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
