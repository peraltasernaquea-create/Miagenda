import { Flag } from 'lucide-react';
import { TaskPriority } from '../types';

interface PriorityIndicatorProps {
  priority: TaskPriority;
}

const PRIORITY_STYLES: Record<
  TaskPriority,
  { label: string; colorClass: string }
> = {
  alta: {
    label: 'Prioridad Alta',
    colorClass: 'text-red-700',
  },
  media: {
    label: 'Prioridad Media',
    colorClass: 'text-amber-700',
  },
  baja: {
    label: 'Prioridad Baja',
    colorClass: 'text-slate-600',
  },
};

export function PriorityIndicator({ priority }: PriorityIndicatorProps) {
  const config = PRIORITY_STYLES[priority] || PRIORITY_STYLES.media;
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${config.colorClass}`}>
      <Flag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
