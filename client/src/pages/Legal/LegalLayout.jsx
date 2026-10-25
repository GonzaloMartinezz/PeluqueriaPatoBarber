import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';
import LegalLinks from '../../components/LegalLinks';
import { LEGAL_DATE, LEGAL_VERSION, useLegal } from '../../lib/legal';

// Muestra el dato; si el dueño todavía no lo cargó, lo marca bien visible para que no pase desapercibido.
export const Value = ({ v, what }) =>
  v ? (
    <strong className="text-white">{v}</strong>
  ) : (
    <mark className="rounded px-1.5 py-0.5 bg-amber-400/25 text-amber-200 font-semibold">[completar: {what}]</mark>
  );

export const H2 = ({ children }) => <h2 className="font-sans font-extrabold text-2xl mt-10 mb-3 text-cyan">{children}</h2>;
export const P = ({ children }) => <p className="text-gray-200 text-[17px] leading-relaxed mb-4">{children}</p>;
export const UL = ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-200 text-[17px] leading-relaxed marker:text-cyan">{children}</ul>;

export default function LegalLayout({ title, intro, children }) {
  const legal = useLegal();
  const incomplete = legal.loaded && !(legal.ownerName && legal.cuit && legal.email);

  return (
    <div className="min-h-dvh bg-dark-bg">
      <header className="sky-header rounded-b-[2rem] px-5 pt-5 pb-9">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="font-bebas text-2xl tracking-widest py-2">PATO BARBER</Link>
            <ThemeToggle onSky />
          </div>
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl leading-tight mt-3" style={{ color: 'var(--on-sky)' }}>{title}</h1>
          <p className="mt-2 font-semibold">Versión {LEGAL_VERSION} · Última actualización: {LEGAL_DATE}</p>
        </div>
      </header>

      <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {incomplete && (
          <div role="note" className="mb-8 rounded-2xl border border-amber-400/50 bg-amber-400/10 p-4 text-amber-200 font-semibold">
            Faltan datos del responsable (aparecen marcados abajo). Se completan desde Administración → Configuración → Datos legales.
          </div>
        )}
        {intro && <p className="text-gray-100 text-xl leading-relaxed mb-2">{intro}</p>}
        {children}

        <div className="mt-14 pt-6 border-t border-dark-border">
          <LegalLinks />
          <p className="text-muted text-sm mt-4">
            Estos textos son un modelo pensado para este servicio. Conviene que un abogado o contador los revise antes de publicar la web.
          </p>
        </div>
      </main>
    </div>
  );
}
