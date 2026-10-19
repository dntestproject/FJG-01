import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/scroll';
import { PROFILE } from '../lib/content';

type Props = { onDone?: () => void };

/**
 * Intro curtain: counts 0→100 then wipes away, mirroring the loading beat at
 * the start of the reference recording.
 */
export default function Preloader({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      setDone(true);
      onDone?.();
    };

    if (reduced) {
      gsap.set(el, { autoAlpha: 0 });
      finish();
      return;
    }

    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' });
        finish();
      },
    });

    tl.to(obj, {
      v: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counter.current) {
          counter.current.textContent = String(Math.round(obj.v)).padStart(3, '0');
        }
      },
    })
      .to('[data-preloader-word]', { yPercent: -115, duration: 0.6, ease: 'expo.inOut' }, '-=0.3')
      .to(
        '[data-preloader-panel]',
        { yPercent: -100, duration: 0.85, ease: 'expo.inOut', stagger: 0.05 },
        '-=0.4',
      )
      .to('[data-preloader-meta]', { opacity: 0, duration: 0.3 }, '<');

    return () => {
      tl.kill();
    };
  }, [onDone]);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[140] overflow-hidden">
      <div className="absolute inset-0 flex">
        <div data-preloader-panel className="h-full w-1/3 bg-ink" />
        <div data-preloader-panel className="h-full w-1/3 bg-ink" />
        <div data-preloader-panel className="h-full w-1/3 bg-ink" />
      </div>

      <div
        data-preloader-meta
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5"
      >
        <div className="overflow-hidden">
          <p
            data-preloader-word
            className="font-display text-[clamp(2.5rem,10vw,7rem)] uppercase text-paper"
          >
            {PROFILE.fullName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-paper/30" />
          <span ref={counter} className="mono-label text-paper/60">
            000
          </span>
          <span className="h-px w-12 bg-paper/30" />
        </div>
      </div>
    </div>
  );
}
