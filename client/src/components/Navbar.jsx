import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import useAuth from '../store/auth';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar = () => {
  const [openFor, setOpenFor] = useState(null);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  // El menú móvil queda abierto solo para la página donde se abrió: al navegar se cierra.
  const isOpen = openFor === location.key;
  const setIsOpen = (open) => setOpenFor(open ? location.key : null);

  const exit = async () => {
    await logout();
    navigate('/');
  };

  const link = 'inline-flex items-center gap-1.5 min-h-11 text-gray-200 hover:text-cyan font-mono text-xs tracking-widest transition-colors';
  const cta = 'inline-flex items-center justify-center min-h-11 bg-cyan text-black font-bebas px-6 rounded-sm hover:bg-white transition-colors text-base tracking-widest';

  return (
    <header className="sticky top-0 z-50 bg-dark-surface/90 backdrop-blur-md border-b border-dark-border">
      <nav aria-label="Principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2.5 text-cyan font-bebas text-2xl tracking-widest">
            <Logo className="w-10 h-10" /> PATO BARBER
          </Link>

          {/* Escritorio */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="/#servicios" className={link}>SERVICIOS</a>
            <a href="/#instagram" className={link}>INSTAGRAM</a>
            <a href="/#colaborar" className={link}>COLABORÁ</a>
            <a href="/#ubicacion" className={link}>UBICACIÓN</a>
            {user && <Link to="/mis-turnos" className={link}>MIS TURNOS</Link>}
            {user && <Link to="/mi-cuenta" className={link}>MI CUENTA</Link>}
            {user?.role === 'admin' && (
              <Link to="/admin" className={link}>
                <LayoutDashboard size={14} aria-hidden="true" /> PANEL
              </Link>
            )}
            <Link to="/reservar" className={cta}>RESERVAR</Link>
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-200 text-sm">{user.name}</span>
                <button onClick={exit} className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-white" aria-label="Cerrar sesión">
                  <LogOut size={18} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link to="/login" className={link}>INGRESAR</Link>
            )}
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 -mr-2 flex items-center justify-center text-gray-200 hover:text-white"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            aria-controls="menu-movil"
          >
            {isOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <div id="menu-movil" className="md:hidden border-t border-dark-border py-3 flex flex-col">
            <a href="/#servicios" className={`${link} py-3`}>SERVICIOS</a>
            <a href="/#ubicacion" className={`${link} py-3`}>UBICACIÓN</a>
            {user && <Link to="/mis-turnos" className={`${link} py-3`}>MIS TURNOS</Link>}
            {user && <Link to="/mi-cuenta" className={`${link} py-3`}>MI CUENTA</Link>}
            {user?.role === 'admin' && <Link to="/admin" className={`${link} py-3`}>PANEL DE ADMINISTRADOR</Link>}
            {user ? (
              <button onClick={exit} className={`${link} py-3`}>CERRAR SESIÓN ({user.name})</button>
            ) : (
              <Link to="/login" className={`${link} py-3`}>INGRESAR</Link>
            )}
            <ThemeToggle withLabel className="justify-start" />
            <Link to="/reservar" className={`${cta} mt-2 min-h-12`}>RESERVAR TURNO</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
