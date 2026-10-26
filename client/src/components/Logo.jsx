// Logo del pato (archivo propio en /public). Se muestra recortado en círculo.
export default function Logo({ className = 'w-12 h-12', ring = false }) {
  return (
    <img
      src="/logo.webp"
      alt="Logo de Pato Barber"
      width="640"
      height="640"
      className={`${className} rounded-full object-cover bg-[#d9d9d9] shrink-0 ${ring ? 'ring-4 ring-glass' : ''}`}
    />
  );
}
