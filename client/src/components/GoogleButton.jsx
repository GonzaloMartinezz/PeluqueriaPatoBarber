import { useEffect, useRef, useState } from 'react';
import { errMsg } from '../lib/api';
import useAuth from '../store/auth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise;
const loadGoogle = () => {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('No se pudo cargar Google'));
    document.head.appendChild(s);
  });
  return scriptPromise;
};

// Botón oficial "Continuar con Google" (Google Identity Services).
export default function GoogleButton({ onSuccess, onError }) {
  const ref = useRef(null);
  const google = useAuth((s) => s.google);
  const [failed, setFailed] = useState(false);
  // Los callbacks del padre cambian en cada render: se leen desde un ref para no reiniciar el botón.
  const handlers = useRef({});
  useEffect(() => {
    handlers.current = { onSuccess, onError };
  });

  useEffect(() => {
    if (!CLIENT_ID) return;
    let active = true;
    loadGoogle()
      .then(() => {
        if (!active || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }) => {
            try {
              handlers.current.onSuccess?.(await google(credential));
            } catch (e) {
              handlers.current.onError?.(errMsg(e));
            }
          },
        });
        window.google.accounts.id.renderButton(ref.current, {
          theme: 'filled_black',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
        });
      })
      .catch(() => setFailed(true));
    return () => {
      active = false;
    };
  }, [google]);

  if (!CLIENT_ID) {
    // En producción no se muestra un botón que no funciona.
    if (!import.meta.env.DEV) return null;
    return (
      <div className="text-center text-xs text-muted border border-dashed border-dark-border rounded-sm p-3">
        Google deshabilitado: falta <code className="text-cyan">VITE_GOOGLE_CLIENT_ID</code> en <code>client/.env</code>
      </div>
    );
  }
  if (failed) return <p className="text-xs text-muted text-center">No se pudo cargar el ingreso con Google.</p>;
  return <div ref={ref} className="flex justify-center min-h-[44px]" />;
}
