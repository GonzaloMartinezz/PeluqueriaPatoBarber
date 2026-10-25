import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Banknote, UserPlus, Users } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Card, Loading, PageTitle, StatusBadge } from '../../components/ui';
import { fmt, fmtDate, fmtLong, money } from '../../lib/dates';

const tip = {
  contentStyle: { background: 'var(--color-dark-surface)', border: '1px solid var(--color-dark-border)', borderRadius: 6, fontSize: 12, color: 'var(--color-white)' },
  labelStyle: { color: 'var(--color-white)' },
  itemStyle: { color: 'var(--color-white)' },
};

function PeriodCard({ label, sub, s }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-cyan font-mono text-xs tracking-[0.3em] uppercase">{label}</p>
      <p className="text-muted text-xs mb-4">{sub}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-muted font-mono text-xs tracking-widest flex items-center gap-1"><Users size={12} aria-hidden="true" /> CLIENTES</p>
          <p className="text-4xl sm:text-5xl font-bebas text-white leading-none mt-1">{s.clients}</p>
          <p className="text-muted text-xs mt-1">{s.completed} atendidos</p>
        </div>
        <div>
          <p className="text-muted font-mono text-xs tracking-widest flex items-center gap-1"><Banknote size={12} aria-hidden="true" /> GANADO</p>
          <p className="text-3xl font-bebas text-free leading-none mt-2">{money(s.revenue)}</p>
          <p className="text-muted text-xs mt-2">Estimado: {money(s.projected)}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
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

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="RESUMEN" title="Control de la peluquería">{fmtLong(stats.today)}</PageTitle>

      <div className="grid md:grid-cols-3 gap-4">
        <PeriodCard label="Hoy" sub={fmt(stats.today, 'EEEE d')} s={stats.day} />
        <PeriodCard label="Esta semana" sub={`${fmt(stats.week.from, 'd MMM')} – ${fmt(stats.week.to, 'd MMM')}`} s={stats.week} />
        <PeriodCard label="Este mes" sub={fmt(stats.today, 'MMMM yyyy')} s={stats.month} />
      </div>
      <p className="text-muted text-xs -mt-4">
        <b className="text-gray-300">Ganado</b> = turnos marcados como completados. <b className="text-gray-300">Estimado</b> = todos los turnos no cancelados.
      </p>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bebas tracking-wider">Últimos 30 días</h2>
            <div className="flex rounded-sm overflow-hidden border border-dark-border text-sm">
              {[['clients', 'Clientes'], ['revenue', 'Dinero']].map(([k, l]) => (
                <button key={k} onClick={() => setMetric(k)}
                  className={`px-3 py-1.5 font-bebas tracking-widest ${metric === k ? 'bg-cyan text-black' : 'text-gray-300'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {metric === 'clients' ? (
                <BarChart data={chart}>
                  <CartesianGrid stroke="var(--color-dark-border)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--color-muted)" fontSize={11} interval={4} />
                  <YAxis stroke="var(--color-muted)" fontSize={11} allowDecimals={false} width={28} />
                  <Tooltip {...tip} formatter={(v) => [v, 'Clientes']} />
                  <Bar dataKey="clients" fill="var(--color-cyan)" radius={[2, 2, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={chart}>
                  <CartesianGrid stroke="var(--color-dark-border)" vertical={false} />
                  <XAxis dataKey="label" stroke="var(--color-muted)" fontSize={11} interval={4} />
                  <YAxis stroke="var(--color-muted)" fontSize={11} width={50} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip {...tip} formatter={(v) => [money(v), 'Ganado']} />
                  <Area dataKey="revenue" stroke="var(--color-free)" fill="color-mix(in srgb, var(--color-free) 20%, transparent)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-muted font-mono text-xs tracking-widest flex items-center gap-1"><UserPlus size={12} /> CLIENTES REGISTRADOS</p>
            <p className="text-5xl font-bebas leading-none mt-2">{stats.registeredClients}</p>
            <p className="text-muted text-xs mt-1">{stats.newClientsThisMonth} nuevos este mes · <Link to="/admin/clientes" className="text-cyan underline underline-offset-4">ver lista</Link></p>
          </Card>
          <Card className="p-5">
            <h3 className="text-xl font-bebas tracking-wider mb-2">Medios de pago (mes)</h3>
            {stats.byPayment.length ? stats.byPayment.map((p) => (
              <div key={p.method} className="flex justify-between text-sm py-1 border-b border-dark-border/50 last:border-0">
                <span className="text-gray-300">{p.method} <span className="text-muted">×{p.count}</span></span>
                <span className="font-mono">{money(p.total)}</span>
              </div>
            )) : <p className="text-muted text-sm">Sin turnos este mes.</p>}
          </Card>
          <Card className="p-5">
            <h3 className="text-xl font-bebas tracking-wider mb-2">Servicios más pedidos (mes)</h3>
            {stats.topServices.length ? stats.topServices.map((s) => (
              <div key={s.name} className="flex justify-between text-sm py-1 border-b border-dark-border/50 last:border-0">
                <span className="text-gray-300">{s.name}</span><span className="font-mono">×{s.count}</span>
              </div>
            )) : <p className="text-muted text-sm">Sin turnos este mes.</p>}
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bebas tracking-wider">Agenda de hoy</h2>
          <Link to="/admin/agenda" className="text-cyan font-mono text-xs tracking-widest">VER AGENDA COMPLETA →</Link>
        </div>
        {today.length ? today.map((a) => (
          <div key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 border-b border-dark-border/50 last:border-0">
            <span className="font-mono text-cyan w-24">{a.startTime}–{a.endTime}</span>
            <span className="flex-1 min-w-[140px]">{a.name} <span className="text-muted text-sm">· {a.serviceName}</span></span>
            <span className="text-sm text-muted">{a.paymentMethod}</span>
            <StatusBadge status={a.status} />
          </div>
        )) : <p className="text-muted text-sm">No hay turnos para hoy.</p>}
      </Card>
      <p className="text-muted text-xs">Datos al {fmtDate(stats.today)}.</p>
    </div>
  );
}
