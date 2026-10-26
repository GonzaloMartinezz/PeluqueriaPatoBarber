import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { Magnetic } from '../../components/motion';
import { ArrowRight, CalendarDays, CheckCircle2, Scissors } from 'lucide-react';

const STEPS = [
  { icon: Scissors, title: 'Elegí tu servicio', text: 'Ves el precio y cuánto dura antes de reservar.', fill: 'from-[#bae6fd] to-[#38bdf8] text-[#062a44]' },
  { icon: CalendarDays, title: 'Mirá la agenda', text: 'Verde es libre, rojo es ocupado. Por día, semana o mes.', fill: 'from-[#fed7aa] to-[#fb923c] text-[#2a1000]' },
  { icon: CheckCircle2, title: 'Confirmá y listo', text: 'Elegís cómo pagar y tu turno queda confirmado al instante.', fill: 'from-[#7dd3fc] to-[#0ea5e9] text-[#062a44]' },
];

export default function HowItWorks() {
  return (
    <section id="como-reservar" className="cv-auto py-16 sm:py-24 bg-dark-surface/50 border-y border-dark-border" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 id="how-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white">
            Reservá en <span className="text-cyan">3 pasos</span>
          </h2>
        </div>

        <ol className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map(({ icon: Icon, title, text, fill }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 50, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, rotate: i % 2 ? 1.2 : -1.2 }}
              className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 sm:p-8 shadow-lg hover:shadow-2xl ${fill}`}
            >
              <motion.span initial={{ scale: 0.4, opacity: 0 }} whileInView={{ scale: 1, opacity: 0.15 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.18, type: 'spring', stiffness: 120 }} aria-hidden="true" className="absolute -right-2 -top-6 font-sans font-extrabold text-[9rem] leading-none">{i + 1}</motion.span>
              <span aria-hidden="true" className="relative w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"><Icon size={26} /></span>
              <h3 className="relative text-inherit font-sans font-extrabold text-2xl">
                <span className="sr-only">Paso {i + 1}: </span>{title}
              </h3>
              <p className="relative mt-2 text-lg leading-snug font-medium">{text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Magnetic>
            <Link to="/reservar" className="group btn-shine inline-flex items-center justify-center gap-2 min-h-14 px-9 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest shadow-xl hover:shadow-2xl active:scale-95 transition-all">
              EMPEZAR A RESERVAR <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
