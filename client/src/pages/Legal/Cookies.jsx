import { Link } from 'react-router-dom';
import LegalLayout, { H2, P, UL } from './LegalLayout';

const ROWS = [
  ['pb_session', 'Cookie propia', 'Mantiene tu sesión iniciada. El navegador la protege (HttpOnly) y ningún script puede leerla.', 'Hasta 7 días o hasta que cierres sesión', 'Necesaria'],
  ['pb_theme', 'Almacenamiento local', 'Recuerda si preferís el modo claro u oscuro.', 'Hasta que la borres', 'Preferencia'],
  ['pb_hint', 'Almacenamiento local', 'Recuerda que ya habías iniciado sesión para no consultar al servidor de más. No contiene datos personales.', 'Hasta que cierres sesión', 'Necesaria'],
  ['pb_notice', 'Almacenamiento local', 'Recuerda que ya leíste el aviso de cookies.', 'Hasta que la borres', 'Preferencia'],
];

export default function Cookies() {
  return (
    <LegalLayout
      title="Política de cookies"
      intro="Usamos muy pocas cookies y todas son para que el sitio funcione. No usamos cookies de publicidad ni de seguimiento."
    >
      <H2>1. Qué guardamos en tu navegador</H2>
      <div className="overflow-x-auto rounded-2xl border border-dark-border mb-6" tabIndex={0} role="region" aria-label="Tabla de cookies y almacenamiento">
        <table className="w-full text-left text-[15px]">
          <caption className="sr-only">Cookies y almacenamiento local que usa el sitio</caption>
          <thead className="bg-dark-surface2/60 text-gray-300">
            <tr>{['Nombre', 'Tipo', 'Para qué sirve', 'Duración', 'Categoría'].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody>
            {ROWS.map(([name, type, why, days, cat]) => (
              <tr key={name} className="border-t border-dark-border align-top">
                <th scope="row" className="px-4 py-3 font-mono text-cyan whitespace-nowrap">{name}</th>
                <td className="px-4 py-3 text-gray-200">{type}</td>
                <td className="px-4 py-3 text-gray-200 min-w-[16rem]">{why}</td>
                <td className="px-4 py-3 text-gray-200">{days}</td>
                <td className="px-4 py-3 text-gray-200 whitespace-nowrap">{cat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Las cookies &ldquo;necesarias&rdquo; permiten iniciar sesión y reservar; sin ellas el sitio no puede funcionar, por eso no se pide permiso para usarlas. Las &ldquo;de preferencia&rdquo; solo guardan una elección tuya en tu propio dispositivo.
      </P>

      <H2>2. Servicios de terceros</H2>
      <UL>
        <li><strong>Google (inicio de sesión):</strong> solo se carga en las pantallas de ingreso y registro, y únicamente si Google está habilitado en el sitio. Si usás &ldquo;Continuar con Google&rdquo;, Google puede usar sus propias cookies según su <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-cyan underline underline-offset-4">política de privacidad<span className="sr-only"> (se abre en una pestaña nueva)</span></a>.</li>
        <li><strong>Instagram (Meta):</strong> los reels de la portada son enlaces: <strong>no se carga nada de Instagram hasta que tocás uno</strong>. Recién ahí salís del sitio y Instagram recibe tu visita y puede usar sus propias cookies.</li>
        <li><strong>Google Maps:</strong> el mapa del local se carga desde Google cuando llegás a la sección &ldquo;Ubicación y horarios&rdquo;, por lo que Google recibe tu visita en ese momento.</li>
        <li>Las tipografías y las imágenes del sitio se sirven desde el propio sitio: no se comparten datos con terceros para mostrarlas.</li>
      </UL>

      <H2>3. Cómo controlarlas</H2>
      <P>Podés ver, bloquear o borrar cookies y datos del sitio desde la configuración de tu navegador. Si borrás <code className="font-mono text-cyan">pb_session</code>, se cierra tu sesión y tenés que volver a ingresar. También podés cerrar sesión en todos tus dispositivos desde <Link to="/mi-cuenta" className="text-cyan underline underline-offset-4">Mi cuenta</Link>.</P>

      <H2>4. Más información</H2>
      <P>Para saber cómo tratamos tus datos personales, leé la <Link to="/privacidad" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>.</P>
    </LegalLayout>
  );
}
