import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useScroll, useSpring } from 'framer-motion';
import { Scissors } from 'lucide-react';

import { EASE } from '../lib/ease';

/** Aparece desde abajo al entrar en pantalla. */
export function Reveal({ delay = 0, y = 28, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** El contenido se acerca suavemente al cursor (botones con imán). */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={leave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
}

/** Inclinación 3D según la posición del mouse. */
export function Tilt({ children, max = 7, className = '' }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 170, damping: 18 });
  const sry = useSpring(ry, { stiffness: 170, damping: 18 });

  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onMouseMove={move}
      onMouseLeave={leave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Número que cuenta desde 0 al aparecer. Si no es un número, se muestra tal cual. */
export function CountUp({ to, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isNum = typeof to === 'number';
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!isNum || !inView) return;
    const c = animate(0, to, { duration: 1.3, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, isNum, to]);

  return <span ref={ref} className={className}>{isNum ? n : to}</span>;
}

/** Barra de progreso de lectura con rayas de barbería. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="pole-bar fixed top-0 inset-x-0 h-1.5 origin-left z-[70]" />;
}

/** Línea de corte: unas tijeras la recorren al entrar en pantalla. */
export function CutDivider() {
  return (
    <div aria-hidden="true" className="relative max-w-6xl mx-auto px-6 h-10 flex items-center overflow-hidden">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.4, ease: EASE }}
        className="origin-left w-full border-t-2 border-dashed border-cyan/50"
      />
      <motion.span
        initial={{ left: '1.5rem', opacity: 0 }}
        whileInView={{ left: 'calc(100% - 3rem)', opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute top-1/2 -translate-y-1/2 text-cyan"
      >
        <motion.span animate={{ rotate: [0, -14, 0, -14, 0] }} transition={{ duration: 1.4, ease: 'easeInOut' }} className="block">
          <Scissors size={22} />
        </motion.span>
      </motion.span>
    </div>
  );
}
