import { Moon, Plus, Sun } from 'lucide-react';
import { StatusBadge } from '../../../components/ui';
import { fmt, fmtLong, fromYmd, money, todayYmd } from '../../../lib/dates';

// Color de cada turno según su estado (confirmado, pendiente, completado).
const TONE = {
  confirmed: 'border-cyan bg-cyan-dim',
  pending: 'border-amber-400 bg-amber-400/10',
  completed: 'border-free bg-free/10',
};

const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
const firstName = (name = '') => name.split(' ')[0];
const shortName = (name = '') => {
  const [a, b] = name.split(' ');
  return b ? `${a} ${b[0]}.` : a;
};

/* ---------------------- Tira de la semana (vista día) ---------------------- */

export function WeekStrip({ days, appts, cursor, onPick }) {
  const today = todayYmd();
  const count = (d) => appts.filter((a) => a.date === d && a.status !== 'cancelled').length;
  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-3" role="group" aria-label="Días de la semana">
      {days.map((d) => {
        const active = d.date === cursor;
        const n = count(d.date);
        return (
          <button
            key={d.date}
            onClick={() => onPick(d.date)}
            aria-current={active ? 'date' : undefined}
            aria-label={`${fmtLong(d.date)}: ${d.isOpen ? `${n} turnos, ${d.free} horarios libres` : 'cerrado'}`}
            className={`rounded-2xl border min-h-[5.5rem] px-1 py-2 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              active ? 'bg-cyan text-black border-cyan shadow-lg' : 'bg-dark-surface border-dark-border hover:border-cyan/60'
            }`}
          >
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${active ? '' : d.date === today ? 'text-cyan' : 'text-gray-300'}`}>
              {fmt(d.date, 'EEE')}
            </span>
            <span className="font-bebas text-3xl sm:text-4xl leading-none">{fromYmd(d.date).getDate()}</span>
            <span className={`text-xs sm:text-sm font-semibold ${active ? '' : 'text-gray-300'}`}>
              {d.isOpen ? (
                <>
                  <span aria-hidden="true" className="sm:hidden">{n}</span>
                  <span className="hidden sm:inline">{n} {n === 1 ? 'turno' : 'turnos'}</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="sm:hidden">—</span>
                  <span className="hidden sm:inline">Cerrado</span>
                </>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------- Día: línea de tiempo --------------------------- */

// Alto de cada franja de 30 min: un turno de 1 hora ocupa casi 10 rem. En celular es más alto porque el texto se apila.
const ROW_CLASS = '[--row:7rem] sm:[--row:4.75rem]';

function itemsOf(slots) {
  const items = [];
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    if (s.status === 'busy') {
      const a = s.appointment;
      if (!a.first) continue;
      let span = 1;
      while (slots[i + span]?.status === 'busy' && slots[i + span].appointment.id === a.id) span++;
      items.push({ type: 'appt', row: i, span, slot: s, appt: a });
    } else {
      items.push({ type: s.status === 'free' ? 'free' : 'past', row: i, span: 1, slot: s });
    }
  }
  return items;
}

export function DayTimeline({ day, onPickAppt, onPickFree }) {
  if (!day) return null;
  if (!day.isOpen) {
    return (
      <div className="text-center py-20">
        <p className="font-bebas text-5xl tracking-wider text-gray-300">Cerrado</p>
        <p className="text-muted mt-2">{day.reason && day.reason !== 'Cerrado' ? day.reason : 'Este día no se atiende.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {day.shifts.map((sh, si) => {
        const slots = day.slots.filter((s) => s.shift === si);
        const items = itemsOf(slots);
        const morning = sh.open < '13:00';
        const Icon = morning ? Sun : Moon;
        return (
          <section key={sh.open} aria-label={`Turno ${morning ? 'mañana' : 'tarde'}`}>
            <h3 className="flex items-center gap-3 mb-4 font-sans font-extrabold text-xl">
              <span aria-hidden="true" className="w-10 h-10 rounded-xl bg-cyan-dim text-cyan flex items-center justify-center"><Icon size={22} /></span>
              {morning ? 'Mañana' : 'Tarde'}
              <span className="text-muted font-semibold text-base">{sh.open} a {sh.close} hs</span>
            </h3>

            <div className={`grid ${ROW_CLASS}`} style={{ gridTemplateColumns: '4.5rem minmax(0,1fr)', gridTemplateRows: `repeat(${slots.length}, var(--row))` }}>
              {slots.map((s, i) => (
                <div key={s.time} style={{ gridColumn: 1, gridRow: i + 1 }} className="pt-3 font-mono text-[15px] font-bold text-gray-300">
                  {s.time}
                </div>
              ))}

              {items.map((it) => (
                <div
                  key={it.slot.time}
                  style={{ gridColumn: 2, gridRow: `${it.row + 1} / span ${it.span}` }}
                  className="py-1"
                >
                  {it.type === 'appt' && <AppointmentBlock appt={it.appt} span={it.span} onClick={() => onPickAppt(it.appt, day.date)} />}
                  {it.type === 'free' && (
                    <button
                      onClick={() => onPickFree(day.date, it.slot.time)}
                      className="group h-full w-full rounded-2xl border-2 border-dashed border-dark-border px-5 flex items-center gap-3 text-muted hover:text-cyan hover:border-cyan hover:bg-cyan-dim transition-colors"
                    >
                      <Plus size={20} aria-hidden="true" />
                      <span className="font-semibold">Horario libre</span>
                      <span className="hidden sm:inline text-sm">· tocá para cargar un turno a las {it.slot.time}</span>
                    </button>
                  )}
                  {it.type === 'past' && (
                    <div className="h-full flex items-center" aria-hidden="true">
                      <span className="w-full border-t border-dashed border-dark-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function AppointmentBlock({ appt, span, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`${appt.startTime} a ${appt.endTime}, ${appt.name}, ${appt.serviceName}, ${appt.status === 'completed' ? 'completado' : 'confirmado'}. Ver detalle`}
      className={`h-full w-full text-left rounded-2xl border-l-[6px] ${TONE[appt.status] || TONE.confirmed} px-5 py-3 flex items-center gap-4 hover:brightness-110 transition`}
    >
      <span aria-hidden="true" className="hidden sm:flex w-12 h-12 shrink-0 rounded-full bg-dark-surface items-center justify-center font-bebas text-2xl text-cyan">
        {initials(appt.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans font-extrabold text-lg leading-tight break-words sm:truncate">{appt.name}</span>
        <span className="block text-gray-300 text-[15px] sm:truncate">{appt.serviceName} · {appt.startTime} a {appt.endTime} hs</span>
        <span className="sm:hidden mt-1.5 flex items-center gap-3"><StatusBadge status={appt.status} /><b>{money(appt.price)}</b></span>
        {span > 1 && appt.notes && <span className="block text-sm text-muted truncate mt-1">“{appt.notes}”</span>}
      </span>
      <span className="hidden md:block text-right text-sm text-gray-300 shrink-0">
        {appt.paymentMethod || 'Pago sin definir'}
        {appt.phone && <span className="block text-muted">{appt.phone}</span>}
      </span>
      <span className="hidden sm:block font-sans font-extrabold text-xl shrink-0">{money(appt.price)}</span>
      <span className="hidden sm:block shrink-0"><StatusBadge status={appt.status} /></span>
    </button>
  );
}

/* --------------------------- Semana: tablero ------------------------------- */

export function WeekBoard({ days, appts, onOpenDay, onPickAppt }) {
  const today = todayYmd();
  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-2">
      {/* Los días cerrados ocupan menos ancho para que los días con turnos respiren. */}
      <div
        className="grid gap-3 min-w-[64rem]"
        style={{ gridTemplateColumns: days.map((d) => (d.isOpen ? 'minmax(9.5rem,1fr)' : 'minmax(5.5rem,0.45fr)')).join(' ') }}
      >
        {days.map((d) => {
          const list = appts.filter((a) => a.date === d.date && a.status !== 'cancelled');
          return (
            <section
              key={d.date}
              aria-label={fmtLong(d.date)}
              className={`rounded-3xl border flex flex-col min-h-[26rem] ${d.date === today ? 'border-cyan/70 bg-cyan-dim/40' : 'border-dark-border bg-dark-surface'}`}
            >
              <button onClick={() => onOpenDay(d.date)} className="text-left px-4 pt-4 pb-3 border-b border-dark-border hover:bg-cyan-dim rounded-t-3xl transition-colors">
                <span className={`block text-sm font-bold uppercase tracking-wide ${d.date === today ? 'text-cyan' : 'text-gray-300'}`}>{fmt(d.date, 'EEEE')}</span>
                <span className="flex items-baseline gap-2">
                  <span className="font-bebas text-5xl leading-none">{fromYmd(d.date).getDate()}</span>
                  <span className="text-sm text-muted font-semibold">{d.isOpen ? `${list.length} ${list.length === 1 ? 'turno' : 'turnos'}` : ''}</span>
                </span>
              </button>

              {!d.isOpen ? (
                <p className="m-auto text-muted font-semibold py-10">Cerrado</p>
              ) : (
                <>
                  <ul className="p-3 space-y-2.5 flex-1">
                    {list.map((a) => (
                      <li key={a.id}>
                        <button
                          onClick={() => onPickAppt(a, a.date)}
                          className={`w-full text-left rounded-xl border-l-4 px-3 py-2.5 hover:brightness-110 transition ${TONE[a.status] || TONE.confirmed}`}
                        >
                          <span className="block font-mono text-sm font-bold text-cyan">{a.startTime}</span>
                          <span className="block font-bold text-base leading-tight break-words">{a.name}</span>
                          <span className="block text-sm text-gray-300">{a.serviceName}</span>
                        </button>
                      </li>
                    ))}
                    {!list.length && <li className="text-muted text-sm text-center py-8">Sin turnos</li>}
                  </ul>
                  <p className="px-4 py-3 border-t border-dark-border text-sm font-semibold text-emerald-200">{d.free} horarios libres</p>
                </>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Mes: calendario ---------------------------- */

export function MonthGrid({ days, appts, cursor, onOpenDay }) {
  const today = todayYmd();
  const month = cursor.slice(0, 7);
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[56rem]">
        <div className="grid grid-cols-7 gap-3 mb-3" aria-hidden="true">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
            <span key={d} className="text-sm font-bold text-gray-300 px-2">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-3">
          {days.map((d) => {
            const list = appts.filter((a) => a.date === d.date && a.status !== 'cancelled');
            const inMonth = d.date.startsWith(month);
            return (
              <button
                key={d.date}
                onClick={() => onOpenDay(d.date)}
                aria-label={`${fmtLong(d.date)}: ${d.isOpen ? `${list.length} turnos, ${d.free} libres` : 'cerrado'}`}
                aria-current={d.date === today ? 'date' : undefined}
                className={`min-h-[9.5rem] rounded-2xl border p-3 text-left flex flex-col gap-1.5 transition-colors hover:border-cyan ${
                  d.date === today ? 'border-cyan border-2' : 'border-dark-border'
                } ${inMonth ? 'bg-dark-surface' : 'bg-dark-surface2/50'}`}
              >
                <span className="flex items-center justify-between">
                  <span className={`font-bebas text-3xl leading-none ${d.date === today ? 'text-cyan' : inMonth ? 'text-white' : 'text-muted'}`}>{fromYmd(d.date).getDate()}</span>
                  {d.isOpen && list.length > 0 && (
                    <span className="min-w-7 h-7 px-2 rounded-full bg-cyan text-black text-sm font-extrabold flex items-center justify-center">{list.length}</span>
                  )}
                </span>
                {!d.isOpen ? (
                  <span className="text-muted text-sm mt-1">Cerrado</span>
                ) : (
                  <>
                    <span className="flex-1 space-y-1">
                      {list.slice(0, 3).map((a) => (
                        <span key={a.id} className={`block truncate rounded-md border-l-[3px] px-2 py-0.5 text-[13px] font-semibold ${TONE[a.status] || TONE.confirmed}`}>
                          {a.startTime} {shortName(a.name)}
                        </span>
                      ))}
                      {list.length > 3 && <span className="block text-sm text-muted font-semibold px-1">+{list.length - 3} más</span>}
                    </span>
                    {d.date >= today && <span className="text-[13px] font-semibold text-emerald-200">{d.free} libres</span>}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Lista del período (panel lateral) ------------------ */

export function PeriodList({ appts, onPick }) {
  const byDate = appts.reduce((acc, a) => ((acc[a.date] ||= []).push(a), acc), {});
  const dates = Object.keys(byDate).sort();
  if (!dates.length) {
    return (
      <div className="text-center py-12 px-4">
        <p className="font-sans font-bold text-lg text-gray-200">Sin turnos en este período</p>
        <p className="text-muted mt-1">Cuando alguien reserve, va a aparecer acá.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-x-8 gap-y-8 lg:grid-cols-2 2xl:grid-cols-3">
      {dates.map((date) => (
        <div key={date}>
          <h3 className="font-sans text-base font-extrabold text-cyan mb-3 px-1">{fmt(date, "EEEE d 'de' MMMM")}</h3>
          <ul className="space-y-2">
            {byDate[date].map((a) => (
              <li key={a.id}>
                <button onClick={() => onPick(a, date)} className={`w-full text-left rounded-xl border-l-4 px-4 py-3 flex items-center gap-4 hover:brightness-110 transition ${TONE[a.status] || TONE.confirmed}`}>
                  <span className="font-mono text-[15px] font-bold w-14 shrink-0">{a.startTime}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold truncate">{firstName(a.name)} {a.name.split(' ').slice(1).join(' ')}</span>
                    <span className="block text-sm text-gray-300 truncate">{a.serviceName}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="block font-bold text-[15px]">{money(a.price)}</span>
                    <span className="block text-xs text-muted">{a.status === 'completed' ? 'Completado' : a.paymentMethod || ''}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
