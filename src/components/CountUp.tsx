import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  to: number;
  className?: string;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  start?: string;
};

/**
 * Counts up when scrolled into view — React Bits' <CountUp /> with a
 * ScrollTrigger gate.
 */
export default function CountUp({
  to,
  className = '',
  duration = 1.8,
  decimals = 0,
  suffix = '',
  prefix = '',
  start = 'top 90%',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      el.textContent = render(to);
      return;
    }

    el.textContent = render(0);
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = render(obj.v);
      },
      scrollTrigger: { trigger: el, start },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [decimals, duration, prefix, start, suffix, to]);

  return <span ref={ref} className={className} />;
}
