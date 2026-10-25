import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main id="main" className="min-h-dvh bg-dark-bg flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#07111c] via-[#0d1b2a] to-[#07111c]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: 'radial-gradient(rgba(251,146,60,0.5) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-cyan/10 blur-2xl" />
            <img src="/logo.jpg" alt="Logo Pato Barber" className="relative w-56 h-56 object-contain drop-shadow-[0_20px_40px_rgba(251,146,60,0.3)]" />
          </div>
          <h2 className="font-bebas text-6xl tracking-widest text-white mb-1">PATO BARBER</h2>
          <p className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-6">// Barbería de Precisión · Tucumán</p>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xs">Reservá tu turno online en menos de un minuto. Agenda en tiempo real, confirmación instantánea.</p>
          <div className="flex gap-6 mt-10 w-full justify-center">
            <div className="text-center">
              <p className="font-bebas text-4xl text-cyan leading-none">2K+</p>
              <p className="text-muted text-[10px] font-mono tracking-widest uppercase mt-1">Clientes</p>
            </div>
            <div className="w-px bg-dark-border" />
            <div className="text-center">
              <p className="font-bebas text-4xl text-cyan leading-none">10+</p>
              <p className="text-muted text-[10px] font-mono tracking-widest uppercase mt-1">Años</p>
            </div>
            <div className="w-px bg-dark-border" />
            <div className="text-center">
              <p className="font-bebas text-4xl text-cyan leading-none">100%</p>
              <p className="text-muted text-[10px] font-mono tracking-widest uppercase mt-1">Garantía</p>
            </div>
          </div>
          <a href="https://www.instagram.com/patobarber.pc/" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 mt-8 border border-cyan/30 rounded-full px-5 py-2 text-xs font-mono text-gray-300 hover:border-cyan hover:text-cyan transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            @patobarber.pc
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan to-transparent opacity-60" />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden sky-header w-full rounded-b-[2rem] px-5 pt-5 pb-16 text-center">
          <div className="max-w-md mx-auto flex items-center justify-between mb-3">
            <span className="w-11" aria-hidden="true" />
            <Link to="/" className="font-bebas text-2xl tracking-widest">PATO BARBER</Link>
            <ThemeToggle onSky />
          </div>
          <img src="/logo.jpg" alt="Logo Pato Barber" className="w-20 h-20 object-contain mx-auto rounded-full ring-4 ring-white/80 shadow-xl bg-white" />
        </div>
        <div className="hidden lg:flex items-center justify-between px-8 pt-7">
          <Link to="/" className="text-muted font-mono text-xs tracking-widest hover:text-cyan transition-colors">← VOLVER AL INICIO</Link>
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8 lg:py-6">
          <div className="w-full max-w-md">
            <div className="bg-dark-surface lg:bg-transparent border lg:border-0 border-dark-border rounded-3xl lg:rounded-none p-6 sm:p-8 lg:p-0 shadow-[0_10px_40px_rgba(0,0,0,0.25)] lg:shadow-none -mt-10 lg:mt-0">
              <div className="mb-7">
                <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase block mb-2">// Acceso seguro</span>
                <h1 className="font-sans font-extrabold text-3xl sm:text-4xl leading-tight text-white">{title}</h1>
                {subtitle && <p className="text-gray-300 text-sm mt-2">{subtitle}</p>}
              </div>
              {children}
            </div>
            {footer && <p className="mt-6 text-sm text-gray-300 text-center">{footer}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

export const OrDivider = () => (
  <div className="flex items-center gap-3 my-5 text-muted font-mono text-xs tracking-widest">
    <span className="flex-1 h-px bg-dark-border" /> O <span className="flex-1 h-px bg-dark-border" />
  </div>
);
