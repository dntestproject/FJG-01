import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/scroll';

type Item = { id: string; index: string; label: string };

type Props = {
  items: readonly Item[];
  /** Called when an item is activated; receives the section id. */
  onNavigate: (id: string) => void;
};

/**
 * Floating macOS-style dock, after React Bits' <Dock />. Items scale by
 * distance from the cursor using a gaussian falloff.
 */
export default function Dock({ items, onNavigate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-dock-item]'));

    const onMove = (e: PointerEvent) => {
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const d = Math.abs(e.clientX - cx);
        const scale = gsap.utils.clamp(1, 1.5, 1 + 0.5 * Math.exp(-(d * d) / (2 * 90 * 90)));
        const lift = gsap.utils.clamp(0, 16, 16 * Math.exp(-(d * d) / (2 * 90 * 90)));
        gsap.to(node, { scale, y: -lift, duration: 0.35, ease: 'power2.out', overwrite: true });
      });
    };

    const reset = () => {
      gsap.to(nodes, { scale: 1, y: 0, duration: 0.5, ease: 'power3.out', overwrite: true });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-auto flex items-end gap-1 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-xl"
    >
      {items.map((item) => (
        <button
          key={item.id}
          data-dock-item
          type="button"
          onClick={() => {
            setActive(item.id);
            onNavigate(item.id);
          }}
          className={`group flex h-11 w-11 origin-bottom flex-col items-center justify-center rounded-xl transition-colors ${
            active === item.id ? 'bg-paper text-ink' : 'text-paper/70 hover:bg-white/10'
          }`}
          aria-label={`${item.index} ${item.label}`}
          title={`${item.index} ${item.label}`}
        >
          <span className="mono-label !text-[0.6rem] leading-none">{item.index}</span>
        </button>
      ))}
    </div>
  );
}
