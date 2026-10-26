import { NavLink, Outlet, Link } from 'react-router-dom';
import { CalendarDays, ExternalLink, LayoutDashboard, LogOut, Scissors, Settings, Users } from 'lucide-react';
import useAuth from '../../store/auth';
import ThemeToggle from '../../components/ThemeToggle';

const ITEMS = [
  ['/admin', 'Resumen', LayoutDashboard, true],
  ['/admin/agenda', 'Agenda', CalendarDays],
  ['/admin/clientes', 'Clientes', Users],
  ['/admin/servicios', 'Servicios', Scissors],
  ['/admin/configuracion', 'Configuración', Settings],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  // Escritorio: barra lateral amplia. Celular: barra inferior con ícono + texto (al alcance del pulgar).
  const desktopLink = ({ isActive }) =>
    `flex items-center gap-4 px-4 min-h-12 rounded-xl font-sans font-bold text-base transition-colors ${
      isActive ? 'bg-cyan text-black' : 'text-gray-200 hover:bg-cyan-dim hover:text-white'
    }`;
  const mobileLink = ({ isActive }) =>
    `flex-1 flex flex-col items-center justify-center gap-1 min-h-16 text-xs font-semibold transition-colors ${
      isActive ? 'text-cyan' : 'text-gray-300'
    }`;

  return (
    <div className="min-h-dvh bg-dark-bg lg:flex">
      {/* Barra superior (celular) */}
      <header className="sky-header lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 rounded-b-3xl">
        <Link to="/" className="font-bebas text-3xl tracking-widest">PATO BARBER</Link>
        <div className="flex items-center">
          <ThemeToggle onSky />
          <button onClick={logout} className="flex items-center justify-center min-w-11 min-h-11 rounded-full hover:bg-[rgba(255,255,255,0.5)]" aria-label="Cerrar sesión">
            <LogOut size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Barra lateral (escritorio) */}
      <aside className="hidden lg:flex lg:flex-col w-[15.5rem] shrink-0 min-h-dvh bg-dark-surface border-r border-dark-border sticky top-0 h-dvh">
        <div className="sky-header px-7 py-8 rounded-br-[2rem]">
          <Link to="/" className="font-bebas text-4xl tracking-widest block leading-none">PATO BARBER</Link>
          <span className="mt-2 block text-sm font-bold tracking-wide">Panel de administración</span>
        </div>
        <nav aria-label="Panel de administrador" className="flex flex-col gap-2 p-5 flex-1">
          {ITEMS.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} className={desktopLink}>
              <Icon size={22} aria-hidden="true" /> {label}
            </NavLink>
          ))}
          <a
            href="/reservar"
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center gap-3 px-5 min-h-12 rounded-2xl border border-dark-border text-gray-300 hover:text-white hover:border-cyan/60 text-[15px] font-semibold"
          >
            <ExternalLink size={18} aria-hidden="true" /> Ver como cliente
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </nav>
        <div className="p-5 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-3">
            <span aria-hidden="true" className="w-11 h-11 rounded-full bg-cyan text-black font-bebas text-2xl flex items-center justify-center">
              {user.name?.[0]}
            </span>
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{user.name} {user.lastName}</p>
              <p className="text-muted text-sm">Administrador</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle withLabel className="flex-1 justify-start rounded-xl px-3 hover:bg-cyan-dim" />
            <button onClick={logout} className="flex items-center gap-2 min-h-11 px-3 rounded-xl text-gray-300 hover:text-white hover:bg-cyan-dim text-sm font-semibold">
              <LogOut size={18} aria-hidden="true" /> Salir
            </button>
          </div>
        </div>
      </aside>

      <main id="main" className="flex-1 min-w-0 px-4 py-4 sm:px-6 sm:py-5 xl:px-8 xl:py-6 pb-28 lg:pb-8">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Barra inferior (celular) */}
      <nav
        aria-label="Panel de administrador"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex bg-dark-surface/95 backdrop-blur border-t border-dark-border pb-[env(safe-area-inset-bottom)]"
      >
        {ITEMS.map(([to, label, Icon, end]) => (
          <NavLink key={to} to={to} end={end} className={mobileLink}>
            <Icon size={24} aria-hidden="true" />
            {label === 'Configuración' ? 'Ajustes' : label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
