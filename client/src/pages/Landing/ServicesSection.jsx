import { useEffect, useState } from 'react';
import ServiceCard from '../../components/ServiceCard';
import { motion } from 'framer-motion';
import api from '../../lib/api';

// Se muestran mientras carga (o si falla) el listado real del administrador.
const fallbackServices = [
  {
    name: "Corte de pelo",
    description: "Corte a tu medida con degradé a navaja, lavado y peinado final.",
    price: "12.000",
    duration: 45,
    isPopular: true
  },
  {
    name: "Teñido / Coloración",
    description: "Coloración profesional con matizado y baño de crema reparador. Precio aproximado.",
    price: "50.000",
    duration: 120,
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
          <h2 id="services-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white">
            Servicios
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
