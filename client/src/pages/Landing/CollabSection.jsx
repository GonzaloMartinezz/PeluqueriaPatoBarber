import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Magnetic, Reveal } from '../../components/motion';
import { ChevronRight, Instagram, MessageCircle, Mic2, PartyPopper, Sparkles } from 'lucide-react';
import useBusiness from '../../lib/useBusiness';

const DEFAULT_HANDLE = 'patobarber.pc';

const IDEAS = [
  { icon: PartyPopper, title: 'Eventos', text: 'Cortes en vivo, lanzamientos, fiestas y encuentros. Llevamos la barbería a tu evento.', topic: 'un evento' },
  { icon: Mic2, title: 'Personas reconocidas', text: 'Artistas, deportistas y creadores de contenido: armemos una imagen a la altura de tu escenario.', topic: 'una colaboración con una persona reconocida' },
  { icon: Sparkles, title: 'Marcas y proyectos', text: 'Productos, sesiones de fotos, videos y sponsors. Contanos tu idea y la hacemos realidad.', topic: 'un proyecto con mi marca' },
];

// Invitación a colaborar: elegís el tipo de propuesta y el mensaje sale ya escrito por WhatsApp o Instagram.
const CollabSection = () => {
  const b = useBusiness();
  const [pick, setPick] = useState(0);
  const handle = (b?.instagram || DEFAULT_HANDLE).replace(/^@/, '').trim();
  const phone = b?.phone?.replace(/\D/g, '');
  const cur = IDEAS[pick];
  const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`Hola Pato Barber, quiero consultar por ${cur.topic}.`)}`;

  return (
    <section id="colaborar" className="py-16 sm:py-24 bg-dark-bg" aria-labelledby="collab-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={40}>
        <div className="grid lg:grid-cols-[1.1fr_1fr] rounded-[2.5rem] overflow-hidden border border-dark-border">
          {/* Mensaje y botones */}
          <div className="relative p-8 sm:p-12 text-[#2a1000] bg-gradient-to-br from-[#fed7aa] via-[#fdba74] to-[#fb923c] flex flex-col justify-between gap-10">
            <span aria-hidden="true" className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/25" />
            <div className="relative">
              <span className="font-mono text-xs font-bold tracking-[0.3em] uppercase block mb-3">// Trabajemos juntos</span>
              <h2 id="collab-title" className="text-inherit font-sans font-extrabold text-4xl sm:text-5xl leading-tight">
                ¿Querés <span className="text-[#062a44]">colaborar</span> con Pato Barber?
              </h2>
              <p className="text-lg font-medium mt-4 max-w-md">Elegí qué tenés en mente y escribinos. Respondemos personalmente.</p>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.p key={cur.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="font-mono text-xs font-bold tracking-widest uppercase mb-3">
                  Quiero consultar por: {cur.title}
                </motion.p>
              </AnimatePresence>
              <div className="flex flex-wrap gap-3">
                {phone && (
                  <Magnetic><a href={wa} target="_blank" rel="noreferrer" className="btn-shine inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-lg tracking-widest hover:bg-black shadow-xl active:scale-95 transition-all">
                    <MessageCircle size={18} aria-hidden="true" /> ESCRIBIR POR WHATSAPP<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a></Magnetic>
                )}
                <a href={`https://ig.me/m/${handle}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full border-2 border-[#062a44] text-[#062a44] font-bebas text-lg tracking-widest hover:bg-[#062a44] hover:text-[#ffffff] transition-colors">
                  <Instagram size={18} aria-hidden="true" /> MENSAJE POR INSTAGRAM<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Opciones */}
          <div className="bg-dark-surface p-4 sm:p-6 flex flex-col justify-center gap-3" role="radiogroup" aria-label="Tipo de colaboración">
            {IDEAS.map(({ icon: Icon, title, text }, i) => {
              const on = pick === i;
              return (
                <motion.button
                  key={title}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPick(i)}
                  className={`text-left flex items-center gap-4 rounded-3xl border-2 p-5 transition-all duration-300 ${
                    on ? 'border-transparent bg-gradient-to-br from-[#bae6fd] to-[#38bdf8] text-[#062a44] shadow-xl scale-[1.02]' : 'border-dark-border bg-dark-bg text-gray-200 hover:border-sky/60'
                  }`}
                >
                  <span aria-hidden="true" className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${on ? 'bg-white/70 text-[#062a44]' : 'bg-cyan-dim text-cyan'}`}><Icon size={26} /></span>
                  <span className="flex-1">
                    <span className={`block font-sans font-extrabold text-xl ${on ? '' : 'text-white'}`}>{title}</span>
                    <span className={`block text-[15px] leading-snug mt-0.5 ${on ? 'font-medium' : 'text-gray-300'}`}>{text}</span>
                  </span>
                  <ChevronRight size={22} aria-hidden="true" className={`shrink-0 transition-transform ${on ? 'translate-x-1' : 'opacity-40'}`} />
                </motion.button>
              );
            })}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CollabSection;
