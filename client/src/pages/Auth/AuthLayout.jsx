import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, Instagram, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import LegalLinks from '../../components/LegalLinks';
import Logo from '../../components/Logo';

const POINTS = [
  [CalendarCheck, 'Elegí día y horario libre en la agenda'],
  [Clock, 'Reservá en menos de un minuto, las 24 hs'],
  [ShieldCheck, 'Tus datos protegidos y cifrados'],
];

// Pantallas de ingreso. Escritorio: panel con el logo a la izquierda y el formulario a la derecha.
// Celular: encabezado celeste con el logo y el formulario debajo.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-dvh bg-dark-bg lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="sky-header hidden lg:flex flex-col justify-between p-10 xl:p-14 rounded-r-[3rem] sticky top-0 h-dvh">
        <Link to="/" className="font-bebas text-3xl tracking-widest w-fit py-1">PATO BARBER</Link>
        <div>
          <Logo className="w-56 h-56 xl:w-64 xl:h-64" ring />
          <h2 className="font-sans font-extrabold text-4xl xl:text-5xl leading-tight mt-8" style={{ color: 'var(--on-sky)' }}>
            Tu turno, sin vueltas.
          </h2>
          <ul className="mt-6 space-y-3 text-lg font-semibold">
            {POINTS.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3"><Icon size={22} aria-hidden="true" className="shrink-0" /> {text}</li>
            ))}
          </ul>
        </div>
        <a href="https://www.instagram.com/patobarber.pc/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 min-h-11 w-fit font-semibold underline underline-offset-4">
          <Instagram size={18} aria-hidden="true" /> @patobarber.pc<span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </aside>

      <main id="main" className="flex flex-col items-center relative">
        <div className="sky-header w-full lg:hidden rounded-b-[2.5rem] px-5 pt-5 pb-16 text-center">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <span className="w-11" aria-hidden="true" />
            <Link to="/" className="font-bebas text-3xl tracking-widest py-1">PATO BARBER</Link>
            <ThemeToggle onSky />
          </div>
          <Logo className="w-24 h-24 mx-auto mt-3" ring />
        </div>

        <div className="hidden lg:flex w-full items-center justify-between p-5">
          <Link to="/" className="text-muted font-mono text-xs tracking-widest hover:text-cyan transition-colors py-3">← VOLVER AL INICIO</Link>
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md px-4 -mt-10 lg:mt-0 lg:my-auto pb-10">
          <div className="bg-dark-surface border border-dark-border rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <h1 className="font-sans font-extrabold text-3xl leading-tight">{title}</h1>
            <p className="text-gray-300 text-sm mt-1 mb-6">{subtitle}</p>
            {children}
          </div>
          <p className="mt-6 text-sm text-gray-300 text-center">{footer}</p>
          <LegalLinks className="justify-center mt-2" />
        </div>
      </main>
    </div>
  );
}

export const OrDivider = () => (
  <div className="flex items-center gap-3 my-5 text-muted font-mono text-xs tracking-widest">
    <span className="flex-1 h-px bg-dark-border" /> O <span className="flex-1 h-px bg-dark-border" />
  </div>
);
