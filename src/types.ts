export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export type TaskPriority = 'baja' | 'media' | 'alta';

export interface CourseClass {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  modality: string;
  notes: string;
}

export interface CourseTask {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  module: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CourseNote {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}

export const COURSE_MODULES = [
  'Fundamentos de AI Studio',
  'Ingeniería de Prompts',
  'Salida Estructurada',
  'Function Calling',
  'Multimodalidad y Audio',
  'Grounding y RAG',
] as const;
