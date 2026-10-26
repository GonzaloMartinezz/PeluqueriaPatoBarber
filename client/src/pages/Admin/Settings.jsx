import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Field, Loading, PageTitle, inputCls } from '../../components/ui';
import { fmtShort, todayYmd } from '../../lib/dates';

const DAYS = [
  ['monday', 'Lunes'], ['tuesday', 'Martes'], ['wednesday', 'Miércoles'], ['thursday', 'Jueves'],
  ['friday', 'Viernes'], ['saturday', 'Sábado'], ['sunday', 'Domingo'],
];

const Section = ({ title, hint, children }) => (
  <section aria-label={title} className="bg-dark-surface border border-dark-border rounded-3xl p-6 sm:p-8">
    <h2 className="font-sans font-extrabold text-2xl sm:text-3xl">{title}</h2>
    {hint && <p className="text-gray-300 text-base mt-2 mb-6 max-w-3xl">{hint}</p>}
    {!hint && <div className="mb-6" />}
    {children}
  </section>
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
  const setShift = (day, shift, patch) =>
    setDay(day, { [shift]: { ...cfg.workingHours[day][shift], ...patch } });
  // Copia el horario de un día (mañana y tarde) a todos los demás días abiertos.
  const copyToOpenDays = (from) => {
    const src = cfg.workingHours[from];
    const next = {};
    for (const [key] of DAYS) {
      const h = cfg.workingHours[key];
      next[key] = h.isOpen && key !== from ? { ...h, morning: { ...src.morning }, afternoon: { ...src.afternoon } } : h;
    }
    setCfg({ ...cfg, workingHours: next });
  };
  const legal = cfg.legal || {};
  const setLegal = (k) => (e) => setCfg({ ...cfg, legal: { ...legal, [k]: e.target.value } });
  const setMethod = (i, patch) => setCfg({ ...cfg, paymentMethods: cfg.paymentMethods.map((m, j) => (j === i ? { ...m, ...patch } : m)) });

  const save = async () => {
    setSaving(true);
    setMsg({ type: 'success', text: '' });
    try {
      const { data } = await api.put('/admin/config', cfg);
      setCfg(data.config);
      setMsg({ type: 'success', text: 'Cambios guardados.' });
    } catch (e) {
      setMsg({ type: 'error', text: `No se guardó nada: ${errMsg(e)}` });
      document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="space-y-8 max-w-5xl">
      <PageTitle eyebrow="CONFIGURACIÓN" title="Tu peluquería">
        Todo lo que cambies acá se refleja en la agenda, la reserva y la página principal.
      </PageTitle>

      {msg.type === 'error' && msg.text && <Alert>{msg.text}</Alert>}

      <Section title="Datos del negocio">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre del local"><input className={inputCls} value={cfg.name} onChange={setField('name')} /></Field>
          <Field label="Nombre del peluquero"><input className={inputCls} value={cfg.barberName} onChange={setField('barberName')} /></Field>
          <Field label="Dirección" className="sm:col-span-2"><input className={inputCls} value={cfg.address} onChange={setField('address')} /></Field>
          <Field label="Teléfono / WhatsApp"><input className={inputCls} value={cfg.phone} onChange={setField('phone')} /></Field>
          <Field label="Instagram"><input className={inputCls} value={cfg.instagram} onChange={setField('instagram')} placeholder="@patobarber.pc" /></Field>
          <Field label="Reels de Instagram para la portada" hint="Un enlace por línea (hasta 6). Abrí el reel en Instagram, tocá Compartir → Copiar enlace y pegalo acá." className="sm:col-span-2">
            <textarea
              rows={4}
              className={inputCls}
              placeholder="https://www.instagram.com/reel/XXXXXXXXXXX/"
              value={(cfg.reels || []).join('\n')}
              onChange={(e) => setCfg({ ...cfg, reels: e.target.value.split('\n') })}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Horarios de atención"
        hint="Tildá los días que abrís. Si trabajás con horario cortado, activá Mañana y Tarde; si atendés en un solo turno, dejá el otro sin tildar. El cliente solo ve horarios dentro de estos turnos."
      >
        <div>
          {DAYS.map(([key, label]) => {
            const h = cfg.workingHours[key];
            return (
              <div key={key} className="py-4 border-b border-dark-border last:border-0 grid lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-3 items-center">
                <label className="flex items-center gap-3 min-h-12 font-sans font-extrabold text-xl">
                  <input type="checkbox" checked={h.isOpen} onChange={(e) => setDay(key, { isOpen: e.target.checked })} />
                  <span className={h.isOpen ? 'text-white' : 'text-muted'}>{label}</span>
                </label>
                {!h.isOpen && <span className="text-muted text-lg lg:col-span-2">Cerrado</span>}
                {h.isOpen && (
                  <>
                    <ShiftEditor day={label} name="Mañana" shift={h.morning} onChange={(patch) => setShift(key, 'morning', patch)} />
                    <ShiftEditor day={label} name="Tarde" shift={h.afternoon} onChange={(patch) => setShift(key, 'afternoon', patch)} />
                    {!h.morning.enabled && !h.afternoon.enabled && (
                      <span className="text-rose-200 font-semibold lg:col-start-2 lg:col-span-2" role="alert">Activá la mañana, la tarde o las dos.</span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {(() => {
          const first = DAYS.find(([k]) => cfg.workingHours[k].isOpen);
          return first ? (
            <Button variant="ghost" className="mt-3 rounded-full" onClick={() => copyToOpenDays(first[0])}>
              Copiar el horario del {first[1].toLowerCase()} a todos los días abiertos
            </Button>
          ) : null;
        })()}
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

      <Section
        title="Datos legales"
        hint="Aparecen en la Política de Privacidad y en los Términos y condiciones que ven tus clientes. La ley argentina pide que se informe quién es el responsable. Completalos con los datos reales del titular."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre completo o razón social del titular"><input className={inputCls} maxLength={120} value={legal.ownerName || ''} onChange={setLegal('ownerName')} autoComplete="off" /></Field>
          <Field label="CUIT / CUIL" hint="11 números, con o sin guiones."><input className={inputCls} inputMode="numeric" value={legal.cuit || ''} onChange={setLegal('cuit')} placeholder="20-12345678-9" autoComplete="off" /></Field>
          <Field label="Domicilio legal" className="sm:col-span-2"><input className={inputCls} maxLength={200} value={legal.address || ''} onChange={setLegal('address')} autoComplete="off" /></Field>
          <Field label="Email de contacto" hint="Para consultas y pedidos sobre datos personales."><input type="email" className={inputCls} value={legal.email || ''} onChange={setLegal('email')} autoComplete="off" /></Field>
          <Field label="Horas mínimas para cancelar un turno" hint="0 = el cliente puede cancelar hasta último momento.">
            <input type="number" min="0" max="72" className={inputCls} value={legal.cancellationHours ?? 0} onChange={(e) => setCfg({ ...cfg, legal: { ...legal, cancellationHours: Number(e.target.value) } })} />
          </Field>
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center gap-4 bg-dark-surface/95 backdrop-blur border-2 border-cyan/40 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
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
              <input type="time" aria-label="Horario especial: apertura" className={`${inputCls} w-36`} value={ex.open} onChange={(e) => setEx({ ...ex, open: e.target.value })} />
              <span className="text-muted">a</span>
              <input type="time" aria-label="Horario especial: cierre" className={`${inputCls} w-36`} value={ex.close} onChange={(e) => setEx({ ...ex, close: e.target.value })} />
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

// Un turno (mañana o tarde) de un día: casilla para activarlo + hora de apertura y de cierre.
function ShiftEditor({ day, name, shift, onChange }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 ${shift.enabled ? 'border-cyan/50 bg-cyan-dim' : 'border-dark-border'}`}>
      <label className="flex items-center gap-3 min-h-11 font-bold text-lg w-28">
        <input type="checkbox" checked={shift.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
        <span className={shift.enabled ? 'text-white' : 'text-muted'}>{name}</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="time"
          aria-label={`${day}, ${name.toLowerCase()}: apertura`}
          className={`${inputCls} w-36`}
          value={shift.open}
          disabled={!shift.enabled}
          onChange={(e) => onChange({ open: e.target.value })}
        />
        <span className="text-muted">a</span>
        <input
          type="time"
          aria-label={`${day}, ${name.toLowerCase()}: cierre`}
          className={`${inputCls} w-36`}
          value={shift.close}
          disabled={!shift.enabled}
          onChange={(e) => onChange({ close: e.target.value })}
        />
      </div>
    </div>
  );
}
