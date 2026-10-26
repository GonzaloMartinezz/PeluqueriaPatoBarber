import { Link } from 'react-router-dom';
import LegalLayout, { H2, P, UL, Value } from './LegalLayout';
import { useLegal } from '../../lib/legal';

export default function Privacy() {
  const l = useLegal();

  return (
    <LegalLayout
      title="Política de privacidad"
      intro={`En ${l.brand} cuidamos tus datos personales. Acá te explicamos, en palabras simples, qué guardamos, para qué, por cuánto tiempo y cómo ejercer tus derechos, conforme a la Ley 25.326 de Protección de los Datos Personales de la República Argentina.`}
    >
      <H2>1. Quién es el responsable</H2>
      <P>
        El responsable del tratamiento de tus datos es <Value v={l.ownerName} what="nombre o razón social del titular" />, CUIT/CUIL{' '}
        <Value v={l.cuit} what="CUIT" />, con domicilio en <Value v={l.address} what="domicilio legal" />, que presta el servicio bajo el nombre comercial {l.brand}.
        Podés escribirnos a <Value v={l.email} what="email de contacto" /> para cualquier consulta sobre tus datos.
      </P>

      <H2>2. Qué datos recopilamos</H2>
      <UL>
        <li><strong>Datos de tu cuenta:</strong> nombre, apellido, email y teléfono. Si ingresás con Google, recibimos de Google tu nombre, apellido, email y foto de perfil.</li>
        <li><strong>Contraseña:</strong> si te registrás con email, la guardamos únicamente en forma de código irreversible (hash). Nadie, ni nosotros, puede leerla.</li>
        <li><strong>Datos de tus turnos:</strong> fecha, horario, servicio, precio, método de pago elegido, estado del turno y los comentarios que escribas. <em>Te pedimos no escribir en los comentarios datos de salud ni otros datos sensibles.</em></li>
        <li><strong>Datos técnicos mínimos:</strong> la dirección IP y la fecha de cada conexión se registran en los servidores por razones de seguridad (por ejemplo, detectar intentos de acceso indebido).</li>
      </UL>
      <P>No pedimos ni guardamos datos de tarjetas: los pagos se hacen en el local.</P>

      <H2>3. Para qué los usamos</H2>
      <UL>
        <li>Crear y mantener tu cuenta.</li>
        <li>Gestionar tus turnos y avisarte de cualquier cambio.</li>
        <li>Enviarte, si lo pedís, el enlace para recuperar tu contraseña.</li>
        <li>Proteger el sitio y prevenir fraudes o abusos.</li>
        <li>Cumplir obligaciones legales, contables e impositivas.</li>
      </UL>
      <P><strong>No usamos tus datos para publicidad, no los vendemos y no armamos perfiles de comportamiento.</strong></P>

      <H2>4. Con qué fundamento</H2>
      <P>
        Tratamos tus datos con tu consentimiento libre, expreso e informado, que das al crear tu cuenta aceptando esta política, y porque son necesarios para prestarte el servicio de reserva de turnos que solicitás.
        Podés retirar tu consentimiento en cualquier momento eliminando tu cuenta (ver punto 8).
      </P>

      <H2>5. Con quién los compartimos</H2>
      <P>No cedemos tus datos a terceros para sus propios fines. Sí usamos proveedores que los procesan por cuenta nuestra, solo para que el servicio funcione:</P>
      <UL>
        <li><strong>Servicio de base de datos y alojamiento</strong> (MongoDB Atlas y el proveedor donde está alojado el sitio). Tus datos se guardan en la nube; los servidores pueden estar fuera de la Argentina (por ejemplo, en Estados Unidos o la Unión Europea).</li>
        <li><strong>Google</strong>, únicamente si elegís &ldquo;Continuar con Google&rdquo; o si cargás el mapa del local, e <strong>Instagram (Meta)</strong>, únicamente si reproducís un reel de la portada (ver <Link to="/cookies" className="text-cyan underline underline-offset-4">Cookies</Link>).</li>
        <li><strong>Servicio de envío de emails</strong>, solo para enviarte el enlace de recuperación de contraseña.</li>
      </UL>
      <P>
        Al aceptar esta política autorizás esa transferencia internacional, que se realiza a proveedores que aplican medidas de seguridad adecuadas.
        También podemos brindar información si una autoridad competente lo requiere conforme a la ley.
      </P>

      <H2>6. Cuánto tiempo los conservamos</H2>
      <UL>
        <li>Tu cuenta y tus datos, mientras la cuenta esté activa.</li>
        <li>Si eliminás tu cuenta, borramos tus datos personales. Los turnos pasados se conservan <strong>sin ningún dato que te identifique</strong> (sin nombre, teléfono ni comentarios), solo con fecha, servicio e importe, porque forman parte de los registros contables del negocio.</li>
        <li>Las copias de seguridad cifradas pueden conservar tus datos por un tiempo limitado hasta que se renuevan.</li>
      </UL>

      <H2>7. Cómo los protegemos</H2>
      <UL>
        <li>La conexión viaja cifrada (HTTPS) y la sesión se guarda en una cookie protegida que el navegador no deja leer a ningún script.</li>
        <li>Las contraseñas se guardan con hash; el teléfono y los comentarios de los turnos se guardan cifrados en la base de datos.</li>
        <li>El acceso al panel de administración es solo para el titular, con contraseña y sesiones que se pueden cerrar en todos los dispositivos.</li>
        <li>Hacemos copias de seguridad cifradas y limitamos los intentos de ingreso para evitar accesos indebidos.</li>
      </UL>
      <P>Ningún sistema es 100% infalible, pero aplicamos medidas técnicas y organizativas razonables para evitar la pérdida, el acceso no autorizado o la alteración de tus datos.</P>

      <H2>8. Tus derechos</H2>
      <P>Tenés derecho a <strong>acceder</strong>, <strong>rectificar</strong>, <strong>actualizar</strong> y <strong>suprimir</strong> tus datos personales, de forma gratuita. Podés hacerlo vos mismo/a desde <Link to="/mi-cuenta" className="text-cyan underline underline-offset-4">Mi cuenta</Link>:</P>
      <UL>
        <li><strong>Acceso:</strong> descargá un archivo con todos tus datos y tus turnos.</li>
        <li><strong>Rectificación y actualización:</strong> corregí tu nombre, apellido y teléfono.</li>
        <li><strong>Supresión:</strong> eliminá tu cuenta y tus datos personales.</li>
      </UL>
      <P>
        También podés pedirlo por email a <Value v={l.email} what="email de contacto" />. Respondemos los pedidos de acceso dentro de los 10 días corridos y los de rectificación o supresión dentro de los 5 días hábiles, como establece la ley.
        El derecho de acceso puede ejercerse en forma gratuita a intervalos no inferiores a seis meses, salvo que acredites un interés legítimo.
      </P>
      <P>
        <strong>LA AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.</strong>{' '}
        Más información en{' '}
        <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noreferrer" className="text-cyan underline underline-offset-4">argentina.gob.ar/aaip<span className="sr-only"> (se abre en una pestaña nueva)</span></a>.
      </P>

      <H2>9. Menores de edad</H2>
      <P>El servicio está dirigido a personas mayores de 18 años. Si el turno es para una persona menor, debe reservarlo y gestionar la cuenta su madre, padre o tutor, que declara contar con la autorización correspondiente. Si detectamos datos de un menor cargados sin esa autorización, los eliminaremos.</P>

      <H2>10. Cookies</H2>
      <P>Usamos una única cookie, necesaria para mantener tu sesión iniciada, y no usamos cookies de publicidad ni de seguimiento. El detalle está en la <Link to="/cookies" className="text-cyan underline underline-offset-4">Política de cookies</Link>.</P>

      <H2>11. Cambios en esta política</H2>
      <P>Si modificamos esta política, publicaremos la nueva versión con su fecha. Si los cambios son importantes, te vamos a pedir que la aceptes nuevamente.</P>
    </LegalLayout>
  );
}
