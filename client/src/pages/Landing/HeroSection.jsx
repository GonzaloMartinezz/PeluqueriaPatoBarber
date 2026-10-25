import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, Zap } from 'lucide-react';
import useBusiness, { todayKey } from '../../lib/useBusiness';

const HeroSection = () => {
  const business = useBusiness();
  const today = business?.workingHours?.[todayKey()];

  const chips = [
    [CalendarCheck, 'Agenda en tiempo real'],
    [Zap, 'Confirmación al instante'],
    [Clock, today ? (today.isOpen ? `Hoy: ${today.open} a ${today.close}` : 'Hoy: cerrado') : 'Reservá 24/7'],
  ];

  return (
    <section data-theme="dark" className="relative min-h-[min(88svh,760px)] flex items-center overflow-hidden text-gray-200" aria-labelledby="hero-title">
      {/* Foto + degradé: oscurece lo suficiente para que el texto se lea (contraste AA) */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop")' }}
        role="img"
        aria-label="Interior de la barbería con silla clásica y luz cálida"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/85 to-dark-bg/40 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/60 z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16">
        <div className="max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
              // Cultura urbana · Tucumán
            </span>
            <h1 id="hero-title" className="text-[4.25rem] sm:text-8xl md:text-9xl font-bebas leading-[0.85] text-white mb-6 tracking-tight">
              ENGINEERED <br />
              FOR <span className="text-cyan">PRECISION</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
              Estética urbana con precisión quirúrgica. Mirá los horarios libres y reservá tu fade en menos de un minuto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                to="/reservar"
                className="bg-cyan text-black font-bebas text-xl px-10 min-h-14 inline-flex items-center justify-center rounded-sm hover:bg-white transition-colors tracking-widest shadow-[0_0_40px_rgba(0,229,255,0.25)]"
              >
                RESERVAR TURNO
              </Link>
              <a
                href="#servicios"
                className="border border-white/30 text-white font-bebas text-xl px-8 min-h-14 inline-flex items-center justify-center rounded-sm hover:border-cyan hover:text-cyan transition-colors tracking-widest"
              >
                VER SERVICIOS
              </a>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
              {chips.map(([Icon, text]) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={16} aria-hidden="true" className="text-cyan" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
