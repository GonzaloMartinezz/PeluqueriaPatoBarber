import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, Zap } from 'lucide-react';
import useBusiness, { todayLine } from '../../lib/useBusiness';

const PHOTO =
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1400&auto=format&fit=crop';

// Portada: encabezado celeste (igual que la app del cliente) + la foto del local como tarjeta.
const HeroSection = () => {
  const business = useBusiness();
  const today = todayLine(business);

  const chips = [
    [CalendarCheck, 'Agenda en tiempo real'],
    [Zap, 'Confirmación al instante'],
    [Clock, today ? today.text : 'Reservá 24/7'],
  ];

  return (
    <section className="sky-header rounded-b-[2.5rem] md:rounded-b-[4rem]" aria-labelledby="hero-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase mb-4 block">// Cultura urbana · Tucumán</span>
          <h1
            id="hero-title"
            className="text-[4.25rem] sm:text-8xl lg:text-9xl font-bebas leading-[0.85] mb-6 tracking-tight"
            style={{ color: 'var(--on-sky)' }}
          >
            ENGINEERED <br />
            FOR <span style={{ color: '#b4380a' }}>PRECISION</span>
          </h1>
          <p className="text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-medium">
            Estética urbana con precisión quirúrgica. Mirá los horarios libres y reservá tu fade en menos de un minuto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              to="/reservar"
              className="bg-cyan text-black font-bebas text-xl px-10 min-h-14 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--on-sky)] hover:text-[#fff] transition-colors tracking-widest shadow-[0_10px_30px_rgba(194,65,12,0.35)]"
            >
              RESERVAR TURNO
            </Link>
            <a
              href="#servicios"
              className="border-2 border-[color:var(--on-sky)] font-bebas text-xl px-8 min-h-14 inline-flex items-center justify-center rounded-full hover:bg-[color:var(--on-sky)] hover:text-[#fff] transition-colors tracking-widest"
            >
              VER SERVICIOS
            </a>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
            {chips.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2">
                <Icon size={16} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div
            role="img"
            aria-label="Interior de la barbería con silla clásica y luz cálida"
            className="aspect-[4/3] md:aspect-[4/5] rounded-[2rem] ring-8 ring-glass bg-cover bg-center shadow-[0_25px_60px_rgba(6,42,68,0.35)]"
            style={{ backgroundImage: `url("${PHOTO}")` }}
          />
          <span className="absolute -bottom-4 left-6 rounded-full glass-strong px-5 py-2 font-bebas text-xl tracking-widest shadow-lg">
            PATO BARBER
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
