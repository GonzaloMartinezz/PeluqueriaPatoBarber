import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main id="main" className="min-h-dvh bg-dark-bg flex flex-col items-center justify-center px-4 py-10 relative">
      <ThemeToggle className="absolute top-3 right-3" />
      <Link to="/" className="text-cyan font-bebas text-3xl tracking-widest mb-8">PATO BARBER</Link>
      <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-md p-6 sm:p-8">
        <h1 className="text-5xl font-bebas tracking-wider leading-none">{title}</h1>
        <p className="text-gray-300 text-sm mt-2 mb-6">{subtitle}</p>
        {children}
      </div>
      <p className="mt-6 text-sm text-gray-300">{footer}</p>
    </main>
  );
}

export const OrDivider = () => (
  <div className="flex items-center gap-3 my-5 text-muted font-mono text-[11px] tracking-widest">
    <span className="flex-1 h-px bg-dark-border" /> O <span className="flex-1 h-px bg-dark-border" />
  </div>
);
