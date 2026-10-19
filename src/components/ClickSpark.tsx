import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  color?: string;
  className?: string;
  /** Number of spark lines drawn per click. */
  count?: number;
};

/**
 * Click ripple of radiating lines, after React Bits' <ClickSpark />.
 * Mounted once at the app root so it captures clicks anywhere.
 */
export default function ClickSpark({ color = '#ededed', className = '', count = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onClick = (e: MouseEvent) => {
      const spark = document.createElement('div');
      spark.className = 'pointer-events-none fixed z-[120]';
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      for (let i = 0; i < count; i++) {
        const line = document.createElement('span');
        line.style.position = 'absolute';
        line.style.width = '2px';
        line.style.height = '10px';
        line.style.background = color;
        line.style.borderRadius = '2px';
        line.style.transformOrigin = '50% 0%';
        line.style.transform = `rotate(${(360 / count) * i}deg)`;
        spark.appendChild(line);
      }
      root.appendChild(spark);

      gsap.fromTo(
        spark.children,
        { scaleY: 0.4, opacity: 1, y: 0 },
        {
          scaleY: 1.4,
          opacity: 0,
          y: 26,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.01,
          onComplete: () => spark.remove(),
        },
      );
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [color, count]);

  return <div ref={ref} aria-hidden className={className} />;
}
