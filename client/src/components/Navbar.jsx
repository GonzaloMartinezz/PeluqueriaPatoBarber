import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Instagram, LayoutDashboard, MapPin, Menu, Scissors, UserRound, X } from 'lucide-react';
import useAuth from '../store/auth';
import useBusiness from '../lib/useBusiness';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Underline = () => (
  <span aria-hidden="true" className="absolute left-0 -bottom-0.5 h-[3px] w-full origin-left scale-x-0 rounded-full bg-[#fb923c] transition-transform duration-300 group-hover:scale-x-100" />
);

// Barra tipo cartel de barbería. En la portada (overHero) arranca transparente sobre el hero y, al bajar,
// se vuelve oscura con un poste de barbero debajo. En el resto de las pantallas es siempre oscura.
const Navbar = ({ overHero = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useAuth((s) => s.user);
  const business = useBusiness();

  const handle = (business?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Transparente solo arriba de todo y sobre el hero; si el menú móvil está abierto también se oscurece.
  const clear = overHero && !scrolled && !open;
  const ink = clear ? 'text-[#062a44]' : 'text-[#ffffff]';
  const iconBtn = `w-11 h-11 inline-flex items-center justify-center rounded-full transition-colors hover:bg-[#fb923c] hover:text-[#1c0a00] ${clear ? 'text-[#062a44]' : 'text-[#e5e7eb]'}`;
  const link = `group relative inline-flex items-center gap-2 min-h-11 px-1 font-bebas text-xl tracking-[0.18em] uppercase ${ink} transition-colors hover:text-[#fb923c]`;
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
  const row = 'flex items-center gap-3 min-h-12 px-4 rounded-2xl text-[#ffffff] font-bebas text-xl tracking-widest uppercase hover:bg-[#fb923c]/15 hover:text-[#fb923c] transition-colors';

  return (
    <header className={`${overHero ? 'fixed' : 'sticky'} top-0 inset-x-0 z-50`}>
      <div className={`relative transition-all duration-500 ${clear ? 'bg-transparent' : 'bg-[#06111a]/92 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]'}`}>
        <nav aria-label="Principal" className={`max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ${scrolled || !overHero ? 'h-[4.25rem]' : 'h-24'}`}>
          {/* Izquierda */}
          <div className="flex items-center gap-7">
            <div className="hidden lg:flex items-center gap-7">
              <a href="/#servicios" className={link}><Scissors size={16} aria-hidden="true" className="-ml-1 -mr-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />Servicios<Underline /></a>
              <a href="/#ubicacion" className={link}>Ubicación<Underline /></a>
              {user && !isAdmin && <Link to="/mis-turnos" className={link}>Mis turnos<Underline /></Link>}
              {isAdmin && <Link to="/admin" className={link}><LayoutDashboard size={16} aria-hidden="true" /> Panel<Underline /></Link>}
            </div>
            <button
              onClick={() => setOpen(!open)}
              className={`${iconBtn} lg:hidden`}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              {open ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
            </button>
          </div>

          {/* Centro: medallón con el logo */}
          <Link to="/" onClick={close} className={`group flex items-center gap-3 whitespace-nowrap ${clear ? 'text-[#062a44]' : 'text-[#fb923c]'}`}>
            <motion.span whileHover={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 0.6 }} className="relative inline-flex">
              <span aria-hidden="true" className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#fb923c] animate-[spin_18s_linear_infinite]" />
              <Logo className={`relative ring-2 ring-[#ffffff] transition-all duration-500 ${scrolled || !overHero ? 'w-11 h-11' : 'w-14 h-14'}`} />
            </motion.span>
            <span className="font-bebas text-2xl sm:text-3xl tracking-[0.2em]">PATO BARBER</span>
          </Link>

          {/* Derecha */}
          <div className="flex items-center justify-end gap-1">
            <a href={igUrl} target="_blank" rel="noreferrer" className={`${iconBtn} hidden sm:inline-flex`} aria-label="Instagram de Pato Barber (se abre en una pestaña nueva)">
              <Instagram size={20} aria-hidden="true" />
            </a>
            <ThemeToggle className={`${iconBtn} !min-w-11 ${clear ? '!text-[#062a44]' : '!text-[#e5e7eb]'} hover:!text-[#1c0a00]`} />
            <Link to={accountTo} className={`${iconBtn} hidden sm:inline-flex`} aria-label={user ? 'Mi cuenta' : 'Ingresar'}><UserRound size={20} aria-hidden="true" /></Link>
            <Link to="/reservar" className="btn-shine group ml-1 hidden sm:inline-flex items-center gap-2 min-h-11 px-6 rounded-md bg-[#fb923c] text-[#1c0a00] font-bebas text-xl tracking-widest shadow-lg hover:bg-[#ffffff] active:scale-95 transition-all">
              <Scissors size={16} aria-hidden="true" className="snip" /> RESERVAR
            </Link>
          </div>
        </nav>

        {/* Poste de barbero: aparece al bajar */}
        <span aria-hidden="true" className={`pole-bar block h-1 w-full transition-opacity duration-500 ${clear ? 'opacity-0' : 'opacity-100'}`} />
      </div>

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
              className="lg:hidden fixed inset-0 -z-10 bg-black/60 backdrop-blur-[2px]"
            />
            <motion.div
              id="menu-movil"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-[#06111a] border-b-4 border-[#fb923c] rounded-b-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] px-4 pt-3 pb-5"
            >
              <ul className="flex flex-col gap-1">
                {items.map(({ to, label, icon: Icon, anchor }, i) => (
                  <motion.li key={label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                    {anchor ? (
                      <a href={to} onClick={close} className={row}><Icon size={20} aria-hidden="true" className="text-[#fb923c]" /> {label}</a>
                    ) : (
                      <Link to={to} onClick={close} className={row}><Icon size={20} aria-hidden="true" className="text-[#fb923c]" /> {label}</Link>
                    )}
                  </motion.li>
                ))}
                <li>
                  <a href={igUrl} target="_blank" rel="noreferrer" onClick={close} className={row}>
                    <Instagram size={20} aria-hidden="true" className="text-[#fb923c]" /> Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              </ul>
              <Link to="/reservar" onClick={close} className="btn-shine mt-3 flex items-center justify-center gap-2 min-h-14 w-full rounded-md bg-[#fb923c] text-[#1c0a00] font-bebas text-2xl tracking-widest active:scale-95 transition-all">
                <Scissors size={20} aria-hidden="true" /> RESERVAR TURNO
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
