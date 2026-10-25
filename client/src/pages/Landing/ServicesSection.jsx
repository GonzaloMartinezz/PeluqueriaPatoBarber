import { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';
import { motion } from 'framer-motion';
import api from '../../lib/api';

// Se muestran mientras carga (o si falla) el listado real del administrador.
const fallbackServices = [
  {
    name: "Fade Clásico",
    description: "Corte degradado con navaja, precisión milimétrica y peinado final con productos premium.",
    price: "8.000",
    duration: 45,
    isPopular: false
  },
  {
    name: "Corte + Barba",
    description: "El combo completo. Diseño de barba, toalla caliente y fade a elección con terminación profesional.",
    price: "11.000",
    duration: 60,
    isPopular: true
  },
  {
    name: "Solo Barba",
    description: "Alineación, rebaje y perfilado con navaja. Hidratación final con aceites esenciales.",
    price: "5.500",
    duration: 30,
    isPopular: false
  }
];

const ServicesSection = () => {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    api.get('/services')
      .then(({ data }) => {
        if (data.services.length) {
          setServices(data.services.map((s) => ({ ...s, id: s._id, price: s.price.toLocaleString('es-AR') })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-dark-bg" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">
            // El menú
          </span>
          <h2 id="services-title" className="text-5xl md:text-6xl font-bebas text-white tracking-wider">
            Servicios
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id || index}
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
