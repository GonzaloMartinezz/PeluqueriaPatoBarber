import { Link } from 'react-router-dom';
import LegalLayout, { H2, P, UL, Value } from './LegalLayout';
import { useLegal } from '../../lib/legal';

export default function Terms() {
  const l = useLegal();
  const hours = l.cancellationHours;

  return (
    <LegalLayout
      title="Términos y condiciones"
      intro={`Estas condiciones regulan el uso del sitio de reservas de ${l.brand}. Al crear una cuenta o reservar un turno, aceptás estos términos y la Política de Privacidad.`}
    >
      <H2>1. Quiénes somos y qué ofrecemos</H2>
      <P>
        Este sitio es operado por <Value v={l.ownerName} what="nombre o razón social del titular" /> (CUIT/CUIL <Value v={l.cuit} what="CUIT" />), con domicilio en{' '}
        <Value v={l.address} what="domicilio legal" />, bajo el nombre comercial {l.brand}. Permite consultar la agenda de la peluquería y reservar turnos para sus servicios.
        Contacto: <Value v={l.email} what="email de contacto" />{l.phone ? <> · teléfono {l.phone}</> : null}.
      </P>

      <H2>2. Tu cuenta</H2>
      <UL>
        <li>Para reservar necesitás una cuenta con datos reales y actualizados.</li>
        <li>Sos responsable de guardar tu contraseña y de lo que se haga con tu cuenta. Si creés que alguien la usa sin permiso, cambiala o cerrá todas las sesiones desde <Link to="/mi-cuenta" className="text-cyan underline underline-offset-4">Mi cuenta</Link>.</li>
        <li>El servicio es para mayores de 18 años. Los menores deben ser representados por su madre, padre o tutor.</li>
      </UL>

      <H2>3. Reservas</H2>
      <UL>
        <li>La agenda se muestra en tiempo real: <strong>verde</strong> es un horario libre y <strong>rojo</strong> uno ocupado. La reserva queda confirmada en el momento en que la hacés.</li>
        <li>Cada servicio dura el tiempo indicado y bloquea ese tiempo en la agenda.</li>
        <li>Te pedimos llegar a horario. Si hay una demora importante, el local puede reacomodar el turno.</li>
        <li>Los horarios, servicios y precios pueden cambiar; vale lo publicado al momento de reservar.</li>
      </UL>

      <H2>4. Precios y pagos</H2>
      <P>Los precios están expresados en pesos argentinos y se abonan en el local, con el medio de pago que el local tenga habilitado. Este sitio solo registra el medio de pago que preferís: <strong>no procesa pagos ni guarda datos de tarjetas</strong>.</P>

      <H2>5. Cancelaciones y cambios</H2>
      <P>
        Podés cancelar tu turno sin costo desde <Link to="/mis-turnos" className="text-cyan underline underline-offset-4">Mis turnos</Link>{' '}
        {hours > 0 ? <>hasta <strong>{hours} {hours === 1 ? 'hora' : 'horas'} antes</strong> del horario reservado. Pasado ese plazo, comunicate directamente con el local{l.phone ? <> al {l.phone}</> : null}.</> : <>hasta el horario del turno.</>}{' '}
        Para cambiar un turno, cancelalo y reservá otro. Si faltás reiteradamente sin avisar, el local puede limitar tus reservas online.
      </P>

      <H2>6. Uso correcto del sitio</H2>
      <UL>
        <li>No se pueden hacer reservas falsas, masivas o con el fin de bloquear horarios.</li>
        <li>No se puede intentar acceder a cuentas ajenas, vulnerar la seguridad ni sobrecargar el sitio.</li>
        <li>El local puede suspender cuentas que incumplan estas reglas.</li>
      </UL>

      <H2>7. Propiedad intelectual</H2>
      <P>El nombre, la marca, el diseño y los contenidos del sitio pertenecen a su titular o se usan con licencia. No pueden copiarse ni reutilizarse sin autorización.</P>

      <H2>8. Disponibilidad y responsabilidad</H2>
      <P>
        Hacemos lo posible para que el sitio funcione de manera continua, pero puede haber interrupciones por mantenimiento o por causas ajenas a nosotros (por ejemplo, fallas de internet o de proveedores).
        Estas condiciones no limitan los derechos que la Ley 24.240 de Defensa del Consumidor te reconoce como consumidor/a.
      </P>

      <H2>9. Tus datos personales</H2>
      <P>Tratamos tus datos como explicamos en la <Link to="/privacidad" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>, donde también están tus derechos de acceso, rectificación y supresión.</P>

      <H2>10. Reclamos y defensa del consumidor</H2>
      <P>
        Si tenés algún reclamo, escribinos a <Value v={l.email} what="email de contacto" /> y lo respondemos a la brevedad. Como consumidor/a también podés presentar tu reclamo ante la autoridad de aplicación de Defensa del Consumidor de tu jurisdicción o por la{' '}
        <a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noreferrer" className="text-cyan underline underline-offset-4">Ventanilla Única Federal de Defensa del Consumidor<span className="sr-only"> (se abre en una pestaña nueva)</span></a>.
      </P>

      <H2>11. Cambios en estos términos</H2>
      <P>Podemos actualizar estos términos. Publicaremos la versión nueva con su fecha y, si el cambio es importante, te pediremos que la aceptes de nuevo. Seguir usando el sitio luego de un cambio menor implica que lo aceptás.</P>

      <H2>12. Ley aplicable y jurisdicción</H2>
      <P>Estos términos se rigen por las leyes de la República Argentina. Para cualquier controversia serán competentes los tribunales ordinarios de San Miguel de Tucumán, sin perjuicio de que, como consumidor/a, puedas optar por los tribunales de tu domicilio conforme al art. 36 de la Ley 24.240.</P>
    </LegalLayout>
  );
}
