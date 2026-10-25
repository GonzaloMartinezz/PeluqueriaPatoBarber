import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Tipografías propias (se sirven desde este mismo sitio: no se comparte la IP de nadie con Google Fonts).
import '@fontsource/bebas-neue/400.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/800.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
