import { useEffect, useRef } from 'react';
import { GALLERY } from '../lib/content';
import { gsap } from '../lib/scroll';
import TiltedCard from '../components/TiltedCard';

export default function Galeri() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionEl = root.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        // No pin means the track would be stranded off-screen, so hand it back
        // to native horizontal scrolling instead.
        const scroller = trackEl.parentElement;
        if (scroller) {
          scroller.classList.add('overflow-x-auto', 'no-scrollbar');
          gsap.set(scroller, { overscrollBehaviorX: 'contain' });
        }
        return;
      }

      const getDistance = () => trackEl.scrollWidth - window.innerWidth + 64;

      gsap.to(trackEl, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.fromTo(
        '[data-gallery-card]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionEl, start: 'top 70%' },
        },
      );
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section id="galeri" ref={root} className="section-light relative overflow-hidden">
      <div className="shell pt-24 md:pt-32">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-[clamp(2.4rem,6vw,4.4rem)] text-ink">04</span>
          <div className="h-px flex-1 bg-ink/20" />
          <span className="mono-label !tracking-[0.28em] text-ink/60">GALERI</span>
        </div>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.2rem,7vw,6rem)] uppercase text-ink">Potret Dawn</h2>
          <p className="mono-label flex items-center gap-3 text-ink/60">
            <span className="hidden h-px w-10 bg-ink/30 md:block" />
            GESER UNTUK MELIHAT
          </p>
        </div>
      </div>

      <div className="mt-14 pb-24 md:pb-32">
        <div ref={track} className="flex w-max gap-5 pl-[max(1rem,4vw)] pr-16 will-change-transform">
          {GALLERY.map((item, i) => (
            <figure
              key={item.no}
              data-gallery-card
              className={`relative shrink-0 overflow-hidden bg-ink ${
                i % 2 === 0 ? 'h-[62vh] w-[74vw] sm:w-[44vw] lg:w-[30vw]' : 'h-[52vh] w-[62vw] self-end sm:w-[36vw] lg:w-[24vw]'
              }`}
            >
              <TiltedCard className="h-full w-full" maxTilt={6} scaleOnHover={1.0}>
                <img
                  src={item.src}
                  alt={`${item.label} — potret Dawn`}
                  className="duotone-img h-full w-full object-cover"
                  loading="lazy"
                />
              </TiltedCard>
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/85 to-transparent px-5 pb-4 pt-10">
                <span className="mono-label text-paper/90">{item.label}</span>
                <span className="mono-label text-paper/55">{item.no}</span>
              </figcaption>
            </figure>
          ))}

          <div className="flex h-[62vh] shrink-0 items-center">
            <p className="font-display text-[clamp(2rem,5vw,4rem)] uppercase leading-none text-ink/35">
              NOVA48
              <br />
              NEW ERA
              <br />
              {GALLERY.length} POTRET
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
