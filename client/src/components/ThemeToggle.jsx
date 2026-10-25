import { Moon, Sun } from 'lucide-react';
import useTheme from '../store/theme';

// Selector de tema. El ícono muestra a qué tema se cambia; el nombre accesible lo dice con palabras.
export default function ThemeToggle({ className = '', withLabel = false, onSky = false }) {
  const { theme, toggle } = useTheme();
  const toLight = theme === 'dark';
  const Icon = toLight ? Sun : Moon;
  const label = toLight ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center gap-2 min-w-11 min-h-11 transition-colors ${
        onSky ? 'rounded-full text-[color:var(--on-sky)] hover:bg-[rgba(255,255,255,0.5)]' : 'text-gray-300 hover:text-cyan'
      } ${className}`}
    >
      <Icon size={18} aria-hidden="true" />
      {withLabel && <span className="font-mono text-xs tracking-widest">{toLight ? 'MODO CLARO' : 'MODO OSCURO'}</span>}
    </button>
  );
}
