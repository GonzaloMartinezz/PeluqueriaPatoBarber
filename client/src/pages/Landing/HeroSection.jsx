import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, ChevronDown, Clock, Scissors, Zap } from 'lucide-react';
import Logo from '../../components/Logo';
import { CountUp, Magnetic, Tilt } from '../../components/motion';
import { EASE } from '../../lib/ease';
import useBusiness, { todayLine } from '../../lib/useBusiness';
import useServices from '../../lib/useServices';

// Foto propia (guardada en /public): no se pide nada a servidores de terceros.
const PHOTO = '/hero.jpg';

const MLink = motion.create(Link);

// Palabra que sube desde una máscara (efecto de título cinematográfico).
const Word = ({ i, children, className = '' }) => (
  <span className="inline-block overflow-hidden align-bottom pb-1.5 -mb-1.5">
    <motion.span
      className={`inline-block ${className}`}
      initial={{ y: '115%', rotate: 4 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ duration: 0.85, delay: 0.2 + i * 0.07, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

// Sello giratorio con tijeras (detalle de barbería).
const Seal = () => (
  <div aria-hidden="true" className="absolute -top-5 -right-3 sm:-right-6 w-24 h-24 sm:w-28 sm:h-28 z-10">
    <motion.svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" animate={{ rotate: 360 }} transition={{ duration: 22, ease: 'linear', repeat: Infinity }}>
      <defs><path id="seal-path" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
      <circle cx="60" cy="60" r="58" fill="#062a44" />
      <text fill="#ffffff" fontSize="11" fontWeight="700" letterSpacing="2.6" fontFamily="DM Sans, sans-serif">
        <textPath href="#seal-path">PATO BARBER • PRECISIÓN •  </textPath>
      </text>
    </motion.svg>
    <span className="absolute inset-0 flex items-center justify-center text-[#fb923c]">
      <motion.span animate={{ rotate: [0, -16, 0, -16, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.2 }}>
        <Scissors size={26} />
      </motion.span>
    </span>
  </div>
);

const Float = ({ delay = 0, children, className = '' }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
    whileHover={{ scale: 1.04 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Portada a pantalla completa: la barra de navegación flota transparente encima.
const HeroSection = () => {
  const business = useBusiness();
  const services = useServices();
  const today = todayLine(business);

  const root = useRef(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Foco de luz que sigue al cursor.
  const mx = useMotionValue(50);
  const my = useMotionValue(25);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${mx}% ${my}%, rgba(255,255,255,0.6), transparent 62%)`;
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const openDays = business ? Object.values(business.workingHours).filter((d) => d?.isOpen).length : null;
  const stats = [
    [Scissors, services ? services.length : '—', 'Servicios'],
    [CalendarCheck, openDays ?? '—', 'Días de atención'],
    [Zap, '24/7', 'Reservas online'],
    [Clock, '1 min', 'Para reservar'],
  ];

  const words = ['Potenciando', 'tu', 'estilo', 'con'];
  const tail = ['y', 'actitud', 'urbana'];

  return (
    <section ref={root} className="relative" aria-labelledby="hero-title">
      <div
        onMouseMove={onMove}
        className="sky-header relative overflow-hidden min-h-dvh flex flex-col justify-center rounded-b-[2.5rem] sm:rounded-b-[3.5rem] px-5 sm:px-10 lg:px-16 pt-28 sm:pt-32 pb-20"
      >
        {/* Fondo vivo */}
        <motion.div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: spotlight }} />
        <motion.span aria-hidden="true" className="absolute -left-24 top-1/3 w-72 h-72 rounded-full bg-[#fb923c]/35 blur-3xl" animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span aria-hidden="true" className="absolute -right-20 -top-10 w-80 h-80 rounded-full bg-white/40 blur-3xl" animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        {/* Postes discretos, pegados a los bordes y a lo alto del hero */}
        <span aria-hidden="true" className="pole-v hidden lg:block absolute left-4 top-28 bottom-16 w-1.5 rounded-full opacity-50" />
        <span aria-hidden="true" className="pole-v hidden lg:block absolute right-4 top-28 bottom-16 w-1.5 rounded-full opacity-50" />

        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div style={{ y: titleY }} className="text-center max-w-5xl mx-auto">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#062a44]"
            >
              <span aria-hidden="true" className="relative flex w-2.5 h-2.5">
                <span className="absolute inset-0 rounded-full bg-[#c2410c] animate-ping opacity-70" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-[#c2410c]" />
              </span>
              San Miguel de Tucumán · Batalla de Chacabuco 1159
            </motion.span>

            <h1 id="hero-title" className="font-sans font-extrabold text-4xl sm:text-6xl xl:text-7xl leading-[1.08] tracking-tight mt-5" style={{ color: 'var(--on-sky)' }}>
              {words.map((w, i) => <span key={w}><Word i={i}>{w}</Word>{' '}</span>)}
              <span className="relative inline-block">
                <Word i={4} className="text-[#c2410c]">precisión</Word>
                <svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute left-0 -bottom-1.5 w-full h-3">
                  <motion.path
                    d="M2 8 Q 50 0 100 6 T 198 5"
                    fill="none"
                    stroke="#c2410c"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
                  />
                </svg>
              </span>{' '}
              {tail.map((w, i) => <span key={w}><Word i={5 + i}>{w}</Word>{' '}</span>)}
            </h1>
          </motion.div>

          <div className="mt-8 grid md:grid-cols-[1fr_minmax(0,1.1fr)_1fr] gap-6 lg:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="order-2 md:order-1 text-center md:text-left"
            >
              <p className="text-lg leading-relaxed font-medium max-w-md mx-auto md:mx-0">
                Especialistas en degradés, perfilado de barba y coloración con imagen a tu medida. Mirá los horarios libres y reservá tu turno en menos de un minuto.
              </p>
              <div className="mt-6">
                <Magnetic strength={0.25}>
                  <motion.a
                    href="#servicios"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group btn-shine inline-flex items-center gap-2 min-h-12 px-7 rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-lg tracking-widest shadow-xl"
                  >
                    EXPLORAR SERVICIOS <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </motion.a>
                </Magnetic>
              </div>
            </motion.div>

            <motion.div style={{ y: photoY }} className="order-1 md:order-2 relative">
              <Tilt max={6}>
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0% round 2rem)' }}
                    animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
                    transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
                  >
                    <div
                      role="img"
                      aria-label="Interior de la barbería con silla clásica y luz cálida"
                      className="h-[clamp(260px,38vh,420px)] rounded-[2rem] ring-8 ring-glass bg-cover bg-center shadow-[0_30px_70px_rgba(6,42,68,0.45)]"
                      style={{ backgroundImage: `url("${PHOTO}")` }}
                    />
                  </motion.div>
                  <div className="absolute inset-x-4 bottom-4">
                    <MLink
                      to="/reservar"
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className="group btn-shine pulse-ring flex items-center justify-center gap-2 min-h-14 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest shadow-lg"
                    >
                      RESERVAR TURNO <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </MLink>
                  </div>
                  <Seal />
                </div>
              </Tilt>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
              className="order-3 flex flex-col gap-3 items-center md:items-end"
            >
              <Float className="w-full max-w-xs">
                <div className="flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-xl text-[#062a44]">
                  <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.6 }}><Logo className="w-14 h-14" /></motion.div>
                  <div>
                    <p className="font-sans font-extrabold text-lg leading-tight">{business?.name || 'Pato Barber'}</p>
                    <p className="text-sm font-medium">Barbería · Tucumán</p>
                  </div>
                </div>
              </Float>
              <Float delay={1.4} className="w-full max-w-xs">
                <div className="rounded-3xl bg-white/90 p-4 shadow-xl text-[#062a44]">
                  <p className="font-mono text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                    <span aria-hidden="true" className="relative flex w-2.5 h-2.5">
                      {today?.open && <span className="absolute inset-0 rounded-full bg-[#047857] animate-ping opacity-70" />}
                      <span className={`relative w-2.5 h-2.5 rounded-full ${today?.open ? 'bg-[#047857]' : 'bg-[#be123c]'}`} />
                    </span>
                    Hoy
                  </p>
                  <p className="font-sans font-extrabold text-lg mt-1">{today ? today.text : 'Reservá 24/7'}</p>
                </div>
              </Float>
            </motion.div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <motion.a href="#servicios" aria-label="Bajar a los servicios" style={{ opacity: cueOpacity }} className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center text-[#062a44]">
          <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase">Deslizá</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}><ChevronDown size={22} aria-hidden="true" /></motion.span>
        </motion.a>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-5 -mt-8">
        <ul className="grid grid-cols-2 lg:grid-cols-4 rounded-[2rem] border border-dark-border bg-dark-surface shadow-2xl overflow-hidden">
          {stats.map(([Icon, value, label], i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              whileHover={{ backgroundColor: 'var(--color-cyan-dim)' }}
              className={`group p-5 sm:p-6 text-center ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l' : ''} border-dark-border`}
            >
              <Icon size={20} aria-hidden="true" className="snip mx-auto text-cyan mb-1" />
              <p className="font-sans font-extrabold text-3xl sm:text-4xl text-white leading-none">
                <CountUp to={value} />
              </p>
              <p className="text-gray-300 text-sm font-semibold mt-1.5">{label}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
