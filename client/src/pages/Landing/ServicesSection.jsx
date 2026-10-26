import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import useServices from '../../lib/useServices';

// Se muestran mientras carga (o si falla) el listado real del administrador.
const FALLBACK = [
  { name: 'Corte de pelo', description: 'Corte a tu medida con degradé a navaja, lavado y peinado final.', price: 12000, duration: 45, isPopular: true },
  { name: 'Teñido / Coloración', description: 'Coloración profesional con matizado y baño de crema reparador. Precio aproximado.', price: 50000, duration: 120 },
];

// Cada tarjeta tiene su color de marca (celeste / naranja) y se rellena al pasar el mouse o al tocarla.
const TONES = [
  { name: 'sky', fill: 'from-[#bae6fd] to-[#38bdf8]', ink: 'text-[#062a44]', hov: 'group-hover:text-[#062a44] group-focus-within:text-[#062a44]', edge: 'border-sky/40', accent: 'text-sky', chip: 'bg-sky-dim text-sky' },
  { name: 'orange', fill: 'from-[#fed7aa] to-[#fb923c]', ink: 'text-[#2a1000]', hov: 'group-hover:text-[#2a1000] group-focus-within:text-[#2a1000]', edge: 'border-cyan/40', accent: 'text-cyan', chip: 'bg-cyan-dim text-cyan' },
];

function Card({ s, tone, index, selected, onSelect }) {
  const on = selected;
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      className={`group relative w-full sm:w-[22rem] lg:w-[26rem] cursor-pointer rounded-[2rem] border-2 p-7 sm:p-8 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-within:-translate-y-1 ${tone.edge}
        bg-dark-surface hover:border-transparent focus-within:border-transparent ${on ? 'border-transparent -translate-y-1' : ''}`}
    >
      {/* Relleno de color */}
      <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${tone.fill} transition-opacity duration-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 ${on ? '!opacity-100' : ''}`} />

      <div className="relative">
        {s.isPopular && (
          <span className="absolute -top-1 right-0 rounded-full bg-[#062a44] text-[#ffffff] font-mono text-[11px] font-bold px-3 py-1 tracking-widest">POPULAR</span>
        )}
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider transition-colors ${tone.chip} group-hover:bg-black/15 group-focus-within:bg-black/15 ${tone.hov} ${on ? `bg-black/15 ${tone.ink}` : ''}`}>
          <Clock size={13} aria-hidden="true" /> {s.duration} min
        </span>
        <h3 className={`font-sans font-extrabold text-2xl sm:text-3xl mt-4 transition-colors ${tone.hov} ${on ? tone.ink : 'text-white'}`}>{s.name}</h3>
        <p className={`mt-2 leading-relaxed min-h-[4.5rem] transition-colors ${tone.hov} ${on ? tone.ink : 'text-gray-300'}`}>{s.description}</p>
        <p className={`font-sans font-extrabold text-4xl sm:text-5xl mt-5 transition-colors ${tone.hov} ${on ? tone.ink : tone.accent}`}>
          ${Number(s.price).toLocaleString('es-AR')}
        </p>
        <Link
          to={s._id ? `/reservar?servicio=${s._id}` : '/reservar'}
          className="mt-6 inline-flex items-center justify-center gap-2 min-h-12 w-full rounded-full bg-[#062a44] text-[#ffffff] font-bebas text-xl tracking-widest hover:bg-black transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          RESERVAR <span className="sr-only">{s.name}</span> <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}

const ServicesSection = () => {
  const loaded = useServices();
  const services = loaded?.length ? loaded : FALLBACK;
  const [selected, setSelected] = useState(null);

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-dark-bg" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14 text-center">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// El menú</span>
          <h2 id="services-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white">
            Nuestros <span className="text-cyan">servicios</span>
          </h2>
          <p className="text-gray-300 text-lg mt-3 max-w-xl mx-auto">Elegí el que necesitás y reservá tu horario libre al instante.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map((s, i) => (
            <Card
              key={s._id || s.name}
              s={s}
              tone={TONES[i % TONES.length]}
              index={i}
              selected={selected === (s._id || s.name)}
              onSelect={() => setSelected(selected === (s._id || s.name) ? null : s._id || s.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
