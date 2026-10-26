import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock, Scissors, Zap } from 'lucide-react';
import Logo from '../../components/Logo';
import useBusiness, { todayLine } from '../../lib/useBusiness';

// Foto propia (guardada en /public): no se pide nada a servidores de terceros.
const PHOTO = '/hero.jpg';

// Portada oscura: título grande, foto del local con los botones y la tarjeta con el logo.
const HeroSection = () => {
  const business = useBusiness();
  const today = todayLine(business);

  const perks = [
    [CalendarCheck, 'Agenda en tiempo real', 'Ves los horarios libres al instante'],
    [Zap, 'Confirmación al instante', 'Sin llamadas ni esperas'],
    [Scissors, 'Cortes y coloración', 'Fade, perfilado y teñido'],
    [Clock, today ? today.text : 'Reservá 24/7', business?.address || 'San Miguel de Tucumán'],
  ];

  return (
    <section className="relative overflow-hidden bg-dark-bg" aria-labelledby="hero-title">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(60% 50% at 15% 0%, var(--color-cyan-dim), transparent 70%), radial-gradient(50% 45% at 90% 20%, var(--color-sky-dim), transparent 70%)',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-dark-border bg-dark-surface/80 px-4 py-1.5 font-mono text-xs font-bold tracking-[0.2em] uppercase text-gray-200">
            San Miguel de Tucumán · Batalla de Chacabuco 1159
          </span>
          <h1 id="hero-title" className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-6 text-white">
            Potenciando tu estilo con <span className="text-cyan">precisión</span> y actitud urbana
          </h1>
        </motion.div>

        <div className="mt-10 md:mt-14 grid md:grid-cols-[1fr_1.1fr_1fr] gap-6 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="order-2 md:order-1 text-center md:text-left">
            <p className="text-gray-200 text-lg leading-relaxed">
              Especialistas en degradés, perfilado de barba y coloración con imagen a tu medida. Mirá los horarios libres y reservá tu turno en menos de un minuto.
            </p>
            <a href="#servicios" className="mt-6 inline-flex items-center gap-2 min-h-12 px-6 rounded-full border-2 border-white/25 font-bebas text-lg tracking-widest text-white hover:border-cyan hover:text-cyan transition-colors">
              EXPLORAR SERVICIOS <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="order-1 md:order-2 relative">
            <div
              role="img"
              aria-label="Interior de la barbería con silla clásica y luz cálida"
              className="aspect-[4/5] sm:aspect-[5/6] rounded-[2rem] bg-cover bg-center border border-dark-border shadow-[0_25px_60px_rgba(0,0,0,0.45)]"
              style={{ backgroundImage: `url("${PHOTO}")` }}
            />
            <div className="absolute inset-x-4 bottom-4 flex flex-col sm:flex-row gap-3">
              <Link to="/reservar" className="flex-1 inline-flex items-center justify-center min-h-14 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest shadow-lg hover:bg-white transition-colors">
                RESERVAR TURNO
              </Link>
              <Link to="/login" className="flex-1 inline-flex items-center justify-center min-h-14 rounded-full glass-strong text-[#062a44] font-bebas text-xl tracking-widest hover:bg-white transition-colors">
                INGRESAR
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="order-3 flex md:justify-end">
            <div className="w-full max-w-sm mx-auto md:mx-0 flex items-center gap-4 rounded-3xl border border-dark-border bg-dark-surface p-4 shadow-xl">
              <Logo className="w-20 h-20" />
              <div>
                <p className="font-sans font-extrabold text-xl text-white leading-tight">{business?.name || 'Pato Barber'}</p>
                <p className="text-gray-300 text-sm">Barbería · Tucumán</p>
                <a href="#instagram" className="inline-flex items-center min-h-11 text-cyan font-semibold text-sm underline underline-offset-4">Mirá nuestros reels</a>
              </div>
            </div>
          </motion.div>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map(([Icon, title, sub]) => (
            <li key={title} className="flex items-center gap-4 rounded-2xl border border-dark-border bg-dark-surface/80 p-4">
              <span aria-hidden="true" className="w-11 h-11 rounded-xl bg-cyan-dim text-cyan flex items-center justify-center shrink-0"><Icon size={22} /></span>
              <span className="min-w-0">
                <span className="block font-bold text-white">{title}</span>
                <span className="block text-gray-300 text-sm">{sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
