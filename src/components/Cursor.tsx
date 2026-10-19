import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/scroll';

/**
 * Custom dot-and-ring cursor with a hover label. The ring lerps behind the
 * dot, and any element carrying `data-cursor="LABEL"` inflates it.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    document.documentElement.classList.add('cursor-none-desktop');

    const dx = gsap.quickTo(dotEl, 'x', { duration: 0.12, ease: 'power2.out' });
    const dy = gsap.quickTo(dotEl, 'y', { duration: 0.12, ease: 'power2.out' });
    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]');
      if (target) {
        setLabel(target.dataset.cursor ?? '');
        gsap.to(ringEl, { scale: 2.6, borderColor: 'rgba(237,237,237,0.6)', duration: 0.35 });
      } else {
        setLabel('');
        gsap.to(ringEl, { scale: 1, borderColor: 'rgba(237,237,237,0.35)', duration: 0.35 });
      }
    };

    const onDown = () => gsap.to(ringEl, { scale: 0.82, duration: 0.18 });
    const onUp = () => gsap.to(ringEl, { scale: 1, duration: 0.28 });

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);

    return () => {
      document.documentElement.classList.remove('cursor-none-desktop');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[130] hidden md:block">
      <div
        ref={ring}
        className="absolute -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-paper/35"
      >
        {label ? (
          <span className="mono-label !text-[0.5rem] whitespace-nowrap text-paper">{label}</span>
        ) : null}
      </div>
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-paper" />
    </div>
  );
}
