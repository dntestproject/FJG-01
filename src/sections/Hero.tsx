import { useEffect, useRef } from 'react';
import { gsap } from '../lib/scroll';
import { NEWS, PROFILE, QUOTE } from '../lib/content';
import Aurora from '../components/Aurora';
import Magnet from '../components/Magnet';
import Marquee from '../components/Marquee';

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('[data-hero-letter]', { yPercent: 118, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.35, stagger: 0.07 })
        .fromTo('[data-hero-portrait]', { scale: 1.14, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5 }, 0.15)
        .fromTo('[data-hero-fade]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.07 }, 0.45)
        .fromTo('[data-hero-line]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, transformOrigin: 'left center' }, 0.3);

      // Portrait drifts slower than the page for depth.
      gsap.to('[data-hero-portrait-inner]', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('[data-hero-bigname]', {
        yPercent: -8,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'center center', end: 'bottom top', scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="section-dark relative min-h-[100svh] overflow-hidden pt-24"
    >
      <Aurora className="absolute inset-0 -z-0 opacity-70" />

      {/* Top meta row */}
      <div className="shell relative z-10 flex flex-wrap items-start justify-between gap-4 pt-6">
        <div data-hero-fade className="max-w-[16rem]">
          <div className="flex items-start gap-3">
            <span className="font-display text-[3.2rem] leading-[0.8] text-paper">48</span>
            <div className="pt-1">
              <p className="mono-label !tracking-[0.2em] text-paper/50">NOVA48</p>
              <p className="mono-label !tracking-[0.2em] text-paper/80">{PROFILE.era}</p>
            </div>
          </div>
          <p className="mt-4 max-w-[15rem] text-[0.82rem] leading-relaxed text-paper/60">{PROFILE.quote}</p>
          <p className="mt-3 text-[0.82rem] font-medium text-paper">{PROFILE.greeting}</p>
        </div>

        <div data-hero-fade className="text-right">
          <p className="mono-label text-paper/70">{PROFILE.birth}</p>
          <p className="mono-label mt-1 text-paper/55">{PROFILE.projectBy}</p>
        </div>
      </div>

      {/* Giant name split around the portrait */}
      <div className="relative z-10 mt-2 md:mt-4">
        <div
          data-hero-bigname
          className="shell relative"
          aria-label={`${PROFILE.fullName} ${PROFILE.tagline}`}
        >
          <h1 className="sr-only">
            {PROFILE.fullName} — {PROFILE.tagline}
          </h1>

          <div className="relative flex w-full items-center justify-between">
            <div className="flex shrink-0 overflow-hidden">
              {'DA'.split('').map((ch, i) => (
                <span
                  key={i}
                  data-hero-letter
                  aria-hidden
                  className="font-display block text-[clamp(5rem,23vw,19rem)] text-paper"
                >
                  {ch}
                </span>
              ))}
            </div>

            <div
              data-hero-portrait
              className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(15rem,44vw,34rem)] w-[clamp(7rem,21vw,17rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden"
            >
              <div data-hero-portrait-inner className="absolute inset-[-8%]">
                <img
                  src="/img/hero-portrait.jpg"
                  alt="Potret Dawn"
                  className="duotone-img h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <span className="mono-label absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-paper/80">
                {PROFILE.portraitNo}
              </span>
            </div>

            <div className="flex shrink-0 overflow-hidden">
              {'WN'.split('').map((ch, i) => (
                <span
                  key={i}
                  data-hero-letter
                  aria-hidden
                  className="font-display block text-[clamp(5rem,23vw,19rem)] text-paper"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rows */}
      <div className="shell relative z-10 mt-6 pb-14 md:mt-10">
        <div data-hero-line className="h-px w-full bg-paper/15" />
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div data-hero-fade>
            <p className="font-display text-2xl tracking-wide text-paper">Current News!!</p>
            <p className="mt-2 max-w-md text-[0.84rem] leading-relaxed text-paper/60">{NEWS}</p>
          </div>
          <div data-hero-fade className="md:text-right">
            <p className="mono-label text-paper/50">{QUOTE.eyebrow}</p>
            <p className="mt-2 font-display text-[clamp(1.4rem,3.4vw,2.4rem)] text-paper">
              {QUOTE.headline}
            </p>
            <p className="mono-label mt-1 text-paper/55">{QUOTE.attribution}</p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <Magnet className="pointer-events-none absolute bottom-8 right-6 z-10 hidden lg:block" strength={0.5}>
        <div className="flex flex-col items-center gap-3">
          <span className="mono-label writing-vertical !tracking-[0.3em] text-paper/50">SCROLL</span>
          <span className="block h-10 w-px bg-gradient-to-b from-paper/60 to-transparent" />
        </div>
      </Magnet>

      <div className="relative z-10 border-y border-paper/10 py-3">
        <Marquee speed={30}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center">
              {[PROFILE.fullName, PROFILE.group, PROFILE.nickname, PROFILE.era].map((word, j) => (
                <span key={`${word}-${j}`} className="flex items-center">
                  <span className="font-display px-6 text-[clamp(1.1rem,2vw,1.6rem)] tracking-wide text-paper/50">
                    {word}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-paper/25" />
                </span>
              ))}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
