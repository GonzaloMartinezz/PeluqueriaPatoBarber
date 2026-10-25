import { create } from 'zustand';
import api, { setCsrfToken, setUnauthorizedHandler } from '../lib/api';

// Bandera NO secreta: "esta persona había iniciado sesión". Sirve solo para no preguntarle
// al servidor por la sesión a cada visitante anónimo. La sesión real es la cookie HttpOnly.
const HINT_KEY = 'pb_hint';
const hint = {
  get: () => {
    try {
      return localStorage.getItem(HINT_KEY) === '1';
    } catch {
      return false;
    }
  },
  set: (on) => {
    try {
      if (on) localStorage.setItem(HINT_KEY, '1');
      else localStorage.removeItem(HINT_KEY);
    } catch {
      /* sin almacenamiento: se pregunta al servidor en cada carga */
    }
  },
};

const useAuth = create((set, get) => {
  const startSession = ({ user, csrfToken }) => {
    setCsrfToken(csrfToken);
    hint.set(true);
    set({ user });
    return user;
  };

  const clear = () => {
    setCsrfToken('');
    hint.set(false);
    set({ user: null });
  };

  return {
    user: null,
    ready: false, // false hasta saber si hay una sesión válida

    init: async () => {
      // Versiones anteriores guardaban el JWT en localStorage (legible por cualquier script): se descarta.
      try {
        localStorage.removeItem('pb_token');
      } catch {
        /* sin almacenamiento */
      }
      if (!hint.get()) return set({ ready: true });
      try {
        const { data } = await api.get('/auth/me');
        startSession(data);
        set({ ready: true });
      } catch (e) {
        // Solo una sesión realmente inválida se descarta; un corte de red no cierra la sesión.
        if ([401, 403].includes(e.response?.status)) clear();
        set({ user: null, ready: true });
      }
    },

    login: async (email, password) => startSession((await api.post('/auth/login', { email, password })).data),
    register: async (form) => startSession((await api.post('/auth/register', form)).data),
    google: async (credential) => startSession((await api.post('/auth/google', { credential })).data),
    updateProfile: async (patch) => {
      const { data } = await api.patch('/auth/me', patch);
      set({ user: data.user });
      return data.user;
    },

    logout: async () => {
      try {
        await api.post('/auth/logout'); // el servidor borra la cookie
      } catch {
        /* igual se limpia la sesión local */
      }
      clear();
    },
    isAdmin: () => get().user?.role === 'admin',
  };
});

// Si el servidor dice "sesión vencida", se limpia el estado local (la cookie ya no sirve).
setUnauthorizedHandler(() => {
  setCsrfToken('');
  hint.set(false);
  useAuth.setState({ user: null });
});

export default useAuth;
