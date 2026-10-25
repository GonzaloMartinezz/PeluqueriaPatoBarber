import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CalendarCheck, Check, MapPin, Palette, Scissors, Sparkles } from 'lucide-react';
import ClientShell from '../../components/ClientShell';
import ThemeToggle from '../../components/ThemeToggle';
import AgendaCalendar from '../../components/agenda/AgendaCalendar';
import { Alert, Button, Field, Loading, inputCls } from '../../components/ui';
import api, { errMsg } from '../../lib/api';
import { fmt, fmtLong, money } from '../../lib/dates';
import { greeting, todayLine } from '../../lib/useBusiness';
import useAuth from '../../store/auth';

// Ícono según el tipo de servicio (el barbero puede crear los que quiera).
const iconFor = (name = '') => (/barba|afeit/i.test(name) ? Sparkles : /color|plat|tint|mecha/i.test(name) ? Palette : Scissors);

const card = 'bg-dark-surface border border-dark-border rounded-3xl p-4 sm:p-6';
const sectionTitle = 'font-sans font-extrabold text-xl sm:text-2xl text-cyan leading-tight';

export default function BookingPage() {
  const [params] = useSearchParams();
  const { hash } = useLocation();
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

  // "Servicios" de la barra inferior apunta a #servicios.
  useEffect(() => {
    if (hash === '#servicios' && services) document.getElementById('servicios')?.scrollIntoView();
  }, [hash, services]);

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
      <ClientShell>
        <div className="px-4 py-10 max-w-lg mx-auto">
          <div className={`${card} text-center py-10`}>
            <span className="mx-auto mb-4 w-20 h-20 rounded-full bg-free/15 border border-free/40 text-free flex items-center justify-center">
              <CalendarCheck size={40} aria-hidden="true" />
            </span>
            <h1 className="font-sans font-extrabold text-3xl mb-2">¡Turno confirmado!</h1>
            <p className="text-gray-200 text-lg">{fmtLong(booked.date)}</p>
            <p className="text-cyan font-extrabold text-3xl my-1">{booked.startTime} – {booked.endTime} hs</p>
            <p className="text-muted text-sm mb-7">
              {booked.serviceName} · {money(booked.price)} ARS · {booked.paymentMethod}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/mis-turnos"><Button className="w-full rounded-full">VER MIS TURNOS</Button></Link>
              <Button variant="ghost" className="rounded-full" onClick={() => { setBooked(null); setSlot(null); setRefreshKey((k) => k + 1); }}>
                OTRO TURNO
              </Button>
            </div>
          </div>
        </div>
      </ClientShell>
    );
  }

  if (!config || !services) {
    return (
      <ClientShell>
        <div className="px-4 py-10">{error ? <Alert>{error}</Alert> : <Loading />}</div>
      </ClientShell>
    );
  }

  const status = todayLine(config);
  const needsPhone = !user.phone;
  const ready = service && slot && payment && (!needsPhone || phone.trim().length >= 6);

  return (
    <ClientShell>
      {/* Encabezado celeste */}
      <header className="sky-header rounded-b-[2rem] md:rounded-b-[2.5rem] px-5 pt-5 pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="md:hidden font-bebas text-2xl tracking-widest py-2">PATO BARBER</Link>
            <a
              href="/#ubicacion"
              className="hidden sm:flex items-center gap-1.5 rounded-full glass px-4 min-h-10 text-sm font-bold"
            >
              <MapPin size={16} aria-hidden="true" /> {config.address.split(',')[0]}
            </a>
            <ThemeToggle onSky className="ml-auto" />
          </div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase">Barber shop club</p>
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl leading-[1.05] mt-1" style={{ color: 'var(--on-sky)' }}>
                ¡{greeting()},<br />{user.name}!
              </h1>
              <p className="mt-2 text-base font-medium">¿Listo para renovar tu estilo hoy?</p>
            </div>
            <div className="shrink-0 text-center">
              <span
                role="img"
                aria-label={`Peluquero: ${config.barberName}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full glass-strong ring-4 ring-glass flex items-center justify-center"
              >
                <Scissors size={36} aria-hidden="true" />
              </span>
              <span className="mt-1.5 inline-block rounded-full bg-[color:var(--on-sky)] text-[#fff] text-xs font-bold px-3 py-1">
                {config.barberName}
              </span>
            </div>
          </div>

          {status && (
            <div className="mt-5 pt-4 border-t border-[color:var(--on-sky)]/25 flex items-center justify-between gap-3">
              <p className="font-bold flex items-center gap-2">
                <span aria-hidden="true" className={`w-3 h-3 rounded-full ring-2 ring-glass ${status.open ? 'bg-green-600' : 'bg-red-600'}`} />
                {status.text}
              </p>
              <a href="/#ubicacion" className="font-bold underline underline-offset-4 whitespace-nowrap">Ver detalles</a>
            </div>
          )}
        </div>
      </header>

      <div className="px-4 pt-6 pb-44 md:pb-10 max-w-3xl mx-auto space-y-5">
        {/* Servicios */}
        <section id="servicios" aria-labelledby="svc-title" className={card}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="svc-title" className={sectionTitle}>Nuestros Servicios</h2>
              <p className="text-gray-300 text-sm mt-1">Seleccioná tu corte o tratamiento</p>
            </div>
            <span className="rounded-full border border-cyan/60 text-cyan font-extrabold text-xs tracking-wider px-3 py-1.5 whitespace-nowrap">
              {services.length} DISPONIBLES
            </span>
          </div>

          <fieldset className="mt-4 pt-4 border-t border-dark-border">
            <legend className="sr-only">Elegí un servicio</legend>
            <ul className="space-y-3">
              {services.map((s) => {
                const Icon = iconFor(s.name);
                const on = serviceId === s._id;
                return (
                  <li key={s._id}>
                    <label
                      className={`flex items-center gap-4 rounded-2xl p-4 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-cyan focus-within:ring-offset-2 focus-within:ring-offset-dark-surface ${
                        on ? 'border-2 border-cyan bg-cyan-dim' : 'border border-dark-border hover:border-cyan/60'
                      }`}
                    >
                      <input type="radio" name="servicio" value={s._id} checked={on} onChange={() => pickService(s._id)} className="sr-only" />
                      <span aria-hidden="true" className="w-14 h-14 shrink-0 rounded-full bg-cyan text-black flex items-center justify-center">
                        <Icon size={26} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-sans font-extrabold text-lg text-white leading-tight">{s.name}</span>
                        {s.description && <span className="block text-sm text-gray-300 mt-0.5">{s.description}</span>}
                        <span className="block text-sm text-gray-300">{s.duration} min</span>
                        <span className="block font-sans font-extrabold text-white mt-1">{money(s.price)} ARS</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${on ? 'bg-cyan text-black' : 'border-2 border-gray-400'}`}
                      >
                        {on && <Check size={18} strokeWidth={3} />}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        </section>

        {/* Día y horario */}
        <section aria-labelledby="slot-title" className="space-y-3">
          <h2 id="slot-title" className={`${sectionTitle} px-1`}>Elegí día y horario</h2>
          {!service ? (
            <div className={`${card} text-sm text-gray-300`}>Primero elegí un servicio para ver los horarios que entran.</div>
          ) : (
            <>
              <p className="text-gray-300 text-sm px-1">
                Tocá un horario <b className="text-emerald-200">libre (✓)</b>. Los <b className="text-rose-200">ocupados (✕)</b> ya están tomados.
              </p>
              <AgendaCalendar serviceId={serviceId} selected={slot} onPickSlot={(date, time) => setSlot({ date, time })} refreshKey={refreshKey} />
            </>
          )}
        </section>

        {/* Pago y datos */}
        <section aria-labelledby="pay-title" className={card}>
          <h2 id="pay-title" className={sectionTitle}>Pago y datos</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Método de pago">
              <span className="flex flex-wrap gap-2">
                {config.paymentMethods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayment(m)}
                    aria-pressed={payment === m}
                    className={`px-5 min-h-11 rounded-full border text-sm font-semibold transition-colors ${
                      payment === m ? 'border-cyan bg-cyan text-black' : 'border-white/25 text-gray-100 hover:border-cyan/70'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </span>
            </Field>
            {needsPhone && (
              <Field label="Tu teléfono / WhatsApp" hint="Para avisarte por cualquier cambio.">
                <input className={inputCls} type="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
            )}
            <Field label="Comentarios (opcional)">
              <textarea className={inputCls} rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej: fade bajo, tijera arriba…" />
            </Field>
          </div>
        </section>
      </div>

      {/* Resumen fijo: total + reservar */}
      <div className="fixed md:sticky inset-x-3 md:inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-4 z-30 md:px-4 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto bg-dark-surface/95 backdrop-blur border-2 border-cyan/50 rounded-3xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          {error && <div className="mb-3"><Alert>{error}</Alert></div>}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-xs tracking-widest text-gray-300 uppercase">Total seleccionado</p>
              <p className="font-sans font-extrabold text-2xl text-cyan leading-tight">
                {service ? money(service.price) : '$0'} <span className="text-base text-white">ARS</span>
              </p>
              <p id="summary-hint" className="text-sm text-gray-300">
                {slot ? `${fmt(slot.date, 'EEE d')} • ${slot.time} hs` : 'Elegí servicio y horario'}
              </p>
            </div>
            <Button
              onClick={confirm}
              disabled={!ready || busy}
              aria-describedby="summary-hint"
              className="rounded-full px-5 min-h-14 text-base sm:text-lg shrink-0"
            >
              <CalendarCheck size={20} aria-hidden="true" /> {busy ? 'RESERVANDO…' : 'RESERVAR TURNO'}
            </Button>
          </div>
        </div>
      </div>
    </ClientShell>
  );
}
