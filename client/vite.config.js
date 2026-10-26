import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Política de contenido (CSP) para producción: el navegador solo ejecuta scripts propios y de Google
// (inicio de sesión), y solo habla con la propia API. Frena la mayoría de los XSS aunque se cuele uno.
// En desarrollo no se aplica: Vite necesita scripts en línea para el recarga en caliente.
const csp = (apiOrigin) =>
  [
    "default-src 'self'",
    "script-src 'self' https://accounts.google.com/gsi/client",
    "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
    "font-src 'self'",
    "img-src 'self' data: https://*.googleusercontent.com",
    "frame-src https://accounts.google.com https://www.google.com https://www.instagram.com",
    `connect-src 'self' https://accounts.google.com ${apiOrigin}`.trim(),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let apiOrigin = ''
  try {
    apiOrigin = env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : ''
  } catch {
    /* VITE_API_URL relativa: la API está en el mismo origen */
  }

  return {
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    plugins: [
      react(),
      {
        name: 'inject-csp',
        apply: 'build',
        transformIndexHtml: (html) =>
          html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp(apiOrigin)}" />`),
      },
    ],
    server: {
      // El front llama a /api y Vite lo reenvía al backend (mismo origen: las cookies funcionan sin CORS).
      proxy: {
        '/api': process.env.API_PROXY || 'http://localhost:5000',
      },
    },
  }
})
