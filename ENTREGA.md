# Lista de entrega — Pato Barber

Estado medido sobre la versión de producción (Lighthouse + axe):

| | Celular (4G lenta simulada) | Escritorio |
|---|---|---|
| Rendimiento | 84 | 98 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 100 | 100 |
| SEO | 100 | 100 |

Accesibilidad revisada con axe (0 problemas) en modo claro y oscuro en: portada, ingreso, registro, recuperar contraseña, privacidad, reservar, mis turnos, mi cuenta y todo el panel de administración.

## Antes de dárselo al peluquero (lo que depende de tus cuentas)

**Vercel (front)**
- [ ] Root Directory = `client`.
- [ ] Variable `VITE_GOOGLE_CLIENT_ID` (si querés el botón de Google) y, en Google Cloud, agregar `https://peluqueria-pato-barber.vercel.app` en *Orígenes autorizados*.
- [ ] Subir los últimos cambios (`git push`) para que se vuelva a desplegar. `client/vercel.json` ya envía `/api` a Render.

**Render (API)**
- [ ] Variables: `NODE_ENV=production`, `CLIENT_URL=https://peluqueria-pato-barber.vercel.app`, `TRUST_PROXY=1`, `DOTENV_PRIVATE_KEY` (contenido de `.env.keys`).
- [ ] *Start Command* = `npm start`. Hacer *Manual Deploy* para que tome las rutas nuevas (reels, TikTok, reseñas).
- [ ] Email (SMTP) configurado para «Olvidé mi contraseña» (ver `DEPLOY.md` del backend).
- [ ] MongoDB Atlas → Network Access permite a Render.
- [ ] El plan gratuito de Render se duerme: la primera visita tarda hasta ~1 minuto. Para el uso diario conviene un plan pago o un «ping» cada 10 minutos.

**Panel de administración (lo carga el peluquero)**
- [ ] Configuración → Datos del negocio: dirección, teléfono, Instagram (`@patobarber.pc`), TikTok (`@patobarber5`), enlace de reseñas de Google y hasta 6 enlaces de reels.
- [ ] Configuración → Datos legales (titular, CUIT, domicilio, email) y horas mínimas para cancelar.
- [ ] Horarios de atención y métodos de pago.
- [ ] Servicios (corte $12.000, teñido ≈ $50.000) con su duración.
- [ ] Cambiar la contraseña del administrador y guardarla en un gestor de contraseñas.

**Revisión humana**
- [ ] Un abogado o contador revisa los textos legales (`LEGAL.md` del backend).
- [ ] Probar una reserva completa desde un celular real.
- [ ] Probar el ingreso con Google y con email.

## Mejoras opcionales (no bloquean la entrega)
- La foto de la fachada tiene 428×501 px; con la foto original del celular (más grande) se vería más nítida en pantallas retina.
- Un dominio propio (por ejemplo `patobarber.com.ar`): después hay que actualizar `index.html`, `robots.txt` y `sitemap.xml`.
- Copia de seguridad semanal: `npm run backup` en el backend.
