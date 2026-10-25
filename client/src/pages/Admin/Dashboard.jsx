import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, Banknote, CalendarDays, Scale, Scissors, UserPlus, Users } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Loading, PageTitle, StatusBadge } from '../../components/ui';
import { fmt, fmtLong, money } from '../../lib/dates';
import { greeting } from '../../lib/useBusiness';
import useAuth from '../../store/auth';

const tip = {
  contentStyle: { background: 'var(--color-dark-surface)', border: '1px solid var(--color-dark-border)', borderRadius: 12, fontSize: 14, color: 'var(--color-white)', padding: '10px 14px' },
  labelStyle: { color: 'var(--color-white)', fontWeight: 700 },
  itemStyle: { color: 'var(--color-white)' },
};

const panel = 'bg-dark-surface border border-dark-border rounded-3xl p-6 sm:p-8';

/* Tarjeta grande de un período (hoy / semana / mes). */
function PeriodCard({ icon: Icon, label, sub, s }) {
  const done = s.clients ? Math.round((s.completed / s.clients) * 100) : 0;
  return (
    <section aria-label={label} className={`${panel} flex flex-col`}>
      <div className="flex items-center gap-4 mb-6">
        <span aria-hidden="true" className="w-12 h-12 rounded-2xl bg-cyan-dim text-cyan flex items-center justify-center"><Icon size={24} /></span>
        <div>
          <h2 className="font-sans font-extrabold text-2xl leading-tight">{label}</h2>
          <p className="text-muted text-[15px]">{sub}</p>
        </div>
      </div>

      <p className="text-gray-300 font-semibold flex items-center gap-2"><Users size={18} aria-hidden="true" /> Clientes</p>
      <p className="font-bebas text-8xl leading-none mt-1 text-white">{s.clients}</p>
      <div className="mt-4" role="img" aria-label={`${s.completed} de ${s.clients} atendidos`}>
        <div className="h-3 rounded-full bg-dark-surface2 overflow-hidden"><div className="h-full rounded-full bg-free" style={{ width: `${done}%` }} /></div>
        <p className="text-[15px] text-gray-300 mt-2">{s.completed} atendidos de {s.clients}</p>
      </div>

      <div className="mt-6 pt-6 border-t border-dark-border grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-300 font-semibold flex items-center gap-2"><Banknote size={18} aria-hidden="true" /> Cobrado</p>
          <p className="font-sans font-extrabold text-3xl text-emerald-200 mt-1">{money(s.revenue)}</p>
        </div>
        <div>
          <p className="text-gray-300 font-semibold">Estimado</p>
          <p className="font-sans font-extrabold text-3xl mt-1">{money(s.projected)}</p>
        </div>
      </div>
    </section>
  );
}

/* Lista con barras horizontales (medios de pago, servicios). */
function BarList({ rows, empty, valueOf, labelOf, suffix }) {
  if (!rows.length) return <p className="text-muted">{empty}</p>;
  const max = Math.max(...rows.map(valueOf), 1);
  return (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={labelOf(r)}>
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="font-semibold">{labelOf(r)}</span>
            <span className="text-gray-300 text-[15px]">{suffix(r)}</span>
          </div>
          <div className="h-2.5 rounded-full bg-dark-surface2 overflow-hidden"><div className="h-full rounded-full bg-cyan" style={{ width: `${(valueOf(r) / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export default function Dashboard() {
  const user = useAuth((s) => s.user);
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState([]);
  const [metric, setMetric] = useState('clients');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => {
      setStats(data);
      return api.get('/admin/appointments', { params: { from: data.today, to: data.today } });
    }).then(({ data }) => setToday(data.appointments.filter((a) => a.status !== 'cancelled')))
      .catch((e) => setError(errMsg(e)));
  }, []);

  if (error) return <Alert>{error}</Alert>;
  if (!stats) return <Loading />;

  const chart = stats.chart.map((c) => ({ ...c, label: fmt(c.date, 'd MMM') }));
  const axis = { stroke: 'var(--color-muted)', fontSize: 13 };

  return (
    <div className="space-y-8">
      <PageTitle
        eyebrow="RESUMEN"
        title={`${greeting()}, ${user?.name || ''}`}
        actions={<Link to="/admin/agenda"><Button className="rounded-full px-7"><CalendarDays size={22} aria-hidden="true" /> VER AGENDA</Button></Link>}
      >
        {fmtLong(stats.today)}. Así viene la peluquería.
      </PageTitle>

      {stats.legalComplete === false && (
        <Link to="/admin/configuracion" className="flex items-center gap-4 rounded-3xl border border-amber-400/50 bg-amber-400/10 p-5 text-amber-200 hover:bg-amber-400/20 transition-colors">
          <Scale size={26} aria-hidden="true" className="shrink-0" />
          <span className="flex-1"><b className="block text-lg">Completá tus datos legales</b>Faltan el nombre, CUIT, domicilio o email del titular que se muestran en la Política de Privacidad.</span>
          <ArrowRight size={22} aria-hidden="true" />
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <PeriodCard icon={CalendarDays} label="Hoy" sub={fmtLong(stats.today)} s={stats.day} />
        <PeriodCard icon={CalendarDays} label="Esta semana" sub={`${fmt(stats.week.from, 'd MMM')} al ${fmt(stats.week.to, 'd MMM')}`} s={stats.week} />
        <PeriodCard icon={CalendarDays} label="Este mes" sub={fmt(stats.today, 'MMMM yyyy')} s={stats.month} />
      </div>
      <p className="text-gray-300 text-[15px] -mt-3">
        <b className="text-white">Cobrado</b> = turnos que marcaste como completados. <b className="text-white">Estimado</b> = todos los turnos no cancelados.
      </p>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className={`${panel} xl:col-span-2`} aria-label="Últimos 30 días">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-sans font-extrabold text-2xl">Últimos 30 días</h2>
            <div role="group" aria-label="Qué mostrar" className="flex rounded-xl overflow-hidden border border-white/20">
              {[['clients', 'Clientes'], ['revenue', 'Dinero']].map(([k, l]) => (
                <button key={k} aria-pressed={metric === k} onClick={() => setMetric(k)} className={`h-11 px-6 font-bebas tracking-widest text-lg ${metric === k ? 'bg-cyan text-black' : 'text-gray-200 hover:bg-cyan-dim'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {metric === 'clients' ? (
                <BarChart data={chart}>
                  <CartesianGrid stroke="var(--color-dark-border)" vertical={false} />
                  <XAxis dataKey="label" {...axis} interval={4} />
                  <YAxis {...axis} allowDecimals={false} width={32} />
                  <Tooltip {...tip} formatter={(v) => [v, 'Clientes']} cursor={{ fill: 'var(--color-cyan-dim)' }} />
                  <Bar dataKey="clients" fill="var(--color-cyan)" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={chart}>
                  <CartesianGrid stroke="var(--color-dark-border)" vertical={false} />
                  <XAxis dataKey="label" {...axis} interval={4} />
                  <YAxis {...axis} width={56} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip {...tip} formatter={(v) => [money(v), 'Cobrado']} />
                  <Area dataKey="revenue" stroke="var(--color-free)" strokeWidth={3} fill="color-mix(in srgb, var(--color-free) 20%, transparent)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        <section className={panel} aria-label="Clientes registrados">
          <div className="flex items-center gap-4 mb-5">
            <span aria-hidden="true" className="w-12 h-12 rounded-2xl bg-cyan-dim text-cyan flex items-center justify-center"><UserPlus size={24} /></span>
            <h2 className="font-sans font-extrabold text-2xl">Clientes registrados</h2>
          </div>
          <p className="font-bebas text-8xl leading-none">{stats.registeredClients}</p>
          <p className="text-gray-300 mt-3 text-[15px]">
            {stats.newClientsThisMonth} {stats.newClientsThisMonth === 1 ? 'nuevo' : 'nuevos'} este mes
          </p>
          <Link to="/admin/clientes" className="mt-5 inline-flex items-center gap-2 font-bold text-cyan underline underline-offset-4 min-h-11">
            Ver todos los clientes <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={panel} aria-label="Medios de pago">
          <h2 className="font-sans font-extrabold text-2xl mb-6">Medios de pago <span className="text-muted text-base font-semibold">· este mes</span></h2>
          <BarList rows={stats.byPayment} empty="Todavía no hay turnos este mes." valueOf={(r) => r.total} labelOf={(r) => r.method} suffix={(r) => `${r.count} ${r.count === 1 ? 'turno' : 'turnos'} · ${money(r.total)}`} />
        </section>
        <section className={panel} aria-label="Servicios más pedidos">
          <h2 className="font-sans font-extrabold text-2xl mb-6"><Scissors size={22} aria-hidden="true" className="inline -mt-1 mr-2 text-cyan" />Servicios más pedidos <span className="text-muted text-base font-semibold">· este mes</span></h2>
          <BarList rows={stats.topServices} empty="Todavía no hay turnos este mes." valueOf={(r) => r.count} labelOf={(r) => r.name} suffix={(r) => `${r.count} ${r.count === 1 ? 'vez' : 'veces'}`} />
        </section>
      </div>

      <section className={panel} aria-label="Agenda de hoy">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl">Agenda de hoy</h2>
          <Link to="/admin/agenda" className="inline-flex items-center gap-2 font-bold text-cyan underline underline-offset-4 min-h-11">Abrir agenda completa <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        {today.length ? (
          <ul className="divide-y divide-dark-border">
            {today.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 py-4">
                <span className="font-mono font-bold text-lg text-cyan w-36">{a.startTime} – {a.endTime}</span>
                <span className="flex-1 min-w-[12rem]">
                  <span className="block font-bold text-lg">{a.name}</span>
                  <span className="block text-gray-300 text-[15px]">{a.serviceName}</span>
                </span>
                <span className="text-gray-300 text-[15px] w-36">{a.paymentMethod || 'Pago sin definir'}</span>
                <span className="font-extrabold text-lg w-28 text-right">{money(a.price)}</span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="font-sans font-bold text-xl">No hay turnos para hoy</p>
            <p className="text-gray-300 mt-1">Cuando un cliente reserve, lo vas a ver acá.</p>
          </div>
        )}
      </section>
    </div>
  );
}
