import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  /** Base colours of the drifting aurora bands. */
  colors?: [string, string, string];
  speed?: number;
  amplitude?: number;
};

/**
 * Animated aurora gradient backdrop (React Bits' <Aurora /> family), rendered
 * with a tiny WebGL-free shader substitute: layered radial gradients drifting
 * on a requestAnimationFrame loop. Cheap and looks close enough for a
 * monochrome editorial palette.
 */
export default function Aurora({
  className = '',
  colors = ['rgba(58,53,84,0.55)', 'rgba(50,57,71,0.5)', 'rgba(176,158,132,0.22)'],
  speed = 0.00022,
  amplitude = 16,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const layers = Array.from(el.querySelectorAll<HTMLElement>('[data-layer]'));
    const animate = (t: number) => {
      layers.forEach((layer, i) => {
        const phase = t * speed * (1 + i * 0.6);
        const x = Math.sin(phase) * amplitude;
        const y = Math.cos(phase * 0.8) * amplitude * 0.6;
        const s = 1 + Math.sin(phase * 1.3) * 0.08;
        layer.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${s})`;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [amplitude, speed]);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      {colors.map((c, i) => (
        <div
          key={i}
          data-layer
          className="absolute will-change-transform"
          style={{
            inset: `${-30 - i * 6}%`,
            background: `radial-gradient(45% 55% at ${30 + i * 22}% ${35 + i * 14}%, ${c}, transparent 68%)`,
            filter: 'blur(28px)',
          }}
        />
      ))}
    </div>
  );
}
