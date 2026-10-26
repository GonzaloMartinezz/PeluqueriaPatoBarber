import { motion } from 'framer-motion';
import { Handshake, Instagram, MessageCircle, Mic2, PartyPopper, Sparkles } from 'lucide-react';
import useBusiness from '../../lib/useBusiness';

const DEFAULT_HANDLE = 'patobarber.pc';

const IDEAS = [
  { icon: PartyPopper, title: 'Eventos', text: 'Cortes en vivo, lanzamientos, fiestas y encuentros. Llevamos la barbería a tu evento.', topic: 'un evento' },
  { icon: Mic2, title: 'Personas reconocidas', text: 'Artistas, deportistas y creadores de contenido: armemos una imagen a la altura de tu escenario.', topic: 'una colaboración con una persona reconocida' },
  { icon: Sparkles, title: 'Marcas y proyectos', text: 'Productos, sesiones de fotos, videos y sponsors. Contanos tu idea y la hacemos realidad.', topic: 'un proyecto con mi marca' },
];

// Invitación a colaborar: los mensajes salen ya escritos por WhatsApp o por mensaje directo de Instagram.
const CollabSection = () => {
  const b = useBusiness();
  const handle = (b?.instagram || DEFAULT_HANDLE).replace(/^@/, '').trim();
  const phone = b?.phone?.replace(/\D/g, '');
  const wa = (topic) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hola Pato Barber, quiero consultar por ${topic}.`)}`;

  return (
    <section id="colaborar" className="py-16 sm:py-24 bg-dark-bg" aria-labelledby="collab-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Trabajemos juntos</span>
          <h2 id="collab-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white leading-tight">
            ¿Querés <span className="text-cyan">colaborar</span> con la barbería?
          </h2>
          <p className="text-gray-200 text-lg mt-4 leading-relaxed">
            Si tenés un evento, sos una persona reconocida o querés hacer algo con tu marca, escribinos. Respondemos personalmente.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-5">
          {IDEAS.map(({ icon: Icon, title, text, topic }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col rounded-3xl border border-dark-border bg-dark-surface p-6"
            >
              <span aria-hidden="true" className="w-14 h-14 rounded-2xl bg-cyan-dim text-cyan flex items-center justify-center mb-4"><Icon size={28} /></span>
              <h3 className="font-sans font-extrabold text-2xl text-white">{title}</h3>
              <p className="text-gray-300 mt-2 leading-relaxed flex-1">{text}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {phone && (
                  <a href={wa(topic)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full bg-cyan text-black font-bold text-sm hover:bg-white transition-colors">
                    <MessageCircle size={16} aria-hidden="true" /> WhatsApp<span className="sr-only"> sobre {topic} (se abre en una pestaña nueva)</span>
                  </a>
                )}
                <a href={`https://ig.me/m/${handle}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full border border-white/25 text-white font-bold text-sm hover:border-cyan hover:text-cyan transition-colors">
                  <Instagram size={16} aria-hidden="true" /> Mensaje<span className="sr-only"> directo sobre {topic} (se abre en una pestaña nueva)</span>
                </a>
              </div>
            </motion.li>
          ))}
        </ul>

        <p className="mt-8 flex items-center gap-2 text-gray-300">
          <Handshake size={20} className="text-cyan shrink-0" aria-hidden="true" /> También podés escribirnos a <b className="text-white">@{handle}</b> en Instagram.
        </p>
      </div>
    </section>
  );
};

export default CollabSection;
