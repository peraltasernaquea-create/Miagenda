import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { COURSE_MODULES, CourseClass } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface ClassModalProps {
  isOpen: boolean;
  editingClass: CourseClass | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (data: Omit<CourseClass, 'id'>, existingId?: string) => void;
}

export function ClassModal({
  isOpen,
  editingClass,
  defaultDate,
  onClose,
  onSave,
}: ClassModalProps) {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<string>(COURSE_MODULES[0]);
  const [date, setDate] = useState(getTodayISO());
  const [time, setTime] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [modality, setModality] = useState('Clase en vivo · Sala 1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingClass) {
      setTitle(editingClass.title);
      setModule(editingClass.module);
      setDate(editingClass.date);
      setTime(editingClass.time);
      setDurationMinutes(String(editingClass.durationMinutes));
      setModality(editingClass.modality);
      setNotes(editingClass.notes);
    } else {
      setTitle('');
      setModule(COURSE_MODULES[0]);
      setDate(defaultDate || getTodayISO());
      setTime('18:30');
      setDurationMinutes('60');
      setModality('Clase en vivo · Sala 1');
      setNotes('');
    }
  }, [isOpen, editingClass, defaultDate]);

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
      setError('Debes escribir el nombre de la clase.');
      return;
    }
    const finalDate = date.trim() ? date : getTodayISO();
    onSave(
      {
        title: title.trim(),
        module,
        date: finalDate,
        time: time || '18:00',
        durationMinutes: Math.max(15, Number(durationMinutes) || 60),
        modality: modality.trim() || 'Clase en vivo',
        notes: notes.trim(),
      },
      editingClass?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="class-modal-title"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="class-modal-title" className="text-lg font-bold text-slate-900">
            {editingClass ? 'Editar clase' : 'Nueva clase'}
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
            <label htmlFor="class-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nombre de la clase
            </label>
            <input
              id="class-title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej. Uso avanzado de System Instructions"
              className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="class-module" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Tema o módulo del curso
            </label>
            <select
              id="class-module"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="class-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Fecha
              </label>
              <input
                id="class-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                Si no eliges fecha, se usará hoy.
              </p>
            </div>

            <div>
              <label htmlFor="class-time" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Hora
              </label>
              <input
                id="class-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="class-duration" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Duración (min)
              </label>
              <input
                id="class-duration"
                type="number"
                min={15}
                max={300}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="class-modality" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Modalidad o lugar
              </label>
              <input
                id="class-modality"
                type="text"
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                placeholder="Ej. Clase en vivo"
                className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label htmlFor="class-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Resumen de la sesión
            </label>
            <textarea
              id="class-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Temas a revisar o materiales necesarios..."
              className="w-full px-4 py-3 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
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
              {editingClass ? 'Guardar cambios' : 'Guardar clase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
