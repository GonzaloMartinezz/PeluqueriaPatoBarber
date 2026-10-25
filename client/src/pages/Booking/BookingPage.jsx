import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, Clock, Scissors, User } from 'lucide-react';
import Navbar from '../../components/Navbar';
import AgendaCalendar from '../../components/agenda/AgendaCalendar';
import { Alert, Button, Card, Field, Loading, PageTitle, inputCls } from '../../components/ui';
import api, { errMsg } from '../../lib/api';
import { fmtLong, money } from '../../lib/dates';
import useAuth from '../../store/auth';

const Step = ({ n, title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl sm:text-3xl font-bebas tracking-wider mb-3 flex items-center gap-3">
      <span aria-hidden="true" className="w-8 h-8 rounded-sm bg-cyan-dim border border-cyan/30 text-cyan text-lg flex items-center justify-center shrink-0">{n}</span>
      {title}
    </h2>
    {children}
  </section>
);

export default function BookingPage() {
  const [params] = useSearchParams();
  const { user, updateProfile } = useAuth();

  const [config, setConfig] = useState(null);
  const [services, setServices] = useState(null);
  const [serviceId, setServiceId] = useState(params.get('servicio') || '');
  const [slot, setSlot] = useState(null); // { date, time }
  const [payment, setPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    Promise.all([api.get('/config'), api.get('/services')])
      .then(([c, s]) => {
        setConfig(c.data.config);
        setServices(s.data.services);
      })
      .catch((e) => setError(errMsg(e)));
  }, []);

  const service = services?.find((s) => s._id === serviceId);

  const pickService = (id) => {
    setServiceId(id);
    setSlot(null); // la disponibilidad depende de la duración del servicio
  };

  const confirm = async () => {
    setError('');
    setBusy(true);
    try {
      if (!user.phone) await updateProfile({ phone });
      const { data } = await api.post('/appointments', {
        serviceId,
        date: slot.date,
        startTime: slot.time,
        paymentMethod: payment,
        notes,
      });
      setBooked(data.appointment);
    } catch (e) {
      setError(errMsg(e));
      setSlot(null);
      setRefreshKey((k) => k + 1); // el horario pudo ocuparse: se actualiza la grilla
    } finally {
      setBusy(false);
    }
  };

  if (booked) {
    return (
      <Shell>
        <Card className="p-8 text-center max-w-lg mx-auto">
          <CalendarCheck className="mx-auto text-free mb-3" size={44} />
          <h1 className="text-5xl font-bebas tracking-wider mb-2">¡Turno confirmado!</h1>
          <p className="text-gray-300">{fmtLong(booked.date)}</p>
          <p className="text-cyan font-mono text-2xl my-1">{booked.startTime} – {booked.endTime}</p>
          <p className="text-muted text-sm mb-6">
            {booked.serviceName} · {money(booked.price)} · {booked.paymentMethod}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/mis-turnos"><Button>MIS TURNOS</Button></Link>
            <Button variant="ghost" onClick={() => { setBooked(null); setSlot(null); setRefreshKey((k) => k + 1); }}>
              OTRO TURNO
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  if (!config || !services) return <Shell>{error ? <Alert>{error}</Alert> : <Loading />}</Shell>;

  const needsPhone = !user.phone;
  const ready = service && slot && payment && (!needsPhone || phone.trim().length >= 6);

  return (
    <Shell>
      <PageTitle eyebrow="RESERVAR TURNO" title="Elegí tu turno">
        Cuatro pasos y listo. Tu turno queda confirmado al instante.
      </PageTitle>

      <Step n="1" title="Peluquero">
        <Card className="p-4 flex items-center gap-4 border-cyan/40 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-cyan-dim border border-dark-border flex items-center justify-center text-cyan"><User /></div>
          <div>
            <p className="font-bebas text-2xl tracking-wider leading-none">{config.barberName}</p>
            <p className="text-muted text-xs">{config.name}</p>
          </div>
          <span className="ml-auto text-cyan font-mono text-[11px] tracking-widest">SELECCIONADO</span>
        </Card>
      </Step>

      <Step n="2" title="Servicio">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <button
              key={s._id}
              onClick={() => pickService(s._id)}
              aria-pressed={serviceId === s._id}
              className={`text-left p-4 rounded-md border transition-colors min-h-[5.5rem] ${
                serviceId === s._id ? 'border-cyan bg-cyan-dim ring-1 ring-cyan' : 'border-dark-border bg-dark-surface hover:border-cyan/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bebas text-xl tracking-wider flex items-center gap-2"><Scissors size={14} aria-hidden="true" className="text-cyan" />{s.name}</span>
                <span className="text-cyan font-mono text-sm font-bold">{money(s.price)}</span>
              </div>
              {s.description && <p className="text-muted text-xs mt-1">{s.description}</p>}
              <p className="text-muted font-mono text-xs tracking-widest mt-2 flex items-center gap-1"><Clock size={12} aria-hidden="true" />{s.duration} MIN</p>
            </button>
          ))}
        </div>
      </Step>

      <Step n="3" title="Día y horario">
        {!service ? (
          <p className="text-muted text-sm">Primero elegí un servicio para ver los horarios que entran.</p>
        ) : (
          <>
            <p className="text-muted text-sm mb-3">
              Tocá un horario <span className="text-green-400">verde</span> para elegirlo. Los <span className="text-red-400">rojos</span> ya están tomados.
            </p>
            <AgendaCalendar serviceId={serviceId} selected={slot} onPickSlot={(date, time) => setSlot({ date, time })} refreshKey={refreshKey} />
          </>
        )}
      </Step>

      <Step n="4" title="Pago y datos">
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <Field label="Método de pago">
            <div className="flex flex-wrap gap-2">
              {config.paymentMethods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayment(m)}
                  aria-pressed={payment === m}
                  className={`px-4 min-h-11 rounded-sm border text-sm transition-colors ${
                    payment === m ? 'border-cyan bg-cyan-dim text-white ring-1 ring-cyan' : 'border-white/20 text-gray-200 hover:border-cyan/60'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
          {needsPhone && (
            <Field label="Tu teléfono / WhatsApp" hint="Para avisarte por cualquier cambio.">
              <input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
          )}
          <Field label="Comentarios (opcional)" className="md:col-span-2">
            <textarea className={inputCls} rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: fade bajo, tijera arriba…" />
          </Field>
        </div>
      </Step>

      <Card className="p-4 sm:p-5 max-w-3xl sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_8px_40px_rgba(0,0,0,0.8)] bg-dark-surface2">
        {ready ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm">
              <p className="text-white font-bebas text-xl tracking-wider">{service.name} · {money(service.price)}</p>
              <p className="text-muted">{fmtLong(slot.date)} · <span className="text-cyan font-mono">{slot.time}</span> · {payment}</p>
            </div>
            <Button onClick={confirm} disabled={busy} className="w-full sm:w-auto">{busy ? 'RESERVANDO…' : 'CONFIRMAR TURNO'}</Button>
          </div>
        ) : (
          <p className="text-muted text-sm">Completá servicio, horario y método de pago para confirmar.</p>
        )}
        {error && <div className="mt-3"><Alert>{error}</Alert></div>}
      </Card>
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main id="main" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</main>
    </div>
  );
}
