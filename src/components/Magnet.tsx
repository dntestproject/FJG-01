import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  children: ReactNode;
  className?: string;
  /** Pointer-follow strength in px. */
  strength?: number;
  radius?: number;
};

/**
 * Magnetic hover: the element drifts toward the cursor and springs back on
 * leave. Port of React Bits' <Magnet /> built on gsap.quickTo.
 */
export default function Magnet({ children, className = '', strength = 0.32, radius = 160 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapEl = wrap.current;
    const innerEl = inner.current;
    if (!wrapEl || !innerEl) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const xTo = gsap.quickTo(innerEl, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(innerEl, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const rect = wrapEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(rect.width, rect.height) / 2 + radius;
      if (dist > reach) {
        xTo(0);
        yTo(0);
        return;
      }
      xTo(dx * strength);
      yTo(dy * strength);
    };

    const reset = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', reset);
    };
  }, [radius, strength]);

  return (
    <div ref={wrap} className={className}>
      <div ref={inner} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
