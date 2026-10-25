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
