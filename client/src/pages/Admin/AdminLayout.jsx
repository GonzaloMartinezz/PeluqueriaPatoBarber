import { NavLink, Outlet, Link } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut, Scissors, Settings, Users } from 'lucide-react';
import useAuth from '../../store/auth';
import ThemeToggle from '../../components/ThemeToggle';

const ITEMS = [
  ['/admin', 'Resumen', LayoutDashboard, true],
  ['/admin/agenda', 'Agenda', CalendarDays],
  ['/admin/clientes', 'Clientes', Users],
  ['/admin/servicios', 'Servicios', Scissors],
  ['/admin/configuracion', 'Ajustes', Settings],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  // Escritorio: barra lateral. Celular: barra inferior con ícono + texto (al alcance del pulgar).
  const desktopLink = ({ isActive }) =>
    `flex items-center gap-3 px-4 min-h-11 rounded-sm font-bebas tracking-widest text-lg transition-colors ${
      isActive ? 'bg-cyan text-black' : 'text-gray-200 hover:bg-white/10'
    }`;
  const mobileLink = ({ isActive }) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 min-h-14 text-[11px] font-mono tracking-wide transition-colors ${
      isActive ? 'text-cyan' : 'text-gray-300'
    }`;

  return (
    <div className="min-h-dvh bg-dark-bg lg:flex">
      {/* Barra superior (celular) */}
      <header className="sky-header lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 rounded-b-2xl">
        <Link to="/" className="font-bebas text-2xl tracking-widest">PATO BARBER</Link>
        <div className="flex items-center">
          <ThemeToggle onSky />
          <button onClick={logout} className="flex items-center justify-center min-w-11 min-h-11 rounded-full hover:bg-[rgba(255,255,255,0.5)]" aria-label="Cerrar sesión">
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Barra lateral (escritorio) */}
      <aside className="hidden lg:flex lg:flex-col w-64 min-h-dvh bg-dark-surface border-r border-dark-border sticky top-0 h-dvh">
        <div className="sky-header p-5 rounded-br-3xl">
          <Link to="/" className="font-bebas text-3xl tracking-widest block">PATO BARBER</Link>
          <span className="font-mono text-xs font-bold tracking-widest">PANEL DE ADMINISTRADOR</span>
        </div>
        <nav aria-label="Panel de administrador" className="flex flex-col gap-1 p-3 flex-1">
          {ITEMS.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} className={desktopLink}>
              <Icon size={18} aria-hidden="true" /> {label === 'Ajustes' ? 'Configuración' : label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-dark-border text-sm">
          <p className="text-gray-200 truncate">{user.name} {user.lastName}</p>
          <ThemeToggle withLabel className="justify-start -ml-1" />
          <button onClick={logout} className="mt-2 flex items-center gap-2 min-h-11 text-gray-300 hover:text-white font-mono text-xs tracking-widest">
            <LogOut size={14} aria-hidden="true" /> CERRAR SESIÓN
          </button>
        </div>
      </aside>

      <main id="main" className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1400px]">
        <Outlet />
      </main>

      {/* Barra inferior (celular) */}
      <nav
        aria-label="Panel de administrador"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex bg-dark-surface/95 backdrop-blur border-t border-dark-border pb-[env(safe-area-inset-bottom)]"
      >
        {ITEMS.map(([to, label, Icon, end]) => (
          <NavLink key={to} to={to} end={end} className={mobileLink}>
            <Icon size={22} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
