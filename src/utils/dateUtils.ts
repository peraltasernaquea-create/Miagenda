const MONTHS_SHORT = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

const MONTHS_LONG = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const WEEKDAYS_LONG = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toLocalISODate(new Date());
}

export function getRelativeDateISO(offsetDays: number, baseISO?: string): string {
  const base = baseISO ? parseISODate(baseISO) : new Date();
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offsetDays);
  return toLocalISODate(d);
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function formatShortDate(iso: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatLongDate(iso: string): string {
  if (!iso) return '';
  const d = parseISODate(iso);
  const weekday = WEEKDAYS_LONG[d.getDay()];
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized}, ${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatWeekdayDay(iso: string): { weekdayShort: string; dayNumber: number } {
  const d = parseISODate(iso);
  return {
    weekdayShort: WEEKDAYS_SHORT[d.getDay()],
    dayNumber: d.getDate(),
  };
}

export function getRelativeDayLabel(iso: string, todayISO: string): string {
  if (iso === todayISO) return 'Hoy';
  const tomorrow = getRelativeDateISO(1, todayISO);
  if (iso === tomorrow) return 'Mañana';
  const yesterday = getRelativeDateISO(-1, todayISO);
  if (iso === yesterday) return 'Ayer';
  return formatShortDate(iso);
}

export function getMondayOfWeek(iso: string): string {
  const d = parseISODate(iso);
  const day = d.getDay(); // 0 = Sun, 1 = Mon ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
  return toLocalISODate(monday);
}

export function getWeekDays(mondayISO: string): string[] {
  return Array.from({ length: 7 }, (_, i) => getRelativeDateISO(i, mondayISO));
}

export function formatWeekRange(mondayISO: string): string {
  const sundayISO = getRelativeDateISO(6, mondayISO);
  const mon = parseISODate(mondayISO);
  const sun = parseISODate(sundayISO);
  if (mon.getMonth() === sun.getMonth()) {
    return `${mon.getDate()} al ${sun.getDate()} de ${MONTHS_LONG[sun.getMonth()]}`;
  }
  return `${mon.getDate()} ${MONTHS_SHORT[mon.getMonth()]} al ${sun.getDate()} ${MONTHS_SHORT[sun.getMonth()]}`;
}
