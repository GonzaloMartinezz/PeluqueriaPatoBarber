import { m as motion } from 'framer-motion';
import { Magnetic } from '../../components/motion';
import { ExternalLink, MessageSquareHeart, MousePointerClick, Star, Type } from 'lucide-react';
import useBusiness from '../../lib/useBusiness';

const STEPS = [
  [MousePointerClick, 'Tocá el botón', 'Se abre Google Maps con el perfil de la barbería.'],
  [Star, 'Elegí tus estrellas', 'Poné de 1 a 5 estrellas a tu experiencia.'],
  [Type, 'Contanos cómo te fue', 'Un comentario corto ayuda mucho a otros clientes.'],
];

// Invita a calificar el negocio en Google Maps (más reseñas = más clientes nuevos).
const ReviewsSection = () => {
  const b = useBusiness();
  const query = `${b?.name || 'Pato Barber'} ${b?.address || 'Batalla de Chacabuco 1159, San Miguel de Tucumán'}`;
  const url = b?.googleReviewUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section id="resenas" className="cv-auto py-16 sm:py-24 bg-dark-bg" aria-labelledby="rev-title">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#bae6fd] via-[#7dd3fc] to-[#38bdf8] text-[#062a44] p-8 sm:p-12 text-center"
        >
          <span aria-hidden="true" className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-white/30" />
          <span aria-hidden="true" className="absolute -right-14 -bottom-14 w-56 h-56 rounded-full bg-[#fb923c]/40" />

          <div className="relative">
            <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -90, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 260, damping: 12 }}
                  whileHover={{ scale: 1.35, rotate: 15 }}
                  className="inline-flex"
                >
                  <Star size={34} fill="#f97316" stroke="#c2410c" strokeWidth={1.5} />
                </motion.span>
              ))}
            </div>
            <h2 id="rev-title" className="text-inherit font-sans font-extrabold text-3xl sm:text-5xl leading-tight">
              ¿Te gustó tu corte? <br className="hidden sm:block" />Dejanos tu reseña en Google
            </h2>
            <p className="text-lg font-medium mt-4 max-w-2xl mx-auto">
              Tu calificación en Google Maps ayuda a que más personas conozcan la barbería. ¡Te lleva menos de un minuto!
            </p>

            <ol className="grid sm:grid-cols-3 gap-3 mt-8 text-left">
              {STEPS.map(([Icon, title, text], i) => (
                <motion.li key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }} whileHover={{ y: -6, scale: 1.02 }} className="rounded-3xl bg-white/70 p-5">
                  <span aria-hidden="true" className="w-11 h-11 rounded-2xl bg-[#062a44] text-[#ffffff] flex items-center justify-center mb-3"><Icon size={22} /></span>
                  <h3 className="text-inherit font-sans font-extrabold text-lg"><span className="sr-only">Paso {i + 1}: </span>{title}</h3>
                  <p className="text-[15px] font-medium leading-snug mt-1">{text}</p>
                </motion.li>
              ))}
            </ol>

            <Magnetic className="mt-9">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex items-center justify-center gap-3 min-h-14 px-9 rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-xl sm:text-2xl tracking-widest shadow-xl hover:bg-black hover:shadow-2xl active:scale-95 transition-all"
            >
              <MessageSquareHeart size={22} aria-hidden="true" /> CALIFICAR EN GOOGLE MAPS <ExternalLink size={18} aria-hidden="true" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
