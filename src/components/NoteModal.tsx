import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { COURSE_MODULES, CourseNote } from '../types';
import { getTodayISO } from '../utils/dateUtils';

interface NoteModalProps {
  isOpen: boolean;
  editingNote: CourseNote | null;
  onClose: () => void;
  onSave: (data: Omit<CourseNote, 'id'>, existingId?: string) => void;
}

export function NoteModal({ isOpen, editingNote, onClose, onSave }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState<string>(COURSE_MODULES[0]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingNote) {
      setTitle(editingNote.title);
      setTopic(editingNote.topic);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setTopic(COURSE_MODULES[0]);
      setContent('');
    }
  }, [isOpen, editingNote]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para tu apunte.');
      return;
    }
    if (!content.trim()) {
      setError('Escribe el contenido de tu nota.');
      return;
    }
    onSave(
      {
        title: title.trim(),
        topic,
        content: content.trim(),
        updatedAt: getTodayISO(),
      },
      editingNote?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="note-modal-title" className="text-lg font-bold text-slate-900">
            {editingNote ? 'Editar nota' : 'Nueva nota de estudio'}
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
            <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="note-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Título del apunte
            </label>
            <input
              id="note-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Cuándo usar Gemini 2.5 Pro vs Flash"
              className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="note-topic" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Tema del curso
            </label>
            <select
              id="note-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 text-base bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              {COURSE_MODULES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="note-content" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Apuntes
            </label>
            <textarea
              id="note-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe ideas clave, ejemplos de prompts o recordatorios..."
              className="w-full px-4 py-3 text-base leading-relaxed bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
              {editingNote ? 'Guardar cambios' : 'Guardar nota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
