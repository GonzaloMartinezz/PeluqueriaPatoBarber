import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Instagram, LayoutDashboard, MapPin, Menu, Scissors, UserRound, X } from 'lucide-react';
import useAuth from '../store/auth';
import useBusiness from '../lib/useBusiness';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

// Barra flotante y angosta: enlaces a la izquierda, la marca en el centro y las acciones a la derecha.
// Al bajar la página se achica y se vuelve más sólida. En el celular, menú desplegable con botón hamburguesa.
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useAuth((s) => s.user);
  const business = useBusiness();

  const handle = (business?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape cierra el menú del celular.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const link = 'inline-flex items-center gap-1.5 min-h-11 px-3 rounded-full text-gray-100 hover:text-cyan hover:bg-cyan-dim font-semibold text-sm transition-colors';
  const icon = 'w-11 h-11 inline-flex items-center justify-center rounded-full text-gray-200 hover:text-cyan hover:bg-cyan-dim transition-colors';
  const cta = 'items-center justify-center bg-cyan text-black font-bebas rounded-full hover:bg-white transition-colors tracking-widest';
  const close = () => setOpen(false);

  const igUrl = `https://www.instagram.com/${handle}/`;
  const accountTo = user ? '/mi-cuenta' : '/login';

  const items = [
    { to: '/#servicios', label: 'Servicios', icon: Scissors, anchor: true },
    { to: '/#ubicacion', label: 'Ubicación', icon: MapPin, anchor: true },
    ...(user && !isAdmin ? [{ to: '/mis-turnos', label: 'Mis turnos', icon: CalendarDays }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Panel de administrador', icon: LayoutDashboard }] : []),
    { to: accountTo, label: user ? 'Mi cuenta' : 'Ingresar', icon: UserRound },
  ];
  const row = 'flex items-center gap-3 min-h-12 px-4 rounded-2xl text-gray-100 font-semibold hover:bg-cyan-dim hover:text-cyan transition-colors';

  return (
    <header className={`sticky top-0 z-50 px-3 transition-all duration-300 ${scrolled ? 'pt-2' : 'pt-4'}`}>
      <nav
        aria-label="Principal"
        className={`relative mx-auto rounded-full border border-dark-border backdrop-blur-md transition-all duration-300 px-2 ${
          scrolled ? 'max-w-3xl bg-dark-surface/95 shadow-[0_10px_40px_rgba(0,0,0,0.35)]' : 'max-w-5xl bg-dark-surface/70 shadow-[0_6px_24px_rgba(0,0,0,0.18)]'
        }`}
      >
        <div className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300 ${scrolled ? 'h-14' : 'h-[4.25rem]'}`}>
          {/* Izquierda */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <a href="/#servicios" className={link}>Servicios</a>
              <a href="/#ubicacion" className={link}>Ubicación</a>
              {user && !isAdmin && <Link to="/mis-turnos" className={link}>Mis turnos</Link>}
              {isAdmin && <Link to="/admin" className={link}><LayoutDashboard size={15} aria-hidden="true" /> Panel</Link>}
            </div>
            <button
              onClick={() => setOpen(!open)}
              className={`${icon} md:hidden`}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {/* Centro: marca */}
          <Link to="/" onClick={close} className="flex items-center gap-2.5 text-cyan font-bebas text-xl sm:text-2xl tracking-widest whitespace-nowrap">
            <Logo className={`transition-all duration-300 ${scrolled ? 'w-9 h-9' : 'w-11 h-11'}`} /> PATO BARBER
          </Link>

          {/* Derecha */}
          <div className="flex items-center justify-end">
            <div className="hidden md:flex items-center">
              <a href={igUrl} target="_blank" rel="noreferrer" className={icon} aria-label="Instagram de Pato Barber (se abre en una pestaña nueva)">
                <Instagram size={20} aria-hidden="true" />
              </a>
              <ThemeToggle className="rounded-full w-11 h-11 hover:bg-cyan-dim" />
              <Link to={accountTo} className={icon} aria-label={user ? 'Mi cuenta' : 'Ingresar'}><UserRound size={20} aria-hidden="true" /></Link>
            </div>
            <a href={igUrl} target="_blank" rel="noreferrer" className={`${icon} md:hidden`} aria-label="Instagram de Pato Barber (se abre en una pestaña nueva)">
              <Instagram size={20} aria-hidden="true" />
            </a>
            <Link to="/reservar" className={`${cta} hidden md:inline-flex ml-1 px-6 text-lg ${scrolled ? 'min-h-10' : 'min-h-11'}`}>RESERVAR</Link>
          </div>
        </div>
      </nav>

      {/* Menú del celular */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="md:hidden fixed inset-0 -z-10 bg-black/50 backdrop-blur-[2px]"
            />
            <motion.div
              id="menu-movil"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mx-auto mt-2 max-w-sm rounded-[2rem] border border-dark-border bg-dark-surface shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-3"
            >
              <ul className="flex flex-col gap-1">
                {items.map(({ to, label, icon: Icon, anchor }) => (
                  <li key={label}>
                    {anchor ? (
                      <a href={to} onClick={close} className={row}><Icon size={20} aria-hidden="true" className="text-cyan" /> {label}</a>
                    ) : (
                      <Link to={to} onClick={close} className={row}><Icon size={20} aria-hidden="true" className="text-cyan" /> {label}</Link>
                    )}
                  </li>
                ))}
                <li>
                  <a href={igUrl} target="_blank" rel="noreferrer" onClick={close} className={row}>
                    <Instagram size={20} aria-hidden="true" className="text-cyan" /> Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              </ul>
              <div className="mt-2 pt-3 border-t border-dark-border flex flex-col gap-2">
                <ThemeToggle withLabel className="rounded-2xl px-4 justify-start min-h-12 hover:bg-cyan-dim" />
                <Link to="/reservar" onClick={close} className={`${cta} inline-flex min-h-12 w-full text-xl`}>RESERVAR TURNO</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
