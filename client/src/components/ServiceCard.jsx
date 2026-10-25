import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const ServiceCard = ({ id, name, description, price, duration, isPopular }) => {
  return (
    <article
      className={`bg-dark-surface border rounded-md p-6 relative flex flex-col w-full transition-colors hover:border-cyan/60 ${
        isPopular ? 'border-cyan/50' : 'border-dark-border'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 right-4 bg-cyan text-black font-mono text-xs font-bold px-3 py-1 rounded-sm tracking-widest">
          POPULAR
        </span>
      )}

      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-2xl text-white font-bebas tracking-wider">{name}</h3>
        <span className="text-cyan font-mono text-lg font-bold whitespace-nowrap">${price}</span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">{description}</p>

      <div className="flex items-center justify-between gap-3">
        <span className="text-muted font-mono text-xs tracking-widest uppercase flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" /> {duration} min
        </span>
        <Link
          to={id ? `/reservar?servicio=${id}` : '/reservar'}
          className="inline-flex items-center gap-1.5 min-h-11 text-cyan font-bebas text-lg tracking-widest hover:text-white"
        >
          RESERVAR <span className="sr-only">{name}</span> <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

export default ServiceCard;
