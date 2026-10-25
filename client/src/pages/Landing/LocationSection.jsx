import { useState } from 'react';
import { MapPin, Clock, Instagram, Phone } from 'lucide-react';
import useBusiness, { DAY_LABELS, todayKey } from '../../lib/useBusiness';

const card = 'bg-dark-surface p-5 sm:p-7 border border-dark-border rounded-md flex items-start gap-4 sm:gap-5';
const iconBox = 'w-12 h-12 bg-cyan-dim border border-cyan/30 rounded-md flex items-center justify-center text-cyan shrink-0';
const social =
  'flex-1 bg-dark-surface min-h-14 px-4 border border-dark-border rounded-md flex items-center justify-center gap-3 text-gray-200 hover:text-cyan hover:border-cyan/60 transition-colors';

const LocationSection = () => {
  const b = useBusiness();
  const address = b?.address || 'Batalla de Chacabuco 1159, San Miguel de Tucumán';
  const handle = b?.instagram?.replace(/^@/, '').trim();
  const phoneDigits = b?.phone?.replace(/\D/g, '');
  const today = todayKey();
  // El mapa de Google recién se carga si la persona lo pide: así Google no recibe la visita de quien no lo mira.
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-dark-bg border-t border-dark-border" aria-labelledby="loc-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Dónde estamos</span>
          <h2 id="loc-title" className="text-5xl md:text-6xl font-bebas tracking-wider">Ubicación y horarios</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="space-y-4 sm:space-y-6">
            <div className={card}>
              <div className={iconBox}><MapPin size={24} aria-hidden="true" /></div>
              <div>
                <h3 className="text-white font-bebas text-2xl tracking-wider mb-1">Dirección</h3>
                <p className="text-gray-300 leading-relaxed">{address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-cyan font-mono text-xs tracking-widest border-b border-cyan/40 pb-0.5 hover:border-cyan"
                >
                  CÓMO LLEGAR <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </div>
            </div>

            <div className={card}>
              <div className={iconBox}><Clock size={24} aria-hidden="true" /></div>
              <div className="flex-1">
                <h3 className="text-white font-bebas text-2xl tracking-wider mb-2">Horarios</h3>
                {b ? (
                  <dl>
                    {DAY_LABELS.map(([key, label]) => {
                      const h = b.workingHours[key];
                      return (
                        <div
                          key={key}
                          className={`flex justify-between text-sm py-1.5 border-b border-dark-border/60 last:border-0 ${
                            key === today ? 'text-white font-semibold' : 'text-gray-300'
                          }`}
                        >
                          <dt>{label}{key === today && <span className="ml-2 text-cyan font-mono text-[11px] tracking-widest">HOY</span>}</dt>
                          <dd className="text-right">{h?.isOpen ? h.shifts.map((t) => `${t.open} – ${t.close}`).join('  ·  ') : 'Cerrado'}</dd>
                        </div>
                      );
                    })}
                  </dl>
                ) : (
                  <p className="text-muted text-sm">Cargando horarios…</p>
                )}
              </div>
            </div>

            {(handle || phoneDigits) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {handle && (
                  <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className={social}>
                    <Instagram size={20} aria-hidden="true" />
                    <span className="font-bebas tracking-widest text-lg">@{handle}</span>
                  </a>
                )}
                {phoneDigits && (
                  <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className={social}>
                    <Phone size={20} aria-hidden="true" />
                    <span className="font-bebas tracking-widest text-lg">WhatsApp</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="h-[320px] sm:h-[420px] lg:h-[520px] bg-dark-surface border border-dark-border rounded-md overflow-hidden">
            {showMap ? (
              <iframe
                title={`Mapa: ${address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                className="map-frame w-full h-full border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                <MapPin size={40} className="text-cyan" aria-hidden="true" />
                <p className="text-gray-200 max-w-xs">{address}</p>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="min-h-12 px-6 rounded-xl bg-cyan text-black font-bebas tracking-widest text-lg hover:bg-white transition-colors"
                >
                  VER MAPA
                </button>
                <p className="text-muted text-sm max-w-xs">Al ver el mapa se carga Google Maps y Google recibe tu visita.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
