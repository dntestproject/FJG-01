import { useRef, type PointerEvent, type ReactNode } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. */
  maxTilt?: number;
  scaleOnHover?: number;
  glare?: boolean;
};

/**
 * 3D tilt card with an optional moving glare, after React Bits' <TiltedCard />.
 */
export default function TiltedCard({
  children,
  className = '',
  maxTilt = 9,
  scaleOnHover = 1.02,
  glare = true,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    const box = wrap.current;
    if (!el || !box) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const rect = box.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    gsap.to(el, {
      rotateY: (px - 0.5) * maxTilt * 2,
      rotateX: -(py - 0.5) * maxTilt * 2,
      scale: scaleOnHover,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 900,
    });
    if (sheen.current) {
      gsap.to(sheen.current, {
        opacity: 0.5,
        backgroundPosition: `${px * 100}% ${py * 100}%`,
        duration: 0.4,
        overwrite: true,
      });
    }
  };

  const onLeave = () => {
    if (card.current) {
      gsap.to(card.current, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
      });
    }
    if (sheen.current) gsap.to(sheen.current, { opacity: 0, duration: 0.5 });
  };

  return (
    <div ref={wrap} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={card} className="relative h-full w-full will-change-transform">
        {children}
        {glare ? (
          <div
            ref={sheen}
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 55%)',
              backgroundSize: '200% 200%',
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
