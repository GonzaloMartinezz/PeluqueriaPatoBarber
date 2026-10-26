import { useEffect, useState } from 'react';
import api from './api';

// Servicios que el administrador tiene activos. Se piden una sola vez por visita.
let cache;
export default function useServices() {
  const [services, setServices] = useState(cache || null);

  useEffect(() => {
    if (cache) return;
    api
      .get('/services')
      .then(({ data }) => {
        cache = data.services;
        setServices(cache);
      })
      .catch(() => {});
  }, []);

  return services;
}
