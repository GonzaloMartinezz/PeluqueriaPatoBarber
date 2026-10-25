import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Minus, X } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import {
  todayYmd,
  weekStart,
  weekEnd,
  monthStart,
  monthEnd,
  shiftDays,
  shiftMonths,
  fmt,
  fmtLong,
  fromYmd,
} from '../../lib/dates';
import { Alert, Loading } from '../ui';

const VIEWS = [
  ['day', 'Día'],
  ['week', 'Semana'],
  ['month', 'Mes'],
];

const MAX_SKIPS = 6;

const STATUS_TEXT = { free: 'Disponible', busy: 'Ocupado', unavailable: 'No disponible' };

// Verde = libre, rojo (rayado) = ocupado, gris punteado = no disponible.
// Además del color, cada estado lleva ícono y texto.
const SLOT_STYLE = {
  free: 'border-free/60 bg-free/10 text-emerald-100 hover:bg-free/25 cursor-pointer',
  busy: 'slot-busy border-busy/60 text-rose-100',
  unavailable: 'slot-unavailable border-white/5 text-muted/70 cursor-not-allowed',
};
const SELECTED = 'ring-2 ring-cyan ring-offset-2 ring-offset-dark-surface bg-free/40 text-white';
const STATUS_ICON = { free: Check, busy: X, unavailable: Minus };

// Rango que se pide al servidor. En vista día se trae la semana entera:
// alimenta la tira de días y moverse entre días no vuelve a pedir datos.
function fetchRange(view, cursor) {
  if (view === 'month') return { from: weekStart(monthStart(cursor)), to: weekEnd(monthEnd(cursor)) };
  return { from: weekStart(cursor), to: weekEnd(cursor) };
}

function title(view, cursor) {
  if (view === 'day') return fmtLong(cursor);
  if (view === 'week') return `${fmt(weekStart(cursor), "d 'de' MMM")} – ${fmt(weekEnd(cursor), "d 'de' MMM yyyy")}`;
  return fmt(cursor, 'MMMM yyyy');
}

/**
 * Agenda del peluquero en vista día / semana / mes.
 * - admin=false: el cliente ve libre/ocupado y elige una franja (onPickSlot).
 * - admin=true: el barbero ve además quién ocupa cada franja (onPickAppt) y
 *   puede tocar una franja libre para cargar un turno (onPickSlot).
 */
export default function AgendaCalendar({
  admin = false,
  serviceId = '',
  selected = null,
  onPickSlot,
  onPickAppt,
  onRangeChange,
  refreshKey = 0,
}) {
  const [view, setView] = useState('day');
  const [cursor, setCursor] = useState(todayYmd());
  const [loaded, setLoaded] = useState(null); // { key, days } de la última respuesta
  const [error, setError] = useState('');

  const { from, to } = useMemo(() => fetchRange(view, cursor), [view, cursor]);
  const key = `${from}|${to}`;
  // Mientras llega la respuesta del rango nuevo no se muestran días del rango anterior.
  const days = loaded?.key === key ? loaded.days : null;

  // Al abrir la agenda, el cliente cae en el primer día que todavía tiene lugar
  // (si hoy ya cerró, salta al próximo). Solo ocurre al inicio, no al navegar a mano.
  const [skips, setSkips] = useState(0);
  if (!admin && view === 'day' && days && skips < MAX_SKIPS) {
    const current = days.find((d) => d.date === cursor);
    if (current && current.free === 0) {
      const next = days.find((d) => d.date > cursor && d.free > 0);
      setSkips(skips + 1);
      setCursor(next ? next.date : shiftDays(weekEnd(cursor), 1));
    } else {
      setSkips(MAX_SKIPS);
    }
  }

  useEffect(() => {
    if (!onRangeChange) return;
    if (view === 'day') onRangeChange({ view, from: cursor, to: cursor });
    else if (view === 'week') onRangeChange({ view, from, to });
    else onRangeChange({ view, from: monthStart(cursor), to: monthEnd(cursor) }); // sin días de relleno
  }, [view, cursor, from, to, onRangeChange]);

  useEffect(() => {
    let cancelled = false;
    api
      .get(admin ? '/admin/slots' : '/appointments/slots', { params: { from, to, serviceId: serviceId || undefined } })
      .then(({ data }) => {
        if (cancelled) return;
        setError('');
        setLoaded({ key: `${from}|${to}`, days: data.days });
      })
      .catch((e) => !cancelled && setError(errMsg(e)));
    return () => {
      cancelled = true;
    };
  }, [admin, from, to, serviceId, refreshKey]);

  const move = (dir) => {
    if (view === 'month') setCursor(shiftMonths(cursor, dir));
    else setCursor(shiftDays(cursor, dir * (view === 'week' ? 7 : 1)));
  };

  const openDay = (date) => {
    setCursor(date);
    setView('day');
  };

  const isSelected = (date, time) => selected?.date === date && selected?.time === time;

  const pickSlot = (date, slot) => {
    if (slot.status === 'free') onPickSlot?.(date, slot.time);
    else if (slot.status === 'busy' && admin) onPickAppt?.(slot.appointment, date);
  };

  const unit = view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día';
  const navBtn = 'w-11 h-11 flex items-center justify-center border border-white/20 rounded-sm hover:border-cyan hover:text-cyan';

  return (
    <section className="bg-dark-surface border border-dark-border rounded-3xl" aria-label="Agenda">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-b border-dark-border">
        <div role="group" aria-label="Vista de la agenda" className="flex rounded-sm overflow-hidden border border-white/20">
          {VIEWS.map(([k, label]) => (
            <button
              key={k}
              aria-pressed={view === k}
              onClick={() => setView(k)}
              className={`min-w-[4.5rem] min-h-11 px-4 font-bebas tracking-widest text-base transition-colors ${
                view === k ? 'bg-cyan text-black' : 'text-gray-200 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => move(-1)} className={navBtn} aria-label={`${unit} anterior`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={() => setCursor(todayYmd())}
            className="min-h-11 px-4 border border-white/20 rounded-sm font-mono text-xs tracking-widest hover:border-cyan hover:text-cyan"
          >
            HOY
          </button>
          <button onClick={() => move(1)} className={navBtn} aria-label={`${unit} siguiente`}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-4 pt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <h2 className="text-2xl sm:text-3xl font-bebas tracking-wider" aria-live="polite">{title(view, cursor)}</h2>
        <Legend />
      </div>

      <div className="p-3 sm:p-4">
        {error && <Alert>{error}</Alert>}
        {!days && !error && <Loading label="Cargando agenda…" />}
        {days && view === 'day' && (
          <>
            <DayStrip days={days} cursor={cursor} onPick={setCursor} />
            <DayView day={days.find((d) => d.date === cursor)} admin={admin} isSelected={isSelected} onPick={pickSlot} />
          </>
        )}
        {days && view === 'week' && (
          <WeekView days={days} admin={admin} isSelected={isSelected} onPick={pickSlot} onOpenDay={openDay} />
        )}
        {days && view === 'month' && <MonthView days={days} cursor={cursor} admin={admin} onOpenDay={openDay} />}
      </div>
    </section>
  );
}

function Legend() {
  const item = (cls, Icon, text) => (
    <span className="flex items-center gap-1.5">
      <i className={`w-5 h-5 rounded-sm border flex items-center justify-center ${cls}`}>
        <Icon size={12} aria-hidden="true" />
      </i>
      {text}
    </span>
  );
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs tracking-wider uppercase text-gray-300">
      {item('border-free/60 bg-free/20 text-emerald-100', Check, 'Libre')}
      {item('slot-busy border-busy/60 text-rose-100', X, 'Ocupado')}
      {item('slot-unavailable border-white/15 text-muted', Minus, 'No disponible')}
    </div>
  );
}

function ClosedNotice({ day }) {
  return (
    <div className="text-center py-12 text-muted">
      <p className="font-bebas text-4xl tracking-wider text-gray-300">Cerrado</p>
      {day?.reason && day.reason !== 'Cerrado' && <p className="text-sm mt-1">{day.reason}</p>}
    </div>
  );
}

/* ------------------------- Tira de días (vista día) ------------------------ */

function DayStrip({ days, cursor, onPick }) {
  const today = todayYmd();
  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4" role="group" aria-label="Días de la semana">
      {days.map((d) => {
        const active = d.date === cursor;
        const past = d.date < today;
        const state = !d.isOpen ? 'closed' : d.free > 0 ? 'free' : d.busy > 0 ? 'busy' : 'none';
        const label = `${fmtLong(d.date)}: ${
          !d.isOpen ? 'cerrado' : d.free > 0 ? `${d.free} horarios libres` : d.busy > 0 ? 'sin horarios libres' : 'sin horarios'
        }`;
        return (
          <button
            key={d.date}
            onClick={() => onPick(d.date)}
            aria-label={label}
            aria-current={active ? 'date' : undefined}
            className={`min-h-[4.25rem] rounded-sm border flex flex-col items-center justify-center gap-0.5 transition-colors ${
              active
                ? 'bg-cyan text-black border-cyan'
                : `border-white/15 hover:border-cyan/70 ${past ? 'text-muted' : 'text-gray-100'}`
            }`}
          >
            <span className="font-mono text-[11px] tracking-wider uppercase">{fmt(d.date, 'EEE')}</span>
            <span className="font-bebas text-2xl leading-none">{fromYmd(d.date).getDate()}</span>
            <span aria-hidden="true" className="h-4 flex items-center">
              {state === 'free' && <Check size={14} className={active ? 'text-black' : 'text-free'} strokeWidth={3} />}
              {state === 'busy' && <X size={14} className={active ? 'text-black' : 'text-busy'} strokeWidth={3} />}
              {state === 'closed' && <Minus size={14} className="opacity-60" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------------- Día ---------------------------------- */

function DayView({ day, admin, isSelected, onPick }) {
  if (!day) return null;
  if (!day.isOpen) return <ClosedNotice day={day} />;
  return (
    <>
      <p className="text-muted text-xs font-mono tracking-wider mb-3 uppercase">
        {day.open} – {day.close} · {day.free} libres · {day.busy} ocupados
        {day.reason ? ` · ${day.reason}` : ''}
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {day.slots.map((slot) => {
          const appt = slot.appointment;
          const Icon = STATUS_ICON[slot.status];
          const clickable = slot.status === 'free' || (slot.status === 'busy' && admin);
          const text =
            slot.status === 'busy' && admin ? (appt.first ? `${appt.name} · ${appt.serviceName}` : '↳ continúa') : STATUS_TEXT[slot.status];
          return (
            <li key={slot.time}>
              <button
                disabled={!clickable}
                aria-pressed={slot.status === 'free' ? isSelected(day.date, slot.time) : undefined}
                aria-label={`${slot.time}, ${text}`}
                onClick={() => onPick(day.date, slot)}
                className={`w-full min-h-[3.25rem] border rounded-sm px-3 py-2 text-left transition-colors ${SLOT_STYLE[slot.status]} ${
                  isSelected(day.date, slot.time) ? SELECTED : ''
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-base font-bold">{slot.time}</span>
                  <Icon size={16} strokeWidth={3} aria-hidden="true" className="shrink-0 opacity-90" />
                </span>
                <span className="block text-xs truncate">{text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ------------------------------- Semana --------------------------------- */

function WeekView({ days, admin, isSelected, onPick, onOpenDay }) {
  // Filas = unión de todas las horas de la semana (los días pueden tener horarios distintos).
  const times = useMemo(() => [...new Set(days.flatMap((d) => d.slots.map((s) => s.time)))].sort(), [days]);
  const today = todayYmd();

  if (!times.length) {
    return <p className="text-center text-muted py-10">No hay horarios habilitados esta semana.</p>;
  }

  return (
    <>
      <p className="md:hidden text-muted text-xs mb-2">Deslizá hacia los costados para ver todos los días.</p>
      <div className="overflow-x-auto -mx-3 px-3 sm:-mx-4 sm:px-4 pb-2">
        <table className="w-full min-w-[620px] border-separate border-spacing-1">
          <caption className="sr-only">Agenda semanal</caption>
          <thead>
            <tr>
              <th scope="col" className="w-14 sticky left-0 bg-dark-surface z-10"><span className="sr-only">Hora</span></th>
              {days.map((d) => (
                <th key={d.date} scope="col" className="font-normal">
                  <button
                    onClick={() => onOpenDay(d.date)}
                    aria-label={`Ver ${fmtLong(d.date)}`}
                    className={`w-full min-h-12 rounded-sm border text-center hover:border-cyan ${
                      d.date === today ? 'border-cyan text-cyan' : 'border-white/15 text-gray-100'
                    }`}
                  >
                    <span className="block font-mono text-[11px] tracking-wider uppercase">{fmt(d.date, 'EEE')}</span>
                    <span className="block font-bebas text-xl leading-none">{fromYmd(d.date).getDate()}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <th scope="row" className="font-mono text-xs text-muted text-right pr-1 font-normal sticky left-0 bg-dark-surface z-10">{time}</th>
                {days.map((d) => {
                  const slot = d.slots.find((s) => s.time === time);
                  if (!slot) {
                    return <td key={d.date} className="h-11 rounded-sm bg-white/[0.02]" title={d.isOpen ? '' : d.reason || 'Cerrado'} />;
                  }
                  const Icon = STATUS_ICON[slot.status];
                  const clickable = slot.status === 'free' || (slot.status === 'busy' && admin);
                  const who = slot.appointment ? `, ${slot.appointment.name}` : '';
                  return (
                    <td key={d.date} className="p-0">
                      <button
                        disabled={!clickable}
                        aria-pressed={slot.status === 'free' ? isSelected(d.date, time) : undefined}
                        aria-label={`${fmtLong(d.date)} ${time}, ${STATUS_TEXT[slot.status]}${who}`}
                        onClick={() => onPick(d.date, slot)}
                        className={`w-full h-11 border rounded-sm text-[11px] px-1 flex items-center justify-center gap-1 transition-colors ${SLOT_STYLE[slot.status]} ${
                          isSelected(d.date, time) ? SELECTED : ''
                        }`}
                      >
                        {admin && slot.appointment?.first ? (
                          <span className="truncate">{slot.appointment.name}</span>
                        ) : (
                          <Icon size={14} strokeWidth={3} aria-hidden="true" className="opacity-80" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* --------------------------------- Mes ---------------------------------- */

function MonthView({ days, cursor, admin, onOpenDay }) {
  const today = todayYmd();
  const month = cursor.slice(0, 7);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1" aria-hidden="true">
        {['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'].map((d) => (
          <span key={d} className="text-center font-mono text-[11px] tracking-wider text-muted">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const inMonth = d.date.startsWith(month);
          const past = d.date < today;
          const count = admin ? d.appointments?.length || 0 : d.busy;
          // Verde = hay lugar; rojo = completo; gris = cerrado / sin horarios.
          let tone = 'border-white/10 bg-white/[0.02] text-muted';
          let Icon = Minus;
          if (d.isOpen && d.free > 0) [tone, Icon] = ['border-free/50 bg-free/10', Check];
          else if (d.isOpen && d.busy > 0) [tone, Icon] = [past ? 'border-busy/30 bg-busy/5' : 'slot-busy border-busy/60', X];
          const label = `${fmtLong(d.date)}: ${
            !d.isOpen ? 'cerrado' : `${d.free} libres, ${count} ${admin ? 'turnos' : 'ocupados'}`
          }`;
          return (
            <button
              key={d.date}
              onClick={() => onOpenDay(d.date)}
              aria-label={label}
              aria-current={d.date === today ? 'date' : undefined}
              className={`min-h-[4.25rem] sm:min-h-[5.5rem] border rounded-sm p-1 sm:p-2 text-left transition-colors hover:border-cyan ${tone} ${
                d.date === today ? 'ring-1 ring-cyan' : ''
              }`}
            >
              <span className="flex items-start justify-between">
                <span className={`font-bebas text-xl leading-none ${d.date === today ? 'text-cyan' : inMonth ? 'text-white' : 'text-muted'}`}>
                  {fromYmd(d.date).getDate()}
                </span>
                <Icon size={13} strokeWidth={3} aria-hidden="true" className="opacity-80" />
              </span>
              {!d.isOpen ? (
                <span className="block text-[11px] text-muted mt-1">Cerrado</span>
              ) : (
                <span className="block text-[11px] sm:text-xs mt-1 leading-tight">
                  {d.free > 0 && <span className="block text-emerald-200">{d.free} libres</span>}
                  {(count > 0 || d.free > 0) && (
                    <span className={`block ${count > 0 ? 'text-rose-200' : 'text-muted'}`}>
                      {count} {admin ? 'turnos' : 'ocup.'}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
