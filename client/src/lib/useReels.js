import { useEffect, useState } from 'react';
import api from './api';

// Reels con su portada (la imagen la sirve nuestra API). Se piden una sola vez por visita.
let cache;
export default function useReels() {
  const [reels, setReels] = useState(cache || null);

  useEffect(() => {
    if (cache) return;
    api
      .get('/reels')
      .then(({ data }) => {
        cache = data.reels;
        setReels(cache);
      })
      .catch(() => setReels([]));
  }, []);

  return reels;
}
