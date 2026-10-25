import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';

// Pantallas de ingreso: encabezado celeste con la marca y una tarjeta con el formulario.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main id="main" className="min-h-dvh bg-dark-bg flex flex-col items-center relative">
      <div className="sky-header w-full rounded-b-[2.5rem] px-5 pt-5 pb-20 text-center">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <span className="w-11" aria-hidden="true" />
          <Link to="/" className="font-bebas text-3xl tracking-widest py-1">PATO BARBER</Link>
          <ThemeToggle onSky />
        </div>
        <span
          aria-hidden="true"
          className="mx-auto mt-3 w-16 h-16 rounded-full glass-strong ring-4 ring-glass flex items-center justify-center"
        >
          <Scissors size={28} />
        </span>
      </div>

      <div className="w-full max-w-md px-4 -mt-12 pb-10">
        <div className="bg-dark-surface border border-dark-border rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <h1 className="font-sans font-extrabold text-3xl leading-tight">{title}</h1>
          <p className="text-gray-300 text-sm mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
        <p className="mt-6 text-sm text-gray-300 text-center">{footer}</p>
      </div>
    </main>
  );
}

export const OrDivider = () => (
  <div className="flex items-center gap-3 my-5 text-muted font-mono text-xs tracking-widest">
    <span className="flex-1 h-px bg-dark-border" /> O <span className="flex-1 h-px bg-dark-border" />
  </div>
);
