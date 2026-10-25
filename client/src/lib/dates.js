import { format, parseISO, addDays, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// Las fechas viajan como 'YYYY-MM-DD'; acá se convierten a Date local solo para mostrarlas.
export const ymd = (d) => format(d, 'yyyy-MM-dd');
export const fromYmd = (s) => parseISO(s);
export const todayYmd = () => ymd(new Date());

export const WEEK = { weekStartsOn: 1 };
export const weekStart = (s) => ymd(startOfWeek(fromYmd(s), WEEK));
export const weekEnd = (s) => ymd(endOfWeek(fromYmd(s), WEEK));
export const monthStart = (s) => ymd(startOfMonth(fromYmd(s)));
export const monthEnd = (s) => ymd(endOfMonth(fromYmd(s)));
export const shiftDays = (s, n) => ymd(addDays(fromYmd(s), n));
export const shiftMonths = (s, n) => ymd(addMonths(fromYmd(s), n));

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const fmt = (s, pattern) => cap(format(fromYmd(s), pattern, { locale: es }));
export const fmtLong = (s) => fmt(s, "EEEE d 'de' MMMM");
export const fmtShort = (s) => fmt(s, 'EEE d MMM');
export const fmtDate = (s) => format(fromYmd(s), 'dd/MM/yyyy');

export const money = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;

export const STATUS_LABEL = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
};
