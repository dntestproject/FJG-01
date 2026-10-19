import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  text: string;
  className?: string;
  /** 'chars' gives a tighter editorial cascade than words. */
  splitBy?: 'chars' | 'words';
  stagger?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

/**
 * Masked line/char cascade reveal. Inspired by React Bits' <SplitText />.
 * Each character is wrapped in an overflow-hidden span so it slides up
 * from behind its own baseline.
 */
export default function SplitText({
  text,
  className = '',
  splitBy = 'chars',
  stagger = 0.03,
  delay = 0,
  duration = 0.9,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const units = el.querySelectorAll<HTMLElement>('[data-unit]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(units, { yPercent: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      units,
      { yPercent: 118, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: 'expo.out',
        stagger,
        delay,
        scrollTrigger: { trigger: el, start },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, duration, splitBy, stagger, start, text]);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block overflow-hidden align-bottom">
          {splitBy === 'words' ? (
            <span data-unit className="inline-block will-change-transform">
              {word}
            </span>
          ) : (
            word.split('').map((ch, ci) => (
              <span key={`${ch}-${ci}`} data-unit className="inline-block will-change-transform">
                {ch}
              </span>
            ))
          )}
          {wi < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}
