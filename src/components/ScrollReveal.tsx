import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before playing. */
  threshold?: number;
  y?: number;
  once?: boolean;
};

/**
 * Fades and lifts content into view on scroll. Mirrors the behaviour of
 * React Bits' <ScrollReveal /> but is driven by ScrollTrigger so it stays
 * synchronised with Lenis.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.9,
  threshold = 0.2,
  y = 42,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top ${Math.round((1 - threshold) * 100)}%`,
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, duration, once, threshold, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
