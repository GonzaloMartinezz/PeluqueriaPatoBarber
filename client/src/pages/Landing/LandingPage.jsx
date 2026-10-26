import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Logo from '../../components/Logo';
import LegalLinks from '../../components/LegalLinks';
import useBusiness from '../../lib/useBusiness';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import ServicesSection from './ServicesSection';
import InstagramSection from './InstagramSection';
import CollabSection from './CollabSection';
import LocationSection from './LocationSection';

const WORDS = ['Skin fade', 'Perfilado de barba', 'Taper cut', 'Coloración', 'Platinado', 'Corte clásico'];

// Cinta con los servicios (decorativa: los lectores de pantalla la ignoran).
const Marquee = () => (
  <div aria-hidden="true" className="overflow-hidden border-y border-dark-border bg-dark-bg py-4">
    <div className="marquee flex w-max gap-10 font-sans font-extrabold uppercase tracking-widest text-gray-300">
      {[0, 1].map((n) => (
        <div key={n} className="flex gap-10 shrink-0">
          {WORDS.map((w) => <span key={w} className="flex items-center gap-10">{w}<span className="text-cyan">✦</span></span>)}
        </div>
      ))}
    </div>
  </div>
);

const LandingPage = () => {
  const b = useBusiness();
  const handle = (b?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const col = 'font-mono text-xs tracking-widest uppercase text-cyan mb-3';
  const a = 'block py-1.5 text-gray-200 hover:text-white';

  return (
    <div className="min-h-dvh bg-dark-bg">
      <Navbar />
      <main id="main">
        <HeroSection />
        <Marquee />
        <ServicesSection />
        <HowItWorks />
        <InstagramSection />
        <CollabSection />
        <LocationSection />
      </main>

      <footer className="bg-dark-surface border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="w-14 h-14" />
              <span className="font-bebas text-3xl tracking-widest text-white">PATO BARBER</span>
            </div>
            <p className="text-gray-300 mt-4 max-w-xs">Barbería en San Miguel de Tucumán. Reservá tu turno online, sin esperas.</p>
          </div>
          <nav aria-label="Pie de página">
            <h2 className={col}>Navegá</h2>
            <a href="#servicios" className={a}>Servicios</a>
            <a href="#como-reservar" className={a}>Cómo reservar</a>
            <a href="#instagram" className={a}>Instagram</a>
            <a href="#colaborar" className={a}>Colaborá</a>
            <a href="#ubicacion" className={a}>Ubicación</a>
          </nav>
          <div>
            <h2 className={col}>Tu cuenta</h2>
            <Link to="/reservar" className={a}>Reservar turno</Link>
            <Link to="/mis-turnos" className={a}>Mis turnos</Link>
            <Link to="/login" className={a}>Ingresar</Link>
            <Link to="/register" className={a}>Crear cuenta</Link>
          </div>
          <div>
            <h2 className={col}>Seguinos</h2>
            <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer" className={`${a} inline-flex items-center gap-2`}>
              <Instagram size={18} aria-hidden="true" /> @{handle}<span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
        <div className="border-t border-dark-border py-6 text-center px-4">
          <p className="text-muted text-xs font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} Pato Barber · San Miguel de Tucumán
          </p>
          <LegalLinks className="justify-center mt-3" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
