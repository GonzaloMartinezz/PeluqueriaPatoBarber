import { useEffect, useRef } from 'react';

// Vuelve a cargar los datos cada tanto y al volver a la pestaña, así el panel siempre está al día
// (turnos nuevos, clientes que se registraron, cambios hechos desde otro dispositivo).
export default function useAutoRefresh(load, ms = 30000) {
  const fn = useRef(load);
  useEffect(() => {
    fn.current = load;
  });

  useEffect(() => {
    const run = () => {
      if (document.visibilityState === 'visible') fn.current();
    };
    const timer = setInterval(run, ms);
    document.addEventListener('visibilitychange', run);
    window.addEventListener('focus', run);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', run);
      window.removeEventListener('focus', run);
    };
  }, [ms]);
}
