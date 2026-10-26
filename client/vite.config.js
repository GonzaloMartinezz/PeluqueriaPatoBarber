import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

// Política de contenido (CSP) para producción: el navegador solo ejecuta scripts propios y de Google
// (inicio de sesión), y solo habla con la propia API. Frena la mayoría de los XSS aunque se cuele uno.
// En desarrollo no se aplica: Vite necesita scripts en línea para el recarga en caliente.
const csp = (apiOrigin, themeHash) =>
  [
    "default-src 'self'",
    `script-src 'self' 'sha256-${themeHash}' https://accounts.google.com/gsi/client`,
    "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
    "font-src 'self'",
    "img-src 'self' data: https://*.googleusercontent.com",
    "frame-src https://accounts.google.com https://www.google.com",
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
        transformIndexHtml: (html, ctx) => {
          // Las tipografías de la portada se piden desde el inicio (si no, el navegador las descubre recién al leer el CSS).
          const fonts = Object.keys(ctx.bundle || {}).filter((f) => /(dm-sans-latin-(400|800)|bebas-neue-latin-400)-normal.*\.woff2$/.test(f))
          const preloads = fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/${f}" crossorigin />`).join('\n    ')
          // El script que fija el tema se incluye en la página (evita un pedido que frena el pintado) y se autoriza por su hash.
          // Los saltos de línea de Windows (CRLF) se pasan a LF: así el hash coincide con lo que calcula el navegador.
          const theme = readFileSync('public/theme-init.js', 'utf8').replace(/\r\n/g, '\n')
          const hash = createHash('sha256').update(theme).digest('base64')
          return html
            .replace('<script src="/theme-init.js"></script>', `<script>${theme}</script>`)
            .replace('</head>', `    ${preloads}\n  </head>`)
            .replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp(apiOrigin, hash)}" />`)
        },
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
