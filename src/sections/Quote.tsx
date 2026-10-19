import { useEffect, useRef } from 'react';
import { QUOTE } from '../lib/content';
import { gsap } from '../lib/scroll';
import BlurText from '../components/BlurText';

export default function Quote() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-quote-word]', { opacity: 1, yPercent: 0 });
        return;
      }
      gsap.fromTo(
        '[data-quote-word]',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.055,
          scrollTrigger: { trigger: el, start: 'top 62%' },
        },
      );
      gsap.to('[data-quote-glow]', {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const words = QUOTE.headline.split(' ');

  return (
    <section id="quote" ref={root} className="section-dark relative overflow-hidden py-28 md:py-40">
      <div
        data-quote-glow
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/4 h-[36rem] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(58,53,84,0.5),transparent_70%)] blur-2xl"
      />

      <div className="shell relative z-10">
        <div className="flex items-center gap-4">
          <span className="mono-label !tracking-[0.28em] text-paper/55">03</span>
          <span className="h-px flex-1 bg-paper/20" />
          <span className="mono-label !tracking-[0.28em] text-paper/55">THE QUESTION IS</span>
        </div>

        <h2 className="mt-10 font-display text-[clamp(2.6rem,9vw,8rem)] uppercase leading-[0.88] text-paper">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
              <span data-quote-word className="inline-block will-change-transform">
                {word}
              </span>
              <span className="inline-block">&nbsp;</span>
            </span>
          ))}
        </h2>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-[0.9rem] leading-relaxed text-paper/55">
            <BlurText
              text="Kalimat yang Dawn pegang di setiap latihan, panggung, dan hari yang panjang."
              stagger={0.025}
            />
          </p>
          <p className="mono-label text-paper/55">{QUOTE.attribution}</p>
        </div>
      </div>
    </section>
  );
}
