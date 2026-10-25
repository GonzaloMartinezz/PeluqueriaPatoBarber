import { useEffect, useMemo, useState } from 'react';
import { Banknote, CalendarDays, Clock, Mail, MessageCircle, Phone, Scissors } from 'lucide-react';
import { Alert, Button, Field, Modal, StatusBadge, inputCls } from '../../../components/ui';
import { useConfirm } from '../../../components/useConfirm';
import api, { errMsg } from '../../../lib/api';
import { fmtLong, money, todayYmd } from '../../../lib/dates';

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-4 py-3">
    <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-xl bg-cyan-dim text-cyan flex items-center justify-center">
      <Icon size={20} />
    </span>
    <div className="min-w-0">
      <p className="text-muted text-sm">{label}</p>
      <div className="text-white font-semibold text-base break-words">{children}</div>
    </div>
  </div>
);

/* ------------------------------ Detalle del turno ----------------------------- */

export function DetailModal({ detail, onClose, onStatus, onSaved }) {
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
  const wa = a.phone ? `https://wa.me/${a.phone.replace(/\D/g, '')}` : null;

  return (
    <Modal open onClose={onClose} title="Detalle del turno" wide>
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-dark-border">
        <div>
          <p className="font-sans font-extrabold text-3xl leading-tight">{a.name}</p>
          {a.isGuest && <p className="text-muted text-sm mt-1">Cliente sin cuenta (cargado a mano)</p>}
        </div>
        <StatusBadge status={a.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-dark-border">
        <div>
          <Row icon={CalendarDays} label="Día">{fmtLong(detail.date)}</Row>
          <Row icon={Clock} label="Horario">{a.startTime} a {a.endTime} hs</Row>
          <Row icon={Scissors} label="Servicio">{a.serviceName}</Row>
        </div>
        <div>
          <Row icon={Banknote} label="Pago">{a.paymentMethod || 'Sin especificar'} · {money(a.price)}</Row>
          {a.phone && (
            <Row icon={Phone} label="Teléfono">
              {a.phone}{' '}
              <a href={wa} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 text-cyan underline underline-offset-4 text-sm">
                <MessageCircle size={14} aria-hidden="true" /> WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </Row>
          )}
          {a.email && <Row icon={Mail} label="Email">{a.email}</Row>}
        </div>
      </div>

      {a.notes && (
        <div className="mt-4 rounded-2xl bg-cyan-dim border border-cyan/30 p-4">
          <p className="text-sm text-muted mb-1">Comentario del cliente</p>
          <p className="text-white">{a.notes}</p>
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-dark-border p-4">
        <Field label="Precio cobrado ($)" hint="Ajustalo si hubo descuento o propina.">
          <span className="flex gap-3">
            <input type="number" min="0" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
            <Button variant="ghost" onClick={savePrice} disabled={Number(price) === a.price}>GUARDAR</Button>
          </span>
        </Field>
      </div>
      <div className="mt-3"><Alert>{error}</Alert></div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
        <Button
          variant="ghost"
          className="!border-busy/60 !text-rose-200 hover:!bg-busy/10"
          onClick={async () =>
            (await confirm({ title: 'Cancelar turno', message: `¿Cancelar el turno de ${a.name}? El horario queda libre.`, confirmLabel: 'CANCELAR TURNO', cancelLabel: 'NO, VOLVER' })) &&
            onStatus(a.id, 'cancelled')
          }
        >
          CANCELAR TURNO
        </Button>
        {a.status !== 'completed' ? (
          <Button variant="success" onClick={() => onStatus(a.id, 'completed')} className="sm:min-w-64">MARCAR COMO COMPLETADO</Button>
        ) : (
          <Button variant="ghost" onClick={() => onStatus(a.id, 'confirmed')}>REABRIR TURNO</Button>
        )}
      </div>
    </Modal>
  );
}

/* -------------------------------- Nuevo turno --------------------------------- */

const EMPTY = { serviceId: '', clientId: '', guestName: '', guestPhone: '', paymentMethod: '', notes: '' };

export function NewAppointmentModal({ initial, onClose, onCreated }) {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [date, setDate] = useState(initial?.date || todayYmd());
  const [time, setTime] = useState(initial?.time || '');
  const [free, setFree] = useState(null); // horarios libres para el día + servicio elegidos
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/admin/services'), api.get('/admin/clients'), api.get('/admin/config')])
      .then(([s, c, cfg]) => {
        const active = s.data.services.filter((x) => x.isActive);
        setServices(active);
        setClients(c.data.clients);
        setMethods(cfg.data.config.paymentMethods.filter((p) => p.enabled).map((p) => p.name));
        setForm((f) => ({ ...f, serviceId: f.serviceId || active[0]?._id || '' }));
      })
      .catch((e) => setError(errMsg(e)));
  }, []);

  // Horarios libres: dependen del día y de cuánto dura el servicio.
  useEffect(() => {
    if (!form.serviceId || !date) return;
    let cancelled = false;
    api
      .get('/admin/slots', { params: { from: date, to: date, serviceId: form.serviceId } })
      .then(({ data }) => {
        if (cancelled) return;
        const day = data.days[0];
        setFree(day.isOpen ? day.slots.filter((s) => s.status === 'free').map((s) => s.time) : []);
      })
      .catch((e) => !cancelled && setError(errMsg(e)));
    return () => {
      cancelled = true;
    };
  }, [date, form.serviceId]);

  const times = useMemo(() => free || [], [free]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const timeOk = times.includes(time);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/admin/appointments', { ...form, date, startTime: time, clientId: form.clientId || undefined });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Nuevo turno" wide>
      <form onSubmit={submit} className="space-y-6">
        <fieldset className="grid sm:grid-cols-3 gap-4">
          <legend className="font-sans font-extrabold text-lg mb-3 text-cyan">1. ¿Cuándo y qué servicio?</legend>
          <Field label="Servicio" className="sm:col-span-3">
            <select className={inputCls} value={form.serviceId} onChange={(e) => { set('serviceId')(e); setTime(''); }} required>
              {services.map((s) => <option key={s._id} value={s._id}>{s.name} — {money(s.price)} ({s.duration} min)</option>)}
            </select>
          </Field>
          <Field label="Día" className="sm:col-span-1">
            <input type="date" className={inputCls} value={date} min={todayYmd()} onChange={(e) => { setDate(e.target.value); setTime(''); }} required />
          </Field>
          <Field label="Horario" className="sm:col-span-2" hint={free && !times.length ? 'No hay horarios libres ese día para este servicio.' : undefined}>
            <select className={inputCls} value={timeOk ? time : ''} onChange={(e) => setTime(e.target.value)} required disabled={!times.length}>
              <option value="">{free === null ? 'Cargando…' : times.length ? 'Elegí un horario' : 'Sin horarios libres'}</option>
              {times.map((t) => <option key={t} value={t}>{t} hs</option>)}
            </select>
          </Field>
        </fieldset>

        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="font-sans font-extrabold text-lg mb-3 text-cyan">2. ¿Para quién?</legend>
          <Field label="Cliente registrado" className="sm:col-span-2">
            <select className={inputCls} value={form.clientId} onChange={set('clientId')}>
              <option value="">Cliente sin cuenta (escribir nombre)</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name} {c.lastName} · {c.email}</option>)}
            </select>
          </Field>
          {!form.clientId && (
            <>
              <Field label="Nombre y apellido"><input className={inputCls} value={form.guestName} onChange={set('guestName')} required autoComplete="off" /></Field>
              <Field label="Teléfono (opcional)"><input type="tel" className={inputCls} value={form.guestPhone} onChange={set('guestPhone')} autoComplete="off" /></Field>
            </>
          )}
        </fieldset>

        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="font-sans font-extrabold text-lg mb-3 text-cyan">3. Pago y notas</legend>
          <Field label="Método de pago">
            <select className={inputCls} value={form.paymentMethod} onChange={set('paymentMethod')}>
              <option value="">Sin especificar</option>
              {methods.map((m) => <option key={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Notas (opcional)"><input className={inputCls} value={form.notes} onChange={set('notes')} maxLength={500} /></Field>
        </fieldset>

        <Alert>{error}</Alert>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>CANCELAR</Button>
          <Button type="submit" disabled={busy || !timeOk} className="sm:min-w-56">{busy ? 'GUARDANDO…' : 'CARGAR TURNO'}</Button>
        </div>
      </form>
    </Modal>
  );
}
