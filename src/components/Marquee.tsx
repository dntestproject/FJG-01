import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
  pauseOnHover?: boolean;
  /** Vertical gap/padding wrapper classes. */
  repeat?: number;
};

/**
 * Infinite CSS marquee, same idea as React Bits' <Marquee />. The track holds
 * two identical copies so the -50% translation loops seamlessly.
 */
export default function Marquee({
  children,
  speed = 26,
  reverse = false,
  className = '',
  pauseOnHover = true,
  repeat = 2,
}: Props) {
  const copies = Array.from({ length: repeat });
  return (
    <div
      className={`marquee overflow-hidden ${reverse ? 'marquee-reverse' : ''} ${
        pauseOnHover ? '' : 'pointer-events-none'
      } ${className}`}
      style={{ ['--marquee-duration' as string]: `${speed}s` }}
    >
      <div className="marquee-track">
        {copies.map((_, i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
