# Pato Barber — Sistema de turnos para peluquería

Web de turnos con panel de administración (MERN: React + Vite + Tailwind, Node + Express + MongoDB).

## Qué hace

**Cliente**
- Se registra (nombre, apellido, email, teléfono) o ingresa con Google.
- Ve la agenda del peluquero por **día, semana y mes**: 🟢 verde = libre, 🔴 rojo = ocupado, gris = no disponible.
- Reserva eligiendo servicio → horario → método de pago. Ve y cancela sus turnos en *Mis turnos*.
- Dos personas no pueden tomar el mismo horario (lo impide la base de datos, no solo la pantalla).

**Administrador** (`/admin`)
- **Resumen**: clientes y dinero por día, semana y mes; gráfico de 30 días; medios de pago y servicios más pedidos.
- **Agenda**: misma grilla día/semana/mes con el nombre de cada cliente + lista de clientes del período. Marcar completado / cancelar, ajustar precio, cargar turnos a mano (clientes sin cuenta).
- **Clientes**: todas las personas registradas con nombre y apellido, contacto, fecha de registro, último ingreso, turnos y gasto. Se pueden bloquear.
- **Servicios**: alta, edición y baja (nombre, precio, duración).
- **Configuración**: datos del local, horario de cada día de la semana, duración de franjas, anticipación máxima, métodos de pago y días cerrados / horarios especiales.

> "Ganado" = turnos marcados como *completados*. "Estimado" = todos los turnos no cancelados.

## Diseño y accesibilidad

- **Modo claro y oscuro**: selector en la barra superior (ícono sol/luna). Respeta la preferencia del sistema y recuerda la elección. Los colores salen de variables en `client/src/index.css`.
- Responsive de celular a escritorio; el panel de administrador usa barra inferior en el celular.
- Verificado con axe (WCAG 2.1 AA) en ambos temas: foco visible, contraste, etiquetas, teclado y lectores de pantalla.

## Seguridad y GitHub

- La sesión va en una **cookie HttpOnly** con protección CSRF; los teléfonos y notas se guardan **cifrados** en la base.
- El `.env` del backend se sube **cifrado** (dotenvx); la clave privada `.env.keys` **nunca** se sube.
- Antes de cada push al repo del backend: `npm run secrets:check`.
- Detalle completo, checklist de publicación y qué hacer si algo se filtra: [`SECURITY.md`](../PeluqueriaPatoBarber-Backend/SECURITY.md).
- Se recomiendan **dos repositorios** en GitHub: `PeluqueriaPatoBarber` (front) y `PeluqueriaPatoBarber-Backend` (API).

## Cómo correrlo

```bash
# 1) Backend (carpeta hermana)
cd ../PeluqueriaPatoBarber-Backend
npm install
# editá .env (ver .env.example)
npm run dev          # http://localhost:5000

# 2) Frontend
cd client
npm install
npm run dev          # http://localhost:5173
```

O desde esta carpeta, con ambos a la vez: `npm install && npm run dev`.

- **Base de datos**: usa `MONGODB_URI` del `.env`. Si no hay MongoDB corriendo, en desarrollo levanta uno embebido que guarda los datos en `PeluqueriaPatoBarber-Backend/.data` (nunca en producción).
- **Cuenta del barbero**: se crea sola al primer arranque con `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env`. Cambiá esa contraseña antes de publicar.

## Ingreso con Google

1. En [Google Cloud Console](https://console.cloud.google.com/apis/credentials) creá un *ID de cliente OAuth* de tipo **Aplicación web**.
2. En *Orígenes autorizados de JavaScript* agregá `http://localhost:5173` (y tu dominio cuando publiques).
3. Copiá el ID en `GOOGLE_CLIENT_ID` (backend `.env`) y en `VITE_GOOGLE_CLIENT_ID` (`client/.env`).

Sin esos valores el botón de Google queda deshabilitado y el resto funciona igual.

## Estructura

- `client/` — React. `src/components/agenda/AgendaCalendar.jsx` es la agenda día/semana/mes (la usan cliente y admin).
- `../PeluqueriaPatoBarber-Backend/` — API. `src/services/schedule.js` calcula la disponibilidad y crea turnos; `src/routes/` tiene auth, público, turnos y admin.

Zona horaria fija: Argentina (UTC-3).
