import useBusiness from './useBusiness';

// Versión y fecha de los textos legales. Si se cambian los textos, subir la versión
// (y la del backend en src/config/constants.js) para saber qué aceptó cada persona.
export const LEGAL_VERSION = '2026-10';
export const LEGAL_DATE = 'octubre de 2026';

// Datos del responsable, tomados de Administración → Configuración → Datos legales.
export function useLegal() {
  const b = useBusiness();
  const l = b?.legal || {};
  return {
    loaded: !!b,
    brand: b?.name || 'Pato Barber',
    ownerName: l.ownerName,
    cuit: l.cuit,
    address: l.address || b?.address,
    email: l.email,
    phone: b?.phone,
    cancellationHours: l.cancellationHours || 0,
  };
}
