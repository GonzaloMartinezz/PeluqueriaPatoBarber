import { Link, NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, Home, MapPin, Scissors, UserRound } from 'lucide-react';
import Navbar from './Navbar';
import LegalLinks from './LegalLinks';

const tab = 'flex-1 flex flex-col items-center justify-center gap-0.5 min-h-16 text-xs font-semibold transition-colors';

// Estructura de las pantallas del cliente: barra superior en escritorio y
// navegación inferior (Inicio · Servicios · Mis turnos · Ubicación) en el celular.
export default function ClientShell({ children }) {
  const { pathname } = useLocation();
  const active = (on) => (on ? 'text-cyan' : 'text-gray-300 hover:text-white');

  return (
    <div className="min-h-dvh bg-dark-bg pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main id="main">{children}</main>
      <footer className="px-4 pb-8 pt-2">
        <LegalLinks className="justify-center" />
      </footer>

      <nav
        aria-label="Navegación principal"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-dark-surface/95 backdrop-blur border-t border-dark-border pb-[env(safe-area-inset-bottom)]"
      >
        <NavLink to="/reservar" end className={() => `${tab} ${active(pathname === '/reservar')}`}>
          <Home size={22} aria-hidden="true" /> Inicio
        </NavLink>
        <Link to="/reservar#servicios" className={`${tab} ${active(false)}`}>
          <Scissors size={22} aria-hidden="true" /> Servicios
        </Link>
        <NavLink to="/mis-turnos" className={() => `${tab} ${active(pathname === '/mis-turnos')}`}>
          <CalendarDays size={22} aria-hidden="true" /> Mis turnos
        </NavLink>
        <a href="/#ubicacion" className={`${tab} ${active(false)}`}>
          <MapPin size={22} aria-hidden="true" /> Ubicación
        </a>
        <NavLink to="/mi-cuenta" className={() => `${tab} ${active(pathname === '/mi-cuenta')}`}>
          <UserRound size={22} aria-hidden="true" /> Cuenta
        </NavLink>
      </nav>
    </div>
  );
}
