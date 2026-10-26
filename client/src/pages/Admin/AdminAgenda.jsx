import { useEffect, useMemo, useState } from 'react';
import useAutoRefresh from '../../lib/useAutoRefresh';
import { Banknote, CalendarCheck, CalendarClock, ChevronLeft, ChevronRight, Plus, Users } from 'lucide-react';
import { Alert, Button, Loading, PageTitle } from '../../components/ui';
import api, { errMsg } from '../../lib/api';
import {
  fmt,
  fmtLong,
  monthEnd,
  monthStart,
  money,
  shiftDays,
  shiftMonths,
  todayYmd,
  weekEnd,
  weekStart,
} from '../../lib/dates';
import { DetailModal, NewAppointmentModal } from './agenda/AppointmentModals';
import { DayTimeline, MonthGrid, PeriodList, WeekBoard, WeekStrip } from './agenda/AgendaViews';

const VIEWS = [
  ['day', 'Día'],
  ['week', 'Semana'],
  ['month', 'Mes'],
];
const PERIOD_WORD = { day: 'del día', week: 'de la semana', month: 'del mes' };
const MAX_SKIPS = 7;

// Rango que se pide al servidor: en vista día se trae la semana (alimenta la tira de días).
function fetchRange(view, cursor) {
  if (view === 'month') return { from: weekStart(monthStart(cursor)), to: weekEnd(monthEnd(cursor)) };
  return { from: weekStart(cursor), to: weekEnd(cursor) };
}

function titleOf(view, cursor) {
  if (view === 'day') return fmtLong(cursor);
  if (view === 'week') return `${fmt(weekStart(cursor), "d 'de' MMMM")} al ${fmt(weekEnd(cursor), "d 'de' MMMM")}`;
  return fmt(cursor, 'MMMM yyyy');
}

function Kpi({ icon: Icon, label, value, tone = 'text-cyan' }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
      <span aria-hidden="true" className={`w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-cyan-dim flex items-center justify-center ${tone}`}><Icon size={24} /></span>
      <div className="min-w-0">
        <p className="text-gray-300 text-sm font-semibold">{label}</p>
        <p className="font-sans font-extrabold text-xl sm:text-3xl leading-tight whitespace-nowrap">{value}</p>
      </div>
    </div>
  );
}

export default function AdminAgenda() {
  const [view, setView] = useState('day');
  const [cursor, setCursor] = useState(todayYmd());
  const [loaded, setLoaded] = useState(null); // { key, days, appts }
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState(null); // { appt, date }
  const [newTurn, setNewTurn] = useState(null); // { date, time } al abrir el alta
  const [error, setError] = useState('');
  const [skips, setSkips] = useState(0);

  const { from, to } = useMemo(() => fetchRange(view, cursor), [view, cursor]);
  const key = `${from}|${to}`;
  const data = loaded?.key === key ? loaded : null;
  const refresh = () => setRefreshKey((k) => k + 1);
  useAutoRefresh(refresh, 20000);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.get('/admin/slots', { params: { from, to } }), api.get('/admin/appointments', { params: { from, to } })])
      .then(([s, a]) => {
        if (cancelled) return;
        setError('');
        setLoaded({ key: `${from}|${to}`, days: s.data.days, appts: a.data.appointments });
      })
      .catch((e) => !cancelled && setError(errMsg(e)));
    return () => {
      cancelled = true;
    };
  }, [from, to, refreshKey]);

  // Al abrir, si hoy está cerrado (domingo, lunes, feriado) salta al próximo día con atención.
  if (view === 'day' && data && skips < MAX_SKIPS) {
    const current = data.days.find((d) => d.date === cursor);
    if (current && !current.isOpen) {
      const next = data.days.find((d) => d.date > cursor && d.isOpen);
      setSkips(skips + 1);
      setCursor(next ? next.date : shiftDays(weekEnd(cursor), 1));
    } else {
      setSkips(MAX_SKIPS);
    }
  }

  const move = (dir) => {
    if (view === 'month') setCursor(shiftMonths(cursor, dir));
    else setCursor(shiftDays(cursor, dir * (view === 'week' ? 7 : 1)));
  };
  const openDay = (date) => {
    setCursor(date);
    setView('day');
  };

  // Turnos y totales del período que se está mirando (sin cancelados).
  const inPeriod = useMemo(() => {
    if (!data) return [];
    const month = cursor.slice(0, 7);
    return data.appts.filter((a) => a.status !== 'cancelled' && (view === 'day' ? a.date === cursor : view === 'week' || a.date.startsWith(month)));
  }, [data, view, cursor]);

  const stats = useMemo(() => {
    if (!data) return null;
    const month = cursor.slice(0, 7);
    const days = data.days.filter((d) => (view === 'day' ? d.date === cursor : view === 'week' || d.date.startsWith(month)));
    return {
      turnos: inPeriod.length,
      libres: days.reduce((s, d) => s + (d.free || 0), 0),
      cobrado: inPeriod.filter((a) => a.status === 'completed').reduce((s, a) => s + a.price, 0),
      estimado: inPeriod.reduce((s, a) => s + a.price, 0),
    };
  }, [data, inPeriod, view, cursor]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}`, { status });
      setDetail(null);
      refresh();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const dayData = data?.days.find((d) => d.date === cursor);
  const navBtn = 'w-12 h-12 flex items-center justify-center rounded-xl border border-white/20 hover:border-cyan hover:text-cyan transition-colors';

  return (
    <div>
      <PageTitle
        eyebrow="AGENDA"
        title="Turnos"
        actions={<Button onClick={() => setNewTurn({ date: cursor, time: '' })} className="rounded-full px-7"><Plus size={22} aria-hidden="true" /> NUEVO TURNO</Button>}
      >
        Mirá quién viene, cuándo y cuánto. Tocá un turno para ver el detalle o un horario libre para cargar uno.
      </PageTitle>

      <div className="mb-4"><Alert>{error}</Alert></div>

      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <Kpi icon={Users} label={`Turnos ${PERIOD_WORD[view]}`} value={stats.turnos} />
          <Kpi icon={CalendarClock} label="Horarios libres" value={stats.libres} tone="text-emerald-200" />
          <Kpi icon={CalendarCheck} label="Cobrado" value={money(stats.cobrado)} tone="text-emerald-200" />
          <Kpi icon={Banknote} label="Estimado" value={money(stats.estimado)} />
        </div>
      )}

      <div className="space-y-6">
        <section aria-label="Agenda" className="bg-dark-surface border border-dark-border rounded-3xl p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div role="group" aria-label="Vista de la agenda" className="flex rounded-xl overflow-hidden border border-white/20">
              {VIEWS.map(([k, label]) => (
                <button
                  key={k}
                  aria-pressed={view === k}
                  onClick={() => setView(k)}
                  className={`min-w-24 h-12 px-5 font-bebas tracking-widest text-xl transition-colors ${view === k ? 'bg-cyan text-black' : 'text-gray-200 hover:bg-cyan-dim'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => move(-1)} className={navBtn} aria-label={`${view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día'} anterior`}><ChevronLeft size={22} aria-hidden="true" /></button>
              <button onClick={() => setCursor(todayYmd())} className="h-12 px-6 rounded-xl border border-white/20 font-bold hover:border-cyan hover:text-cyan transition-colors">Hoy</button>
              <button onClick={() => move(1)} className={navBtn} aria-label={`${view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día'} siguiente`}><ChevronRight size={22} aria-hidden="true" /></button>
            </div>
          </div>

          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl mb-6" aria-live="polite">{titleOf(view, cursor)}</h2>

          {!data ? (
            <Loading label="Cargando agenda…" />
          ) : (
            <>
              {view === 'day' && (
                <>
                  <div className="mb-8"><WeekStrip days={data.days} appts={data.appts} cursor={cursor} onPick={setCursor} /></div>
                  <DayTimeline day={dayData} onPickAppt={(appt, date) => setDetail({ appt, date })} onPickFree={(date, time) => setNewTurn({ date, time })} />
                </>
              )}
              {view === 'week' && (
                <WeekBoard days={data.days} appts={data.appts} onOpenDay={openDay} onPickAppt={(appt, date) => setDetail({ appt, date })} />
              )}
              {view === 'month' && (
                <MonthGrid days={data.days} appts={data.appts} cursor={cursor} onOpenDay={openDay} />
              )}
            </>
          )}
        </section>

        {/* En semana y mes, el detalle de cada turno en una lista debajo (en día ya está en la línea de tiempo). */}
        {view !== 'day' && (
          <section aria-label={`Turnos ${PERIOD_WORD[view]}`} className="bg-dark-surface border border-dark-border rounded-3xl p-5 sm:p-8">
            <div className="flex items-baseline justify-between gap-3 mb-6">
              <h2 className="font-sans font-extrabold text-2xl sm:text-3xl">Turnos {PERIOD_WORD[view]}</h2>
              <span className="text-base font-bold text-cyan">{inPeriod.length} en total</span>
            </div>
            {data ? <PeriodList appts={inPeriod} onPick={(appt, date) => setDetail({ appt, date })} /> : <Loading />}
          </section>
        )}
      </div>

      <DetailModal key={detail?.appt?.id} detail={detail} onClose={() => setDetail(null)} onStatus={setStatus} onSaved={() => { setDetail(null); refresh(); }} />
      {newTurn && (
        <NewAppointmentModal
          key={`${newTurn.date}${newTurn.time}`}
          initial={newTurn}
          onClose={() => setNewTurn(null)}
          onCreated={() => { setNewTurn(null); refresh(); }}
        />
      )}
    </div>
  );
}
