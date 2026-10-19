import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';

type Props = {
  text: string;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  delay?: number;
  start?: string;
};

/**
 * Word-by-word blur-in, a ScrollTrigger-aware take on React Bits' <BlurText />.
 */
export default function BlurText({
  text,
  className = '',
  stagger = 0.08,
  delay = 0,
  start = 'top 85%',
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>('[data-word]');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(words, { opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    const tween = gsap.fromTo(
      words,
      { opacity: 0, y: 22, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.85,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: { trigger: el, start },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, stagger, start, text]);

  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block">
          <span data-word className="inline-block will-change-transform" style={{ opacity: 0 }}>
            {word}
          </span>
          {i < text.split(' ').length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </span>
  );
}
