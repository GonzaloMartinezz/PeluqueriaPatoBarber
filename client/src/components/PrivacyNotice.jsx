import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const KEY = 'pb_notice';

const seen = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

// Aviso de cookies. La única cookie es la de sesión (necesaria), así que no hay nada para aceptar o
// rechazar: es un aviso informativo con un enlace a la política.
export default function PrivacyNotice() {
  const [open, setOpen] = useState(() => !seen());
  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      /* sin almacenamiento: el aviso vuelve a aparecer en la próxima visita */
    }
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed z-[70] inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-4 md:left-auto md:right-4 md:max-w-md rounded-3xl border-2 border-cyan/50 bg-dark-surface p-5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
    >
      <p className="flex items-start gap-3 text-[15px] text-gray-100 leading-relaxed">
        <Cookie size={22} aria-hidden="true" className="shrink-0 text-cyan mt-0.5" />
        <span>
          Usamos <strong>una sola cookie, necesaria para mantener tu sesión</strong>, y guardamos tu preferencia de tema. No usamos publicidad ni seguimiento.{' '}
          <Link to="/cookies" className="text-cyan underline underline-offset-4 font-semibold">Más información sobre cookies</Link>
        </span>
      </p>
      <button
        onClick={close}
        className="mt-4 w-full min-h-12 rounded-xl bg-cyan text-black font-bebas text-lg tracking-widest hover:bg-white transition-colors"
      >
        ENTENDIDO
      </button>
    </div>
  );
}
