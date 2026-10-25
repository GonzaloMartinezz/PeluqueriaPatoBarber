import { useEffect, useState } from 'react';
import api from './api';

// Datos del negocio (dirección, horarios, contacto). Se piden una sola vez por visita.
let cache;
export default function useBusiness() {
  const [config, setConfig] = useState(cache || null);

  useEffect(() => {
    if (cache) return;
    api
      .get('/config')
      .then(({ data }) => {
        cache = data.config;
        setConfig(cache);
      })
      .catch(() => {});
  }, []);

  return config;
}

export const DAY_LABELS = [
  ['monday', 'Lunes'],
  ['tuesday', 'Martes'],
  ['wednesday', 'Miércoles'],
  ['thursday', 'Jueves'],
  ['friday', 'Viernes'],
  ['saturday', 'Sábado'],
  ['sunday', 'Domingo'],
];

const JS_DAY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const todayKey = () => JS_DAY[new Date().getDay()];

// Línea de estado de hoy para el encabezado: "Abierto hoy hasta 20:00 hs" / "Cerrado por hoy"…
export function todayLine(config) {
  const t = config?.today;
  if (!t) return null;
  if (t.status === 'open') return { open: true, text: `Abierto hoy hasta ${t.close} hs` };
  if (t.status === 'later') return { open: false, text: `Hoy abrimos a las ${t.open} hs` };
  if (t.status === 'ended') return { open: false, text: 'Cerrado por hoy' };
  return { open: false, text: t.reason && t.reason !== 'Cerrado' ? `Hoy cerrado · ${t.reason}` : 'Hoy no abrimos' };
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  return h < 12 ? 'Buen día' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
}
