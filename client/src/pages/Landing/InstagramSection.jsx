import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Instagram, Play } from 'lucide-react';
import useBusiness from '../../lib/useBusiness';

const DEFAULT_HANDLE = 'patobarber.pc';

// De un enlace de Instagram saca el tipo y el código para armar la dirección del embed.
const parse = (url) => {
  const m = /instagram\.com\/(?:[\w.]+\/)?(reel|reels|p)\/([\w-]+)/.exec(url || '');
  return m ? { type: m[1] === 'p' ? 'p' : 'reel', code: m[2], url } : null;
};

function ReelCard({ reel, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="relative aspect-[9/14] rounded-3xl overflow-hidden border border-dark-border bg-dark-surface"
    >
      {open ? (
        <iframe
          title={`Reel ${index + 1} de Instagram`}
          src={`https://www.instagram.com/${reel.type}/${reel.code}/embed`}
          className="w-full h-full border-0 bg-white"
          allow="encrypted-media"
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group w-full h-full flex flex-col items-center justify-center gap-3 p-4 text-center bg-gradient-to-br from-dark-surface2 via-dark-surface to-dark-bg hover:from-cyan-dim transition-colors"
        >
          <span aria-hidden="true" className="w-16 h-16 rounded-full bg-cyan text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"><Play size={28} fill="currentColor" /></span>
          <span className="font-sans font-extrabold text-white text-lg">Ver reel {index + 1}</span>
          <span className="text-muted text-xs">Se carga desde Instagram</span>
        </button>
      )}
    </motion.li>
  );
}

// Redes sociales: invita a seguir a la barbería y muestra los reels elegidos en Configuración.
const InstagramSection = () => {
  const b = useBusiness();
  const handle = (b?.instagram || DEFAULT_HANDLE).replace(/^@/, '').trim();
  const profile = `https://www.instagram.com/${handle}/`;
  const reels = (b?.reels || []).map(parse).filter(Boolean).slice(0, 6);

  return (
    <section id="instagram" className="py-16 sm:py-24 bg-dark-surface border-y border-dark-border" aria-labelledby="ig-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-center">
          <div>
            <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Redes</span>
            <h2 id="ig-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white leading-tight">
              Mirá nuestro trabajo en <span className="text-cyan">Instagram</span>
            </h2>
            <p className="text-gray-200 text-lg leading-relaxed mt-4 max-w-lg">
              Cortes, degradés y transformaciones todas las semanas. Seguinos en <b className="text-white">@{handle}</b> y no te pierdas ningún reel.
            </p>
            <div className="flex flex-col gap-3 mt-7 max-w-sm">
              <a href={profile} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 min-h-14 px-7 rounded-full bg-cyan text-black font-bebas text-xl tracking-widest hover:bg-white transition-colors">
                <Instagram size={20} aria-hidden="true" /> SEGUIR @{handle.toUpperCase()}
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
              <a href={`${profile}reels/`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 min-h-14 px-7 rounded-full border-2 border-white/25 text-white font-bebas text-xl tracking-widest hover:border-cyan hover:text-cyan transition-colors">
                VER TODOS LOS REELS <ExternalLink size={18} aria-hidden="true" />
                <span className="sr-only">(se abre en una pestaña nueva)</span>
              </a>
            </div>
          </div>

          {reels.length ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reels.map((r, i) => <ReelCard key={r.code} reel={r} index={i} />)}
            </ul>
          ) : (
            <a href={`${profile}reels/`} target="_blank" rel="noreferrer" className="group rounded-3xl border border-dashed border-dark-border bg-dark-bg p-10 text-center hover:border-cyan transition-colors">
              <span aria-hidden="true" className="mx-auto w-20 h-20 rounded-full bg-cyan-dim text-cyan flex items-center justify-center mb-4"><Play size={34} fill="currentColor" /></span>
              <span className="block font-sans font-extrabold text-2xl text-white">Los reels viven en Instagram</span>
              <span className="block text-gray-300 mt-2">Tocá para verlos en @{handle}</span>
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
        <p className="text-muted text-sm mt-6">Al reproducir un reel se carga Instagram y Meta recibe tu visita. Más información en la <a href="/privacidad" className="text-cyan underline underline-offset-4">Política de Privacidad</a>.</p>
      </div>
    </section>
  );
};

export default InstagramSection;
