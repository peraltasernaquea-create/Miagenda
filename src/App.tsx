import { useEffect, useState } from 'react';
import { ClassModal } from './components/ClassModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { Navigation } from './components/Navigation';
import { NoteModal } from './components/NoteModal';
import { TaskModal } from './components/TaskModal';
import {
  buildInitialClasses,
  buildInitialNotes,
  buildInitialTasks,
} from './data/initialData';
import { CourseClass, CourseNote, CourseTask, TabId } from './types';
import { CalendarioView } from './views/CalendarioView';
import { InicioView } from './views/InicioView';
import { NotasView } from './views/NotasView';
import { ProgresoView } from './views/ProgresoView';
import { TareasView } from './views/TareasView';

const STORAGE_KEYS = {
  classes: 'agenda_ai_studio_classes_v1',
  tasks: 'agenda_ai_studio_tasks_v1',
  notes: 'agenda_ai_studio_notes_v1',
};

function loadFromStorage<T>(key: string, fallback: () => T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback();
  } catch {
    return fallback();
  }
}

type PendingDelete =
  | { type: 'class'; item: CourseClass }
  | { type: 'task'; item: CourseTask }
  | { type: 'note'; item: CourseNote }
  | { type: 'reset' }
  | null;

const TAB_TITLES: Record<TabId, string> = {
  inicio: 'Inicio',
  calendario: 'Calendario',
  tareas: 'Tareas',
  notas: 'Notas',
  progreso: 'Progreso',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio');

  const [classes, setClasses] = useState<CourseClass[]>(() =>
    loadFromStorage(STORAGE_KEYS.classes, buildInitialClasses)
  );
  const [tasks, setTasks] = useState<CourseTask[]>(() =>
    loadFromStorage(STORAGE_KEYS.tasks, buildInitialTasks).map((t) => ({
      ...t,
      priority: t.priority || 'media',
    }))
  );
  const [notes, setNotes] = useState<CourseNote[]>(() =>
    loadFromStorage(STORAGE_KEYS.notes, buildInitialNotes)
  );

  // Modal states
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [classDefaultDate, setClassDefaultDate] = useState<string | undefined>(undefined);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CourseTask | null>(null);
  const [taskDefaultDate, setTaskDefaultDate] = useState<string | undefined>(undefined);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CourseNote | null>(null);

  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.classes, JSON.stringify(classes));
    } catch {
      // Ignore storage quota errors
    }
  }, [classes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
    } catch {
      // Ignore storage quota errors
    }
  }, [notes]);

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Class handlers
  const handleOpenAddClass = (dateISO?: string) => {
    setEditingClass(null);
    setClassDefaultDate(dateISO);
    setClassModalOpen(true);
  };

  const handleOpenEditClass = (cls: CourseClass) => {
    setEditingClass(cls);
    setClassDefaultDate(undefined);
    setClassModalOpen(true);
  };

  const handleSaveClass = (data: Omit<CourseClass, 'id'>, existingId?: string) => {
    if (existingId) {
      setClasses((prev) =>
        prev.map((item) => (item.id === existingId ? { ...data, id: existingId } : item))
      );
    } else {
      const newItem: CourseClass = {
        ...data,
        id: `cls-${Date.now()}`,
      };
      setClasses((prev) => [...prev, newItem]);
    }
  };

  // Task handlers
  const handleOpenAddTask = (dateISO?: string) => {
    setEditingTask(null);
    setTaskDefaultDate(dateISO);
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: CourseTask) => {
    setEditingTask(task);
    setTaskDefaultDate(undefined);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (data: Omit<CourseTask, 'id'>, existingId?: string) => {
    if (existingId) {
      setTasks((prev) =>
        prev.map((item) => (item.id === existingId ? { ...data, id: existingId } : item))
      );
    } else {
      const newItem: CourseTask = {
        ...data,
        id: `tsk-${Date.now()}`,
      };
      setTasks((prev) => [...prev, newItem]);
    }
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'pendiente' ? 'completada' : 'pendiente' }
          : t
      )
    );
  };

  // Note handlers
  const handleOpenAddNote = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: CourseNote) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  const handleSaveNote = (data: Omit<CourseNote, 'id'>, existingId?: string) => {
    if (existingId) {
      setNotes((prev) =>
        prev.map((item) => (item.id === existingId ? { ...data, id: existingId } : item))
      );
    } else {
      const newItem: CourseNote = {
        ...data,
        id: `not-${Date.now()}`,
      };
      setNotes((prev) => [newItem, ...prev]);
    }
  };

  // Confirm delete or reset handler
  const handleConfirmPendingDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === 'class') {
      setClasses((prev) => prev.filter((c) => c.id !== pendingDelete.item.id));
    } else if (pendingDelete.type === 'task') {
      setTasks((prev) => prev.filter((t) => t.id !== pendingDelete.item.id));
    } else if (pendingDelete.type === 'note') {
      setNotes((prev) => prev.filter((n) => n.id !== pendingDelete.item.id));
    } else if (pendingDelete.type === 'reset') {
      setClasses(buildInitialClasses());
      setTasks(buildInitialTasks());
      setNotes(buildInitialNotes());
    }
    setPendingDelete(null);
  };

  const pendingTasksCount = tasks.filter((t) => t.status === 'pendiente').length;

  const deleteDialogContent = (() => {
    if (!pendingDelete) {
      return { title: '', description: '', confirmLabel: 'Sí, eliminar' };
    }
    if (pendingDelete.type === 'class') {
      return {
        title: '¿Eliminar esta clase?',
        description: `Se eliminará "${pendingDelete.item.title}" de tu calendario.`,
        confirmLabel: 'Sí, eliminar clase',
      };
    }
    if (pendingDelete.type === 'task') {
      return {
        title: '¿Eliminar esta tarea?',
        description: `Se eliminará "${pendingDelete.item.title}" de tu lista de tareas.`,
        confirmLabel: 'Sí, eliminar tarea',
      };
    }
    if (pendingDelete.type === 'note') {
      return {
        title: '¿Eliminar esta nota?',
        description: `Se eliminará el apunte "${pendingDelete.item.title}".`,
        confirmLabel: 'Sí, eliminar nota',
      };
    }
    return {
      title: '¿Restablecer datos de ejemplo?',
      description:
        'Se restaurarán las clases, tareas y apuntes iniciales del curso de Google AI Studio. Los cambios actuales se reemplazarán.',
      confirmLabel: 'Sí, restablecer',
    };
  })();

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900">
      <Navigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        pendingTasksCount={pendingTasksCount}
      />

      <div className="lg:pl-64">
        {/* Mobile Top App Header (non-sticky so fixed bottom nav stays well under 15% cap) */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3.5">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 truncate">
                Mi Agenda de Aprendizaje
              </h1>
              <p className="text-xs text-slate-500 truncate">
                Curso de Google AI Studio · {TAB_TITLES[activeTab]}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 lg:pb-12">
          {activeTab === 'inicio' && (
            <InicioView
              classes={classes}
              tasks={tasks}
              onNavigate={handleSelectTab}
              onAddClass={() => handleOpenAddClass()}
              onEditClass={handleOpenEditClass}
              onDeleteClass={(item) => setPendingDelete({ type: 'class', item })}
              onAddTask={() => handleOpenAddTask()}
              onEditTask={handleOpenEditTask}
              onDeleteTask={(item) => setPendingDelete({ type: 'task', item })}
              onToggleTaskStatus={handleToggleTaskStatus}
              onAddNote={handleOpenAddNote}
            />
          )}

          {activeTab === 'calendario' && (
            <CalendarioView
              classes={classes}
              tasks={tasks}
              onAddClassForDate={(dateISO) => handleOpenAddClass(dateISO)}
              onEditClass={handleOpenEditClass}
              onDeleteClass={(item) => setPendingDelete({ type: 'class', item })}
              onAddTaskForDate={(dateISO) => handleOpenAddTask(dateISO)}
              onEditTask={handleOpenEditTask}
              onDeleteTask={(item) => setPendingDelete({ type: 'task', item })}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'tareas' && (
            <TareasView
              tasks={tasks}
              onAddTask={() => handleOpenAddTask()}
              onEditTask={handleOpenEditTask}
              onDeleteTask={(item) => setPendingDelete({ type: 'task', item })}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {activeTab === 'notas' && (
            <NotasView
              notes={notes}
              onAddNote={handleOpenAddNote}
              onEditNote={handleOpenEditNote}
              onDeleteNote={(item) => setPendingDelete({ type: 'note', item })}
            />
          )}

          {activeTab === 'progreso' && (
            <ProgresoView
              tasks={tasks}
              classes={classes}
              notes={notes}
              onToggleTaskStatus={handleToggleTaskStatus}
              onEditTask={handleOpenEditTask}
              onRequestResetSampleData={() => setPendingDelete({ type: 'reset' })}
            />
          )}
        </main>
      </div>

      {/* Modals / Bottom Sheets */}
      <ClassModal
        isOpen={classModalOpen}
        editingClass={editingClass}
        defaultDate={classDefaultDate}
        onClose={() => setClassModalOpen(false)}
        onSave={handleSaveClass}
      />

      <TaskModal
        isOpen={taskModalOpen}
        editingTask={editingTask}
        defaultDate={taskDefaultDate}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
      />

      <NoteModal
        isOpen={noteModalOpen}
        editingNote={editingNote}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
      />

      <ConfirmDeleteModal
        isOpen={pendingDelete !== null}
        title={deleteDialogContent.title}
        description={deleteDialogContent.description}
        confirmLabel={deleteDialogContent.confirmLabel}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmPendingDelete}
      />
    </div>
  );
}
