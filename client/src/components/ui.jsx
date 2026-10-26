import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { STATUS_LABEL } from '../lib/dates';

export const inputCls =
  'w-full min-h-12 bg-dark-bg border border-white/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-muted/80 hover:border-white/35 focus:border-cyan disabled:opacity-50';

export const Spinner = ({ className = '' }) => (
  <div
    className={`w-8 h-8 border-2 border-white/15 border-t-cyan rounded-full animate-spin ${className}`}
    aria-hidden="true"
  />
);

export const Loading = ({ label = 'Cargando…' }) => (
  <div className="flex flex-col items-center gap-3 py-16" role="status">
    <Spinner />
    <span className="sr-only">{label}</span>
  </div>
);

const VARIANTS = {
  primary: 'bg-cyan text-black hover:bg-white',
  ghost: 'border border-white/20 text-gray-100 hover:border-cyan hover:text-cyan',
  danger: 'bg-busy text-black hover:bg-white',
  success: 'bg-free text-black hover:bg-white',
};

export function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 min-h-12 font-bebas tracking-widest px-6 py-2 rounded-xl text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-gray-300 font-semibold text-sm mb-2">{label}</span>
      {children}
      {hint && <span className="block text-muted text-sm mt-1.5">{hint}</span>}
    </label>
  );
}

export const Card = ({ className = '', children }) => (
  <div className={`bg-dark-surface border border-dark-border rounded-2xl ${className}`}>{children}</div>
);

export const Eyebrow = ({ children }) => (
  <span className="text-cyan font-mono text-sm tracking-[0.25em] uppercase block mb-2">// {children}</span>
);

export const PageTitle = ({ eyebrow, title, children, actions }) => (
  <header className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
    <div className="min-w-0">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bebas tracking-wider leading-none">{title}</h1>
      {children && <p className="text-gray-300 text-base mt-2 max-w-2xl">{children}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
  </header>
);

export const Alert = ({ type = 'error', children }) =>
  children ? (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`text-sm rounded-sm px-3 py-2.5 border ${
        type === 'error' ? 'border-busy/50 bg-busy/10 text-rose-200' : 'border-free/50 bg-free/10 text-emerald-200'
      }`}
    >
      {children}
    </div>
  ) : null;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children, wide = false }) {
  const titleId = useId();
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foco inicial: primer campo del formulario, o el panel si no hay.
    const first = panel.current?.querySelector('input, select, textarea') || panel.current?.querySelector(FOCUSABLE);
    (first || panel.current)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      // Mantiene el Tab dentro del diálogo.
      const items = [...panel.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const [a, z] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === a) (e.preventDefault(), z.focus());
      else if (!e.shiftKey && document.activeElement === z) (e.preventDefault(), a.focus());
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative bg-dark-surface border border-dark-border rounded-t-2xl sm:rounded-md w-full ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md'
        } max-h-[92dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)] shadow-2xl`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border sticky top-0 bg-dark-surface z-10">
          <h2 id={titleId} className="text-2xl sm:text-3xl font-bebas tracking-wider">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-muted hover:text-white" aria-label="Cerrar">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const STATUS_STYLE = {
  // Fondo sólido: la etiqueta se lee igual aunque esté sobre un bloque de color.
  pending: 'bg-dark-surface text-amber-200 border-amber-400/60',
  confirmed: 'bg-dark-surface text-cyan border-cyan/50',
  completed: 'bg-dark-surface text-emerald-200 border-free/60',
  cancelled: 'bg-dark-surface text-rose-200 border-busy/60',
};

export const StatusBadge = ({ status }) => (
  <span className={`font-mono text-xs tracking-widest uppercase px-2 py-0.5 rounded-sm border whitespace-nowrap ${STATUS_STYLE[status]}`}>
    {STATUS_LABEL[status] || status}
  </span>
);
