import { m as motion } from 'framer-motion';
import { ExternalLink, Instagram, Play } from 'lucide-react';
import useBusiness from '../../lib/useBusiness';
import useReels from '../../lib/useReels';
import { Magnetic } from '../../components/motion';

const DEFAULT_HANDLE = 'patobarber.pc';

// Colores de las seis ventanas (alternan celeste y naranja de la marca).
const TILES = [
  'from-[#38bdf8] to-[#0369a1] text-[#ffffff]',
  'from-[#fb923c] to-[#c2410c] text-[#1c0a00]',
  'from-[#0ea5e9] to-[#075985] text-[#ffffff]',
  'from-[#fdba74] to-[#ea580c] text-[#1c0a00]',
  'from-[#7dd3fc] to-[#0284c7] text-[#062a44]',
  'from-[#f97316] to-[#9a3412] text-[#ffffff]',
];

const isReel = (u) => /^https:\/\/(www\.)?instagram\.com\//.test(u || '');

// Seis ventanas tocables: cada una lleva directo al reel de Instagram (o a la pestaña de reels si falta cargarlo).
const InstagramSection = () => {
  const b = useBusiness();
  const handle = (b?.instagram || DEFAULT_HANDLE).replace(/^@/, '').trim();
  const profile = `https://www.instagram.com/${handle}/`;
  const reelsPage = `${profile}reels/`;
  const covers = useReels(); // { url, title, thumb } con la portada servida por nuestra API
  const saved = (covers?.length ? covers : (b?.reels || []).map((url) => ({ url, title: '', thumb: '' }))).filter((r) => isReel(r.url)).slice(0, 6);
  const tiles = Array.from({ length: 6 }, (_, i) => ({ url: saved[i]?.url || reelsPage, exact: !!saved[i], thumb: saved[i]?.thumb || '', title: saved[i]?.title || '' }));

  return (
    <section id="instagram" className="cv-auto py-16 sm:py-24 bg-dark-surface border-y border-dark-border" aria-labelledby="ig-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 id="ig-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white leading-tight">
              Mirá nuestro trabajo en <span className="text-cyan">Instagram</span>
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mt-3">
              Tocá un reel y se abre directo en Instagram. Seguinos en <b className="text-white">@{handle}</b>.
            </p>
          </div>
          <Magnetic><a href={profile} target="_blank" rel="noreferrer" className="btn-shine inline-flex items-center justify-center gap-2 min-h-14 px-7 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest shadow-xl hover:shadow-2xl active:scale-95 transition-all">
            <Instagram size={20} aria-hidden="true" /> SEGUIR @{handle.toUpperCase()}
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a></Magnetic>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {tiles.map((t, i) => (
            <motion.li key={i} initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <a
                href={t.url}
                target="_blank"
                rel="noreferrer"
                className={`group relative flex flex-col justify-between aspect-[9/14] rounded-3xl bg-gradient-to-br p-4 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ${TILES[i]}`}
              >
                {t.thumb ? (
                  <>
                    <img src={t.thumb} alt="" loading="lazy" decoding="async" width="640" height="1137" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                  </>
                ) : (
                  <span aria-hidden="true" className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/15 group-hover:scale-125 transition-transform duration-500" />
                )}
                <Instagram size={22} aria-hidden="true" className={`relative opacity-90 ${t.thumb ? 'text-[#ffffff] drop-shadow' : ''}`} />
                <span aria-hidden="true" className="pulse-ring relative mx-auto w-16 h-16 rounded-full bg-white/90 text-[#062a44] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </span>
                <span className={`relative ${t.thumb ? 'text-[#ffffff]' : ''}`}>
                  <span className="block font-sans font-extrabold text-lg leading-tight">Reel {i + 1}</span>
                  {t.title && <span className="block text-[13px] leading-snug font-medium opacity-95 line-clamp-2">{t.title}</span>}
                  <span className="flex items-center gap-1 text-sm font-semibold mt-0.5">{t.exact ? 'Ver en Instagram' : 'Ver reels'} <ExternalLink size={13} aria-hidden="true" /></span>
                </span>
                <span className="sr-only">{t.exact ? `Reel ${i + 1}` : 'Reels de Instagram'} (se abre en una pestaña nueva)</span>
              </a>
            </motion.li>
          ))}
        </ul>
        <p className="text-muted text-sm mt-6">Al abrir un reel salís del sitio y Instagram (Meta) recibe tu visita. Más información en la <a href="/privacidad" className="text-cyan underline underline-offset-4">Política de Privacidad</a>.</p>
      </div>
    </section>
  );
};

export default InstagramSection;
