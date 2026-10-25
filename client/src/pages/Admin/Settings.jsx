import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Card, Field, Loading, PageTitle, inputCls } from '../../components/ui';
import { fmtShort, todayYmd } from '../../lib/dates';

const DAYS = [
  ['monday', 'Lunes'], ['tuesday', 'Martes'], ['wednesday', 'Miércoles'], ['thursday', 'Jueves'],
  ['friday', 'Viernes'], ['saturday', 'Sábado'], ['sunday', 'Domingo'],
];

const Section = ({ title, hint, children }) => (
  <Card className="p-5">
    <h2 className="text-3xl font-bebas tracking-wider">{title}</h2>
    {hint && <p className="text-muted text-sm mb-4">{hint}</p>}
    {children}
  </Card>
);

export default function Settings() {
  const [cfg, setCfg] = useState(null);
  const [exceptions, setExceptions] = useState([]);
  const [msg, setMsg] = useState({ type: 'success', text: '' });
  const [saving, setSaving] = useState(false);
  const [newMethod, setNewMethod] = useState('');
  const [ex, setEx] = useState({ date: todayYmd(), type: 'blocked', reason: '', open: '10:00', close: '14:00' });

  const loadExceptions = () => api.get('/admin/exceptions').then(({ data }) => setExceptions(data.exceptions));

  useEffect(() => {
    Promise.all([api.get('/admin/config'), loadExceptions()])
      .then(([c]) => setCfg(c.data.config))
      .catch((e) => setMsg({ type: 'error', text: errMsg(e) }));
  }, []);

  if (!cfg) return msg.text ? <Alert type={msg.type}>{msg.text}</Alert> : <Loading />;

  const setField = (k) => (e) => setCfg({ ...cfg, [k]: e.target.value });
  const setDay = (day, patch) => setCfg({ ...cfg, workingHours: { ...cfg.workingHours, [day]: { ...cfg.workingHours[day], ...patch } } });
  const setMethod = (i, patch) => setCfg({ ...cfg, paymentMethods: cfg.paymentMethods.map((m, j) => (j === i ? { ...m, ...patch } : m)) });

  const save = async () => {
    setSaving(true);
    setMsg({ type: 'success', text: '' });
    try {
      const { data } = await api.put('/admin/config', cfg);
      setCfg(data.config);
      setMsg({ type: 'success', text: 'Cambios guardados.' });
    } catch (e) {
      setMsg({ type: 'error', text: errMsg(e) });
    } finally {
      setSaving(false);
    }
  };

  const addMethod = () => {
    const name = newMethod.trim();
    if (!name || cfg.paymentMethods.some((m) => m.name.toLowerCase() === name.toLowerCase())) return;
    setCfg({ ...cfg, paymentMethods: [...cfg.paymentMethods, { name, enabled: true }] });
    setNewMethod('');
  };

  const addException = async () => {
    try {
      const { data } = await api.post('/admin/exceptions', {
        date: ex.date, type: ex.type, reason: ex.reason,
        customHours: ex.type === 'custom' ? { open: ex.open, close: ex.close } : undefined,
      });
      await loadExceptions();
      setEx({ ...ex, reason: '' });
      setMsg(data.affectedAppointments
        ? { type: 'error', text: `Atención: ese día ya tiene ${data.affectedAppointments} turno(s) agendado(s). Revisalos en la agenda.` }
        : { type: 'success', text: 'Día guardado.' });
    } catch (e) {
      setMsg({ type: 'error', text: errMsg(e) });
    }
  };

  const removeException = async (id) => {
    await api.delete(`/admin/exceptions/${id}`);
    loadExceptions();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageTitle eyebrow="CONFIGURACIÓN" title="Tu peluquería">
        Todo lo que cambies acá se refleja en la agenda, la reserva y la página principal.
      </PageTitle>

      <Section title="Datos del negocio">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre del local"><input className={inputCls} value={cfg.name} onChange={setField('name')} /></Field>
          <Field label="Nombre del peluquero"><input className={inputCls} value={cfg.barberName} onChange={setField('barberName')} /></Field>
          <Field label="Dirección" className="sm:col-span-2"><input className={inputCls} value={cfg.address} onChange={setField('address')} /></Field>
          <Field label="Teléfono / WhatsApp"><input className={inputCls} value={cfg.phone} onChange={setField('phone')} /></Field>
          <Field label="Instagram"><input className={inputCls} value={cfg.instagram} onChange={setField('instagram')} placeholder="@patobarber" /></Field>
        </div>
      </Section>

      <Section title="Horarios de atención" hint="Los días tildados abren; el cliente solo ve los horarios dentro de estas franjas.">
        <div className="space-y-2">
          {DAYS.map(([key, label]) => {
            const h = cfg.workingHours[key];
            return (
              <div key={key} className="flex flex-wrap items-center gap-3 py-1.5 border-b border-dark-border/50 last:border-0">
                <label className="flex items-center gap-2 w-36">
                  <input type="checkbox" checked={h.isOpen} onChange={(e) => setDay(key, { isOpen: e.target.checked })} />
                  <span className={h.isOpen ? 'text-white' : 'text-muted'}>{label}</span>
                </label>
                {h.isOpen ? (
                  <>
                    <input type="time" aria-label={`${label}: apertura`} className={`${inputCls} w-32`} value={h.open} onChange={(e) => setDay(key, { open: e.target.value })} />
                    <span className="text-muted">a</span>
                    <input type="time" aria-label={`${label}: cierre`} className={`${inputCls} w-32`} value={h.close} onChange={(e) => setDay(key, { close: e.target.value })} />
                  </>
                ) : <span className="text-muted text-sm">Cerrado</span>}
              </div>
            );
          })}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-5">
          <Field label="Duración de cada franja" hint="Solo se puede cambiar si no hay turnos futuros.">
            <select className={inputCls} value={cfg.slotDuration} onChange={(e) => setCfg({ ...cfg, slotDuration: Number(e.target.value) })}>
              {[15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} minutos</option>)}
            </select>
          </Field>
          <Field label="Reservas hasta con (días de anticipación)">
            <input type="number" min="1" max="365" className={inputCls} value={cfg.maxDaysAhead} onChange={(e) => setCfg({ ...cfg, maxDaysAhead: Number(e.target.value) })} />
          </Field>
        </div>
      </Section>

      <Section title="Métodos de pago" hint="Los habilitados son los que el cliente puede elegir al reservar.">
        <div className="space-y-2">
          {cfg.paymentMethods.map((m, i) => (
            <div key={m.name} className="flex items-center gap-3 py-1.5 border-b border-dark-border/50">
              <label className="flex items-center gap-2 flex-1">
                <input type="checkbox" checked={m.enabled} onChange={(e) => setMethod(i, { enabled: e.target.checked })} />
                <span className={m.enabled ? 'text-white' : 'text-muted'}>{m.name}</span>
              </label>
              <button onClick={() => setCfg({ ...cfg, paymentMethods: cfg.paymentMethods.filter((_, j) => j !== i) })}
                className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-busy" aria-label={`Quitar ${m.name}`}><Trash2 size={17} aria-hidden="true" /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input className={inputCls} aria-label="Nuevo método de pago" placeholder="Agregar método (ej: Cuenta DNI)" value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMethod())} />
          <Button variant="ghost" onClick={addMethod} aria-label="Agregar método de pago"><Plus size={16} aria-hidden="true" /></Button>
        </div>
      </Section>

      <div className="sticky bottom-3 z-10 flex items-center gap-4 bg-dark-surface border border-dark-border rounded-sm p-3">
        <Button onClick={save} disabled={saving}>{saving ? 'GUARDANDO…' : 'GUARDAR CAMBIOS'}</Button>
        <div className="flex-1"><Alert type={msg.type}>{msg.text}</Alert></div>
      </div>

      <Section title="Días cerrados y horarios especiales" hint="Feriados, vacaciones o un día con horario distinto. Se guardan al instante.">
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <Field label="Fecha"><input type="date" min={todayYmd()} className={inputCls} value={ex.date} onChange={(e) => setEx({ ...ex, date: e.target.value })} /></Field>
          <Field label="Tipo">
            <select className={inputCls} value={ex.type} onChange={(e) => setEx({ ...ex, type: e.target.value })}>
              <option value="blocked">Cerrado todo el día</option>
              <option value="custom">Horario especial</option>
            </select>
          </Field>
          <Field label="Motivo"><input className={inputCls} value={ex.reason} onChange={(e) => setEx({ ...ex, reason: e.target.value })} placeholder="Feriado…" /></Field>
          <Button onClick={addException}>AGREGAR</Button>
          {ex.type === 'custom' && (
            <div className="sm:col-span-4 flex items-center gap-3">
              <input type="time" aria-label="Horario especial: apertura" className={`${inputCls} w-32`} value={ex.open} onChange={(e) => setEx({ ...ex, open: e.target.value })} />
              <span className="text-muted">a</span>
              <input type="time" aria-label="Horario especial: cierre" className={`${inputCls} w-32`} value={ex.close} onChange={(e) => setEx({ ...ex, close: e.target.value })} />
            </div>
          )}
        </div>
        <div className="mt-4">
          {exceptions.length === 0 && <p className="text-muted text-sm">No hay días especiales cargados.</p>}
          {exceptions.map((x) => (
            <div key={x._id} className="flex items-center gap-3 py-2 border-b border-dark-border/50">
              <span className="font-mono text-sm w-32">{fmtShort(x.date)}</span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${x.type === 'blocked' ? 'border-busy/40 text-red-300' : 'border-cyan/40 text-cyan'}`}>
                {x.type === 'blocked' ? 'CERRADO' : `${x.customHours.open}–${x.customHours.close}`}
              </span>
              <span className="flex-1 text-muted text-sm">{x.reason}</span>
              <button onClick={() => removeException(x._id)} className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-busy" aria-label="Quitar día especial"><Trash2 size={17} aria-hidden="true" /></button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
