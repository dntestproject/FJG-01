import { useRef, type PointerEvent, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Spotlight colour, any valid CSS colour. */
  color?: string;
  size?: number;
  border?: boolean;
};

/**
 * Card with a cursor-tracking radial spotlight and (optionally) a border glow,
 * after React Bits' <SpotlightCard />.
 */
export default function SpotlightCard({
  children,
  className = '',
  color = 'rgba(237,237,237,0.12)',
  size = 340,
  border = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group relative overflow-hidden ${className}`}
      style={{ ['--spot-size' as string]: `${size}px`, ['--spot-color' as string]: color }}
    >
      {border ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(var(--spot-size) circle at var(--mx, 50%) var(--my, 50%), var(--spot-color), transparent 70%)',
          }}
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(calc(var(--spot-size) * 1.4) circle at var(--mx, 50%) var(--my, 50%), var(--spot-color), transparent 65%)',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
