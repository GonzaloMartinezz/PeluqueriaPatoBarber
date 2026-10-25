import { Link } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Scissors } from 'lucide-react';

const steps = [
  [Scissors, 'Elegí tu servicio', 'Corte, barba o el combo completo. Ves el precio y cuánto dura antes de reservar.'],
  [CalendarDays, 'Mirá la agenda', 'Verde es libre, rojo es ocupado. Podés verla por día, semana o mes.'],
  [CheckCircle2, 'Confirmá y listo', 'Elegís cómo pagar y tu turno queda confirmado al instante. Podés cancelarlo cuando quieras.'],
];

export default function HowItWorks() {
  return (
    <section id="como-reservar" className="py-16 sm:py-24 bg-dark-surface/50 border-y border-dark-border" aria-labelledby="how-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Fácil y rápido</span>
        <h2 id="how-title" className="text-5xl md:text-6xl font-bebas tracking-wider mb-10">Cómo reservar</h2>
        <ol className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map(([Icon, title, text], i) => (
            <li key={title} className="bg-dark-surface border border-dark-border rounded-md p-6 relative">
              <span aria-hidden="true" className="absolute top-4 right-5 font-bebas text-6xl text-white/[0.06] leading-none">{i + 1}</span>
              <span className="w-12 h-12 rounded-md bg-cyan-dim border border-cyan/30 text-cyan flex items-center justify-center mb-4">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="text-2xl font-bebas tracking-wider mb-1">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Link
            to="/reservar"
            className="inline-flex items-center justify-center min-h-12 px-8 rounded-sm bg-cyan text-black font-bebas text-lg tracking-widest hover:bg-white transition-colors"
          >
            EMPEZAR A RESERVAR
          </Link>
        </div>
      </div>
    </section>
  );
}
