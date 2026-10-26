import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Clock, Scissors, Zap } from 'lucide-react';
import Logo from '../../components/Logo';
import useBusiness, { todayLine } from '../../lib/useBusiness';
import useServices from '../../lib/useServices';

// Foto propia (guardada en /public): no se pide nada a servidores de terceros.
const PHOTO = '/hero.jpg';

const fade = (delay = 0, x = 0) => ({
  initial: { opacity: 0, y: 24, x },
  animate: { opacity: 1, y: 0, x: 0 },
  transition: { duration: 0.6, delay },
});

// Portada: panel celeste con título grande, foto del local y tarjetas flotantes, más una barra con datos reales.
const HeroSection = () => {
  const business = useBusiness();
  const services = useServices();
  const today = todayLine(business);

  const openDays = business ? Object.values(business.workingHours).filter((d) => d?.isOpen).length : null;
  const stats = [
    [Scissors, services ? services.length : '—', 'Servicios'],
    [CalendarCheck, openDays ?? '—', 'Días de atención'],
    [Zap, '24/7', 'Reservas online'],
    [Clock, '1 min', 'Para reservar'],
  ];

  return (
    <section className="px-3 sm:px-5 pt-4 pb-2" aria-labelledby="hero-title">
      <div className="max-w-7xl mx-auto">
        <div className="sky-header relative overflow-hidden rounded-[2.25rem] sm:rounded-[3rem] px-5 sm:px-10 pt-10 sm:pt-14 pb-10 sm:pb-14">
          <motion.div {...fade()} className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center rounded-full glass-strong px-4 py-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-[#062a44]">
              San Miguel de Tucumán · Batalla de Chacabuco 1159
            </span>
            <h1 id="hero-title" className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-6" style={{ color: 'var(--on-sky)' }}>
              Potenciando tu estilo con <span className="text-[#c2410c]">precisión</span> y actitud urbana
            </h1>
          </motion.div>

          <div className="mt-10 grid md:grid-cols-[1fr_minmax(0,1.15fr)_1fr] gap-6 items-center">
            <motion.div {...fade(0.1, -20)} className="order-2 md:order-1 text-center md:text-left">
              <p className="text-lg leading-relaxed font-medium max-w-md mx-auto md:mx-0">
                Especialistas en degradés, perfilado de barba y coloración con imagen a tu medida. Mirá los horarios libres y reservá tu turno en menos de un minuto.
              </p>
              <a href="#servicios" className="mt-6 inline-flex items-center gap-2 min-h-12 px-7 rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-lg tracking-widest hover:bg-black transition-colors">
                EXPLORAR SERVICIOS <ArrowRight size={18} aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div {...fade(0.15)} className="order-1 md:order-2 relative">
              <div
                role="img"
                aria-label="Interior de la barbería con silla clásica y luz cálida"
                className="aspect-[4/5] md:aspect-[4/5] rounded-[2rem] ring-8 ring-glass bg-cover bg-center shadow-[0_30px_70px_rgba(6,42,68,0.45)]"
                style={{ backgroundImage: `url("${PHOTO}")` }}
              />
              <div className="absolute inset-x-4 bottom-4 flex gap-3">
                <Link to="/reservar" className="flex-1 inline-flex items-center justify-center min-h-14 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest shadow-lg hover:bg-white transition-colors">
                  RESERVAR TURNO
                </Link>
              </div>
            </motion.div>

            <motion.div {...fade(0.2, 20)} className="order-3 flex flex-col gap-4 items-center md:items-end">
              <div className="w-full max-w-xs flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-xl text-[#062a44]">
                <Logo className="w-16 h-16" />
                <div>
                  <p className="font-sans font-extrabold text-lg leading-tight">{business?.name || 'Pato Barber'}</p>
                  <p className="text-sm font-medium">Barbería · Tucumán</p>
                </div>
              </div>
              <div className="w-full max-w-xs rounded-3xl bg-white/90 p-4 shadow-xl text-[#062a44]">
                <p className="font-mono text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                  <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full ${today?.open ? 'bg-[#047857]' : 'bg-[#be123c]'}`} /> Hoy
                </p>
                <p className="font-sans font-extrabold text-lg mt-1">{today ? today.text : 'Reservá 24/7'}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-2 lg:grid-cols-4 rounded-[2rem] border border-dark-border bg-dark-surface overflow-hidden">
          {stats.map(([Icon, value, label], i) => (
            <li key={label} className={`p-5 sm:p-6 text-center ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l' : ''} border-dark-border`}>
              <Icon size={20} aria-hidden="true" className="mx-auto text-cyan mb-1" />
              <p className="font-sans font-extrabold text-3xl sm:text-4xl text-white leading-none">{value}</p>
              <p className="text-gray-300 text-sm font-semibold mt-1.5">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
