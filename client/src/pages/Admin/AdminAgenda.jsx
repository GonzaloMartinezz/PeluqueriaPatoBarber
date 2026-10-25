import { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import AgendaCalendar from '../../components/agenda/AgendaCalendar';
import { Alert, Button, Card, Field, Modal, PageTitle, StatusBadge, inputCls } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import api, { errMsg } from '../../lib/api';
import { fmtLong, fmtShort, money, todayYmd } from '../../lib/dates';

const RANGE_LABEL = { day: 'del día', week: 'de la semana', month: 'del mes' };

export default function AdminAgenda() {
  const [range, setRange] = useState({ view: 'day', from: todayYmd(), to: todayYmd() });
  const [appts, setAppts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [detail, setDetail] = useState(null); // { appt, date }
  const [newSlot, setNewSlot] = useState(null); // { date, time }
  const [error, setError] = useState('');

  const refresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    api.get('/admin/appointments', { params: { from: range.from, to: range.to } })
      .then(({ data }) => setAppts(data.appointments))
      .catch((e) => setError(errMsg(e)));
  }, [range, refreshKey]);

  const active = appts.filter((a) => a.status !== 'cancelled');
  const byDate = active.reduce((acc, a) => ((acc[a.date] ||= []).push(a), acc), {});
  const total = active.reduce((sum, a) => sum + a.price, 0);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/appointments/${id}`, { status });
      setDetail(null);
      refresh();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle eyebrow="AGENDA" title="Turnos y clientes">
        Tocá un horario ocupado para ver al cliente, o uno libre para cargar un turno a mano.
      </PageTitle>
      <Alert>{error}</Alert>

      <AgendaCalendar
        admin
        refreshKey={refreshKey}
        onRangeChange={setRange}
        onPickSlot={(date, time) => setNewSlot({ date, time })}
        onPickAppt={(appt, date) => setDetail({ appt, date })}
      />

      <Card className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bebas tracking-wider">Clientes {RANGE_LABEL[range.view]}</h2>
          <p className="text-muted text-sm">
            <b className="text-white">{active.length}</b> turnos · estimado <b className="text-free">{money(total)}</b>
          </p>
        </div>
        {active.length === 0 && <p className="text-muted text-sm">No hay turnos en este período.</p>}
        {Object.entries(byDate).map(([date, list]) => (
          <div key={date} className="mb-4 last:mb-0">
            <p className="text-cyan font-mono text-[11px] tracking-widest uppercase mb-1">{fmtShort(date)}</p>
            {list.map((a) => (
              <button
                key={a.id}
                onClick={() => setDetail({ appt: a, date })}
                className="w-full text-left flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5 px-2 border-b border-dark-border/50 hover:bg-white/[0.03]"
              >
                <span className="font-mono text-sm w-24 text-white">{a.startTime}–{a.endTime}</span>
                <span className="flex-1 min-w-[150px]">
                  {a.name}
                  {a.isGuest && <span className="ml-2 text-[11px] font-mono text-muted border border-dark-border px-1.5 rounded-sm">SIN CUENTA</span>}
                </span>
                <span className="text-sm text-muted min-w-[110px]">{a.serviceName}</span>
                <span className="text-sm text-muted w-28">{a.phone}</span>
                <span className="font-mono text-sm w-20 text-right">{money(a.price)}</span>
                <StatusBadge status={a.status} />
              </button>
            ))}
          </div>
        ))}
      </Card>

      <DetailModal key={detail?.appt?.id} detail={detail} onClose={() => setDetail(null)} onStatus={setStatus} onSaved={() => { setDetail(null); refresh(); }} />
      <NewAppointmentModal key={newSlot ? `${newSlot.date}${newSlot.time}` : 'none'} slot={newSlot} onClose={() => setNewSlot(null)} onCreated={() => { setNewSlot(null); refresh(); }} />
    </div>
  );
}

function DetailModal({ detail, onClose, onStatus, onSaved }) {
  const confirm = useConfirm();
  const a = detail?.appt;
  const [price, setPrice] = useState(a ? String(a.price) : '');
  const [error, setError] = useState('');

  if (!a) return null;

  const savePrice = async () => {
    try {
      await api.patch(`/admin/appointments/${a.id}`, { price: Number(price) });
      onSaved();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <Modal open onClose={onClose} title="Detalle del turno">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-3xl font-bebas tracking-wider">{a.name}</p>
            <p className="text-muted">{fmtLong(detail.date)} · <span className="text-cyan font-mono">{a.startTime}–{a.endTime}</span></p>
          </div>
          <StatusBadge status={a.status} />
        </div>
        <div className="space-y-1 text-gray-300">
          {a.phone && <p className="flex items-center gap-2"><Phone size={14} className="text-muted" /> <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-cyan">{a.phone}</a></p>}
          {a.email && <p className="flex items-center gap-2"><Mail size={14} className="text-muted" /> {a.email}</p>}
          <p>Servicio: <b>{a.serviceName}</b></p>
          <p>Pago: <b>{a.paymentMethod || 'Sin especificar'}</b></p>
          {a.notes && <p className="border-l-2 border-cyan/40 pl-3 text-muted">{a.notes}</p>}
        </div>

        <Field label="Precio cobrado ($)" hint="Ajustalo si hubo descuento o propina.">
          <div className="flex gap-2">
            <input type="number" min="0" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
            <Button variant="ghost" onClick={savePrice} disabled={Number(price) === a.price}>GUARDAR</Button>
          </div>
        </Field>
        <Alert>{error}</Alert>

        <div className="flex flex-wrap gap-2 pt-2">
          {a.status !== 'completed' && <Button variant="success" onClick={() => onStatus(a.id, 'completed')}>MARCAR COMPLETADO</Button>}
          {a.status === 'completed' && <Button variant="ghost" onClick={() => onStatus(a.id, 'confirmed')}>REABRIR</Button>}
          <Button
            variant="danger"
            onClick={async () =>
              (await confirm({ title: 'Cancelar turno', message: `¿Cancelar el turno de ${a.name}? El horario queda libre.`, confirmLabel: 'CANCELAR TURNO', cancelLabel: 'NO, VOLVER' })) &&
              onStatus(a.id, 'cancelled')
            }
          >
            CANCELAR TURNO
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function NewAppointmentModal({ slot, onClose, onCreated }) {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState({ serviceId: '', clientId: '', guestName: '', guestPhone: '', paymentMethod: '', notes: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slot) return;
    Promise.all([api.get('/admin/services'), api.get('/admin/clients'), api.get('/admin/config')]).then(([s, c, cfg]) => {
      const active = s.data.services.filter((x) => x.isActive);
      setServices(active);
      setClients(c.data.clients);
      setMethods(cfg.data.config.paymentMethods.filter((p) => p.enabled).map((p) => p.name));
      setForm((f) => ({ ...f, serviceId: f.serviceId || active[0]?._id || '' }));
    }).catch((e) => setError(errMsg(e)));
  }, [slot]);

  if (!slot) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/admin/appointments', { ...form, date: slot.date, startTime: slot.time, clientId: form.clientId || undefined });
      setForm({ serviceId: form.serviceId, clientId: '', guestName: '', guestPhone: '', paymentMethod: '', notes: '' });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Nuevo turno">
      <form onSubmit={submit} className="space-y-4">
        <p className="text-muted text-sm">{fmtLong(slot.date)} · <span className="text-cyan font-mono">{slot.time}</span></p>
        <Field label="Servicio">
          <select className={inputCls} value={form.serviceId} onChange={set('serviceId')} required>
            {services.map((s) => <option key={s._id} value={s._id}>{s.name} — {money(s.price)} ({s.duration} min)</option>)}
          </select>
        </Field>
        <Field label="Cliente registrado">
          <select className={inputCls} value={form.clientId} onChange={set('clientId')}>
            <option value="">— Cliente sin cuenta —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} {c.lastName} · {c.email}</option>)}
          </select>
        </Field>
        {!form.clientId && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre"><input className={inputCls} value={form.guestName} onChange={set('guestName')} required /></Field>
            <Field label="Teléfono"><input className={inputCls} value={form.guestPhone} onChange={set('guestPhone')} /></Field>
          </div>
        )}
        <Field label="Método de pago">
          <select className={inputCls} value={form.paymentMethod} onChange={set('paymentMethod')}>
            <option value="">Sin especificar</option>
            {methods.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Notas"><input className={inputCls} value={form.notes} onChange={set('notes')} maxLength={500} /></Field>
        <Alert>{error}</Alert>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'GUARDANDO…' : 'CARGAR TURNO'}</Button>
      </form>
    </Modal>
  );
}
