import { useState } from 'react';
import { MapPin, Clock, Instagram, Phone, Navigation } from 'lucide-react';
import useBusiness, { DAY_LABELS, todayKey } from '../../lib/useBusiness';

const social =
  'flex-1 min-h-12 px-4 rounded-full border border-dark-border bg-dark-bg flex items-center justify-center gap-2 text-gray-100 hover:text-cyan hover:border-cyan/60 transition-colors font-semibold';

const LocationSection = () => {
  const b = useBusiness();
  const address = b?.address || 'Batalla de Chacabuco 1159, San Miguel de Tucumán';
  const handle = (b?.instagram || 'patobarber.pc').replace(/^@/, '').trim();
  const phoneDigits = b?.phone?.replace(/\D/g, '');
  const today = todayKey();
  // El mapa de Google recién se carga si la persona lo pide: así Google no recibe la visita de quien no lo mira.
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-dark-bg" aria-labelledby="loc-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-cyan font-mono text-xs tracking-[0.3em] uppercase mb-2 block">// Visitá el local</span>
          <h2 id="loc-title" className="font-sans font-extrabold text-4xl md:text-5xl text-white">
            Ubicación y <span className="text-cyan">horarios</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] rounded-[2.5rem] overflow-hidden border border-dark-border bg-dark-surface">
          <div className="p-6 sm:p-10 flex flex-col gap-7">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="w-14 h-14 rounded-2xl bg-cyan-dim text-cyan flex items-center justify-center shrink-0"><MapPin size={26} /></span>
              <div>
                <h3 className="font-sans font-extrabold text-2xl text-white">{address}</h3>
                <p className="text-gray-300">San Miguel de Tucumán, Argentina</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 mt-3 min-h-11 px-5 rounded-full bg-cyan text-black font-bebas text-lg tracking-widest hover:bg-white transition-colors"
                >
                  <Navigation size={16} aria-hidden="true" /> CÓMO LLEGAR <span className="sr-only">(se abre en una pestaña nueva)</span>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="w-14 h-14 rounded-2xl bg-sky-dim text-sky flex items-center justify-center shrink-0"><Clock size={26} /></span>
              <div className="flex-1">
                <h3 className="font-sans font-extrabold text-2xl text-white mb-2">Horarios</h3>
                {b ? (
                  <dl>
                    {DAY_LABELS.map(([key, label]) => {
                      const h = b.workingHours[key];
                      const now = key === today;
                      return (
                        <div key={key} className={`flex justify-between gap-3 py-2 px-3 -mx-3 rounded-xl ${now ? 'bg-cyan-dim text-white font-bold' : 'text-gray-300'}`}>
                          <dt>{label}{now && <span className="ml-2 text-cyan font-mono text-[11px] tracking-widest">HOY</span>}</dt>
                          <dd className="text-right">{h?.isOpen ? h.shifts.map((t) => `${t.open} – ${t.close}`).join('  ·  ') : 'Cerrado'}</dd>
                        </div>
                      );
                    })}
                  </dl>
                ) : (
                  <p className="text-muted">Cargando horarios…</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`https://www.instagram.com/${handle}/`} target="_blank" rel="noreferrer" className={social}>
                <Instagram size={18} aria-hidden="true" /> @{handle}<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              {phoneDigits && (
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer" className={social}>
                  <Phone size={18} aria-hidden="true" /> WhatsApp<span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              )}
            </div>
          </div>

          <div className="min-h-[340px] lg:min-h-full bg-dark-bg border-t lg:border-t-0 lg:border-l border-dark-border">
            {showMap ? (
              <iframe
                title={`Mapa: ${address}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                className="map-frame w-full h-full min-h-[340px] border-0"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="h-full min-h-[340px] flex flex-col items-center justify-center gap-4 p-6 text-center" style={{ backgroundImage: 'radial-gradient(var(--color-dark-border) 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
                <span aria-hidden="true" className="w-20 h-20 rounded-full bg-cyan text-black flex items-center justify-center shadow-xl"><MapPin size={36} /></span>
                <p className="text-white font-sans font-extrabold text-xl max-w-xs">{address}</p>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="min-h-12 px-8 rounded-full bg-[#062a44] text-[#ffffff] font-bebas tracking-widest text-lg hover:bg-black transition-colors"
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
