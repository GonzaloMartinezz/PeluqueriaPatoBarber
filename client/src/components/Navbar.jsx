import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, LayoutDashboard, Menu, UserRound, X } from 'lucide-react';
import useAuth from '../store/auth';
import useBusiness from '../lib/useBusiness';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

// Barra superior flotante: Servicios · Ubicación · Mis turnos · Instagram · tema · Reservar.
const Navbar = () => {
  const [openFor, setOpenFor] = useState(null);
  const user = useAuth((s) => s.user);
  const business = useBusiness();
  const location = useLocation();

  // El menú móvil queda abierto solo para la página donde se abrió: al navegar se cierra.
  const isOpen = openFor === location.key;
  const setIsOpen = (open) => setOpenFor(open ? location.key : null);

  const handle = (business?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const isAdmin = user?.role === 'admin';

  const link = 'inline-flex items-center gap-1.5 min-h-11 px-3 rounded-full text-gray-100 hover:text-cyan font-semibold text-sm transition-colors';
  const icon = 'w-11 h-11 inline-flex items-center justify-center rounded-full text-gray-200 hover:text-cyan hover:bg-cyan-dim transition-colors';
  const cta = 'inline-flex items-center justify-center min-h-11 bg-cyan text-black font-bebas px-6 rounded-full hover:bg-white transition-colors text-lg tracking-widest';

  const ig = (
    <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer" className={icon} aria-label="Instagram de Pato Barber (se abre en una pestaña nueva)">
      <Instagram size={20} aria-hidden="true" />
    </a>
  );
  const account = user ? (
    <Link to="/mi-cuenta" className={icon} aria-label="Mi cuenta"><UserRound size={20} aria-hidden="true" /></Link>
  ) : (
    <Link to="/login" className={icon} aria-label="Ingresar"><UserRound size={20} aria-hidden="true" /></Link>
  );

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-3">
      <nav aria-label="Principal" className="max-w-7xl mx-auto rounded-full bg-dark-surface/90 backdrop-blur-md border border-dark-border shadow-[0_8px_30px_rgba(0,0,0,0.25)] pl-3 pr-2">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 text-cyan font-bebas text-2xl tracking-widest">
            <Logo className="w-10 h-10" /> PATO BARBER
          </Link>

          {/* Escritorio */}
          <div className="hidden md:flex items-center gap-1">
            <a href="/#servicios" className={link}>Servicios</a>
            <a href="/#ubicacion" className={link}>Ubicación</a>
            {user && !isAdmin && <Link to="/mis-turnos" className={link}>Mis turnos</Link>}
            {isAdmin && <Link to="/admin" className={link}><LayoutDashboard size={15} aria-hidden="true" /> Panel</Link>}
          </div>
          <div className="hidden md:flex items-center gap-1">
            {ig}
            <ThemeToggle className="rounded-full w-11 h-11 hover:bg-cyan-dim" />
            {account}
            <Link to="/reservar" className={`${cta} ml-1`}>RESERVAR</Link>
          </div>

          {/* Celular */}
          <div className="md:hidden flex items-center gap-0.5">
            {ig}
            <ThemeToggle className="rounded-full w-11 h-11" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={icon}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              aria-controls="menu-movil"
            >
              {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div id="menu-movil" className="md:hidden border-t border-dark-border py-3 flex flex-col px-2">
            <a href="/#servicios" className={`${link} py-3`}>Servicios</a>
            <a href="/#ubicacion" className={`${link} py-3`}>Ubicación</a>
            {user && !isAdmin && <Link to="/mis-turnos" className={`${link} py-3`}>Mis turnos</Link>}
            {isAdmin && <Link to="/admin" className={`${link} py-3`}>Panel de administrador</Link>}
            <Link to={user ? '/mi-cuenta' : '/login'} className={`${link} py-3`}>{user ? 'Mi cuenta' : 'Ingresar'}</Link>
            <Link to="/reservar" className={`${cta} mt-2 mb-1 min-h-12`}>RESERVAR TURNO</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
