import axios from 'axios';

// La sesión vive en una cookie HttpOnly que el navegador manda solo (withCredentials).
// JavaScript nunca ve ni guarda la sesión; acá solo se guarda en memoria el token anti-CSRF.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

let csrfToken = '';
export const setCsrfToken = (token) => {
  csrfToken = token || '';
};

api.interceptors.request.use((config) => {
  if (csrfToken && config.method !== 'get') config.headers['X-CSRF-Token'] = csrfToken;
  return config;
});

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Sesión vencida (no aplica a los errores de login / registro / chequeo inicial).
    const url = error.config?.url || '';
    const isAuthCall = url.startsWith('/auth/') && !url.startsWith('/auth/logout');
    if (error.response?.status === 401 && !isAuthCall) onUnauthorized();
    return Promise.reject(error);
  }
);

export const errMsg = (e) => e?.response?.data?.message || 'No se pudo conectar con el servidor';

export default api;
