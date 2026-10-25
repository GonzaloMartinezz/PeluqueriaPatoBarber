import { create } from 'zustand';

const KEY = 'pb_theme';
const META_COLOR = { light: '#f4f6fa', dark: '#090a0e' };

// El tema inicial ya lo aplicó el script de index.html; acá solo se lee.
const current = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

const apply = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* modo privado: el tema vale solo para esta visita */
  }
};

const useTheme = create((set, get) => ({
  theme: current(),
  toggle: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    apply(next);
    set({ theme: next });
  },
}));

export default useTheme;
