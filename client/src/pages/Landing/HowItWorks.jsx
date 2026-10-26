import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, CheckCircle2, Scissors } from 'lucide-react';

const STEPS = [
  { icon: Scissors, title: 'Elegí tu servicio', text: 'Ves el precio y cuánto dura antes de reservar.', fill: 'from-[#bae6fd] to-[#38bdf8] text-[#062a44]' },
  { icon: CalendarDays, title: 'Mirá la agenda', text: 'Verde es libre, rojo es ocupado. Por día, semana o mes.', fill: 'from-[#fed7aa] to-[#fb923c] text-[#2a1000]' },
  { icon: CheckCircle2, title: 'Confirmá y listo', text: 'Elegís cómo pagar y tu turno queda confirmado al instante.', fill: 'from-[#7dd3fc] to-[#0ea5e9] text-[#062a44]' },
];

export default function HowItWorks() {
  return (
    <section id="como-reservar" className="py-16 sm:py-24 bg-dark-surface/50 border-y border-dark-border" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Fácil y rápido</span>
          <h2 id="how-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white">
            Reservá en <span className="text-cyan">3 pasos</span>
          </h2>
        </div>

        <ol className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {STEPS.map(({ icon: Icon, title, text, fill }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-7 sm:p-8 ${fill}`}
            >
              <span aria-hidden="true" className="absolute -right-2 -top-6 font-sans font-extrabold text-[9rem] leading-none opacity-15">{i + 1}</span>
              <span aria-hidden="true" className="relative w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center mb-5"><Icon size={26} /></span>
              <h3 className="relative font-sans font-extrabold text-2xl">
                <span className="sr-only">Paso {i + 1}: </span>{title}
              </h3>
              <p className="relative mt-2 text-lg leading-snug font-medium">{text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link to="/reservar" className="inline-flex items-center justify-center gap-2 min-h-14 px-9 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest hover:bg-white transition-colors">
            EMPEZAR A RESERVAR <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
