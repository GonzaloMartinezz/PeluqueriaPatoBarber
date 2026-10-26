import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import TikTokIcon from '../../components/TikTokIcon';
import Navbar from '../../components/Navbar';
import Logo from '../../components/Logo';
import { CutDivider, Reveal, ScrollProgress } from '../../components/motion';
import LegalLinks from '../../components/LegalLinks';
import useBusiness from '../../lib/useBusiness';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import ServicesSection from './ServicesSection';
import InstagramSection from './InstagramSection';
import CollabSection from './CollabSection';
import LocationSection from './LocationSection';
import ReviewsSection from './ReviewsSection';

const WORDS = ['Skin fade', 'Perfilado de barba', 'Taper cut', 'Coloración', 'Platinado', 'Corte clásico'];

// Cinta con los servicios (decorativa: los lectores de pantalla la ignoran).
const Marquee = () => (
  <div aria-hidden="true" className="overflow-hidden py-6">
    <div className="marquee flex w-max gap-10 font-sans font-extrabold text-xl uppercase tracking-widest text-gray-300">
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
  const col = 'text-inherit font-mono text-xs font-bold tracking-widest uppercase mb-3 opacity-80';
  const a = 'block py-1.5 font-semibold hover:underline underline-offset-4';

  return (
    <div className="min-h-dvh bg-dark-bg">
      <ScrollProgress />
      <Navbar overHero />
      <main id="main">
        <HeroSection />
        <Marquee />
        <ServicesSection />
        <CutDivider />
        <HowItWorks />
        <InstagramSection />
        <CutDivider />
        <CollabSection />
        <LocationSection />
        <ReviewsSection />
      </main>

      <footer className="px-3 sm:px-5 pb-4">
        <Reveal y={40}>
        <div className="sky-header max-w-7xl mx-auto rounded-[2.25rem] sm:rounded-[3rem]">
          <div className="px-6 sm:px-12 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-3">
                <motion.span whileHover={{ rotate: [0, -12, 12, 0] }} transition={{ duration: 0.6 }} className="inline-flex"><Logo className="w-14 h-14" ring /></motion.span>
                <span className="font-bebas text-3xl tracking-widest">PATO BARBER</span>
              </div>
              <p className="mt-4 max-w-xs font-medium">Barbería en San Miguel de Tucumán. Reservá tu turno online, sin esperas.</p>
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
              <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer" className={`${a} flex items-center gap-2`}>
                <Instagram size={18} aria-hidden="true" /> @{handle}<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <a href={`https://www.tiktok.com/@${(b?.tiktok || 'patobarber5').replace(/^@/, '').trim()}`} target="_blank" rel="noreferrer" className={`${a} flex items-center gap-2`}>
                <TikTokIcon size={18} /> @{(b?.tiktok || 'patobarber5').replace(/^@/, '').trim()}<span className="sr-only"> en TikTok (se abre en una pestaña nueva)</span>
              </a>
            </div>
          </div>
          <div className="border-t border-[#062a44]/20 px-6 sm:px-12 py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold">© {new Date().getFullYear()} Pato Barber · San Miguel de Tucumán</p>
            <LegalLinks className="[&_a]:!text-[#062a44]" />
          </div>
        </div>
        </Reveal>
      </footer>
    </div>
  );
};

export default LandingPage;
