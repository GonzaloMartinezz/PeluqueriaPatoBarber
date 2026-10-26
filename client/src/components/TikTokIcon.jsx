// Ícono de TikTok (lucide no lo trae). Hereda el color del texto.
export default function TikTokIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.6 6.8a5.4 5.4 0 0 1-3.3-1.9A5.4 5.4 0 0 1 15 2h-3.3v13.2a2.7 2.7 0 1 1-1.9-2.6V9.2a6 6 0 1 0 5.2 5.9V9a8.7 8.7 0 0 0 4.6 1.4V7a5 5 0 0 1-.1-.2Z" />
    </svg>
  );
}
