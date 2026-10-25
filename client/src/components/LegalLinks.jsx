import { Link } from 'react-router-dom';

// Enlaces legales que van en el pie de cada pantalla pública.
export default function LegalLinks({ className = '' }) {
  const link = 'inline-flex items-center min-h-11 px-2 underline underline-offset-4 hover:text-cyan';
  return (
    <nav aria-label="Información legal" className={`flex flex-wrap gap-x-5 text-sm text-gray-300 ${className}`}>
      <Link to="/terminos" className={link}>Términos y condiciones</Link>
      <Link to="/privacidad" className={link}>Política de privacidad</Link>
      <Link to="/cookies" className={link}>Cookies</Link>
    </nav>
  );
}
