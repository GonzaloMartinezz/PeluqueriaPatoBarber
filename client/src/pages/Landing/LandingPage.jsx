import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LegalLinks from '../../components/LegalLinks';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import ServicesSection from './ServicesSection';
import LocationSection from './LocationSection';

const LandingPage = () => {
  return (
    <div className="min-h-dvh bg-dark-bg">
      <Navbar />
      <main id="main">
        <HeroSection />
        <ServicesSection />
        <HowItWorks />
        <LocationSection />
      </main>

      <footer className="py-12 bg-dark-surface border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-cyan font-bebas text-3xl tracking-widest block mb-6">PATO BARBER</span>
          <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 text-gray-300 font-mono text-xs tracking-widest uppercase">
            <a href="#servicios" className="py-2 hover:text-white">Servicios</a>
            <a href="#como-reservar" className="py-2 hover:text-white">Cómo reservar</a>
            <a href="#ubicacion" className="py-2 hover:text-white">Ubicación</a>
            <Link to="/reservar" className="py-2 hover:text-white">Reservar</Link>
          </nav>
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
