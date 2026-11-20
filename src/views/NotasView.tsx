import { useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { COURSE_MODULES, CourseNote } from '../types';
import { formatShortDate } from '../utils/dateUtils';

interface NotasViewProps {
  notes: CourseNote[];
  onAddNote: () => void;
  onEditNote: (note: CourseNote) => void;
  onDeleteNote: (note: CourseNote) => void;
}

export function NotasView({ notes, onAddNote, onEditNote, onDeleteNote }: NotasViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const availableTopics = Array.from(
    new Set([...notes.map((n) => n.topic), ...COURSE_MODULES])
  );

  const filteredNotes = [...notes]
    .filter((n) => (selectedTopic === 'todos' ? true : n.topic === selectedTopic))
    .filter((n) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.topic.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Notas y apuntes</h2>
            <p className="text-sm text-slate-600 mt-0.5 tabular-nums">
              {notes.length} {notes.length === 1 ? 'apunte guardado' : 'apuntes guardados'} sobre Google AI Studio
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNote}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span>Agregar nueva nota</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en tus apuntes..."
              aria-label="Buscar en apuntes"
              className="w-full min-h-[48px] pl-11 pr-4 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="notes-topic-filter" className="sr-only">
              Filtrar por tema del curso
            </label>
            <select
              id="notes-topic-filter"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            >
              <option value="todos">Todos los temas del curso</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <section className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
          <p className="text-base text-slate-600">
            No hay apuntes que coincidan con tu filtro actual.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic('todos');
              setSearchQuery('');
            }}
            className="min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50"
          >
            Mostrar todas las notas
          </button>
        </section>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <li
              key={note.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-x-2 tabular-nums">
                  <span className="text-blue-700 font-semibold">{note.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span>Actualizado: {formatShortDate(note.updatedAt)}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{note.title}</h3>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Pencil className="w-4 h-4 shrink-0" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 bg-white text-red-700 text-sm font-semibold flex items-center gap-1.5 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>Eliminar nota</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
