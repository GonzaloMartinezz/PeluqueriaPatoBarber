import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Instagram, MapPin, Navigation, Phone } from 'lucide-react';
import { Magnetic, Reveal } from '../../components/motion';
import { EASE } from '../../lib/ease';
import useBusiness, { DAY_LABELS, todayKey, todayLine } from '../../lib/useBusiness';

const social =
  'btn-shine flex-1 min-h-12 px-4 rounded-full border border-dark-border bg-dark-surface flex items-center justify-center gap-2 text-gray-100 hover:text-cyan hover:border-cyan/60 active:scale-95 transition-all font-semibold';

// Anillos que se expanden alrededor del pin (efecto radar).
const Radar = () => (
  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="absolute rounded-full border-2 border-[#fb923c]"
        style={{ width: 90, height: 90 }}
        initial={{ scale: 0.4, opacity: 0.8 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 3, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
      />
    ))}
  </span>
);

const LocationSection = () => {
  const b = useBusiness();
  const address = b?.address || 'Batalla de Chacabuco 1159, San Miguel de Tucumán';
  const handle = (b?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const phoneDigits = b?.phone?.replace(/\D/g, '');
  const today = todayKey();
  const status = todayLine(b);
  // El mapa de Google recién se carga si la persona lo pide: así Google no recibe la visita de quien no lo mira.
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="ubicacion" className="relative py-16 sm:py-24 bg-dark-bg overflow-hidden" aria-labelledby="loc-title">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(var(--color-dark-border) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      <div className="relative max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Visitá el local</span>
          <h2 id="loc-title" className="font-sans font-extrabold text-4xl md:text-6xl text-white">
            Ubicación y <span className="text-cyan">horarios</span>
          </h2>
          <p className="text-gray-300 text-lg mt-3 max-w-xl mx-auto">Pasá por la barbería: te esperamos con turno o sin turno, según disponibilidad.</p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] gap-5">
          {/* Información */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fed7aa] via-[#fdba74] to-[#fb923c] text-[#2a1000] p-6 sm:p-7">
                <span aria-hidden="true" className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/30" />
                <div className="relative flex items-start gap-4">
                  <span aria-hidden="true" className="relative w-14 h-14 rounded-2xl bg-[#062a44] text-[#fb923c] flex items-center justify-center shrink-0">
                    <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}><MapPin size={26} /></motion.span>
                  </span>
                  <div>
                    <p className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase">Dirección</p>
                    <h3 className="text-inherit font-sans font-extrabold text-2xl leading-tight mt-1">{address}</h3>
                    <p className="font-medium">San Miguel de Tucumán, Argentina</p>
                  </div>
                </div>
                <div className="relative mt-5">
                  <Magnetic>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group btn-shine inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-xl tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      <Navigation size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-45" /> CÓMO LLEGAR <span className="sr-only">(se abre en una pestaña nueva)</span>
                    </a>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-dark-border bg-dark-surface p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="flex items-center gap-3 font-sans font-extrabold text-2xl text-white">
                    <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-sky-dim text-sky flex items-center justify-center"><Clock size={22} /></span>
                    Horarios
                  </h3>
                  {status && (
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${status.open ? 'bg-free/15 text-emerald-200' : 'bg-busy/15 text-rose-200'}`}>
                      <span aria-hidden="true" className="relative flex w-2 h-2">
                        {status.open && <span className="absolute inset-0 rounded-full bg-free animate-ping opacity-70" />}
                        <span className={`relative w-2 h-2 rounded-full ${status.open ? 'bg-free' : 'bg-busy'}`} />
                      </span>
                      {status.open ? 'Abierto ahora' : 'Cerrado'}
                    </span>
                  )}
                </div>
                {b ? (
                  <dl>
                    {DAY_LABELS.map(([key, label], di) => {
                      const h = b.workingHours[key];
                      const now = key === today;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: di * 0.05, duration: 0.5, ease: EASE }}
                          whileHover={{ x: 5 }}
                          className={`relative flex justify-between gap-3 py-2.5 px-4 rounded-2xl ${now ? 'bg-cyan-dim text-white font-bold' : h?.isOpen ? 'text-gray-200' : 'text-muted'}`}
                        >
                          {now && <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-cyan" />}
                          <dt>{label}{now && <span className="ml-2 text-cyan font-mono text-[11px] tracking-widest">HOY</span>}</dt>
                          <dd className="text-right">{h?.isOpen ? h.shifts.map((t) => `${t.open} – ${t.close}`).join('  ·  ') : 'Cerrado'}</dd>
                        </motion.div>
                      );
                    })}
                  </dl>
                ) : (
                  <p className="text-muted">Cargando horarios…</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer" className={social}>
                  <Instagram size={18} aria-hidden="true" /> @{handle}<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
                {phoneDigits && (
                  <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className={social}>
                    <Phone size={18} aria-hidden="true" /> WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                )}
              </div>
            </Reveal>
          </div>

          {/* Mapa grande */}
          <Reveal y={40} delay={0.1} className="order-1 lg:order-2">
            <div className="relative h-full min-h-[440px] lg:min-h-[720px] rounded-[2rem] overflow-hidden border border-dark-border bg-dark-surface shadow-2xl">
              <AnimatePresence mode="wait">
                {showMap ? (
                  <motion.iframe
                    key="map"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    title={`Mapa: ${address}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                    className="map-frame absolute inset-0 w-full h-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <motion.div key="poster" exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center overflow-hidden">
                    {/* Plano estilizado */}
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#0b2a42] via-[#0d1b2a] to-[#07111c]" />
                    <span aria-hidden="true" className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(125,211,252,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.18) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
                    <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 700" preserveAspectRatio="xMidYMid slice">
                      <motion.path d="M-20 520 C 200 420 320 560 520 380 S 760 300 840 240" fill="none" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
                      <motion.path d="M120 -20 C 220 200 180 380 360 700" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.4, ease: 'easeInOut' }} />
                    </svg>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <Radar />
                      <motion.span
                        initial={{ y: -80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 160, damping: 11, delay: 0.3 }}
                        className="relative w-20 h-20 rounded-full bg-cyan text-black flex items-center justify-center shadow-[0_15px_40px_rgba(251,146,60,0.5)]"
                      >
                        <MapPin size={38} aria-hidden="true" />
                      </motion.span>
                    </div>
                    <p className="relative text-white font-sans font-extrabold text-2xl sm:text-3xl max-w-md leading-tight">{address}</p>
                    <Magnetic>
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="btn-shine pulse-ring relative min-h-14 px-10 rounded-full bg-cyan text-black font-bebas tracking-widest text-2xl shadow-xl hover:bg-white active:scale-95 transition-all"
                      >
                        VER MAPA
                      </button>
                    </Magnetic>
                    <p className="relative text-muted text-sm max-w-xs">Al ver el mapa se carga Google Maps y Google recibe tu visita.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
