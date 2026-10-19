import { useEffect, useRef } from 'react';
import { ACTIVITIES } from '../lib/content';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';
import SpotlightCard from '../components/SpotlightCard';
import { gsap } from '../lib/scroll';
import { ArrowUpRight } from 'lucide-react';

export default function Aktivitas() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-activity-row]', { opacity: 1, y: 0 });
        gsap.set('[data-activity-line]', { scaleX: 1 });
        return;
      }

      gsap.utils.toArray<HTMLElement>('[data-activity-row]').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
          },
        );
        const line = row.querySelector('[data-activity-line]');
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power3.inOut',
              transformOrigin: 'left center',
              scrollTrigger: { trigger: row, start: 'top 88%' },
            },
          );
        }
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="aktivitas" ref={root} className="section-light relative pb-24 md:pb-32">
      <div className="shell">
        <SectionHeading
          index="02"
          title="Aktivitas"
          aside={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-display text-[clamp(1.8rem,4vw,3rem)] text-ink">Di atas panggung</h3>
              <p className="max-w-md text-[0.88rem] leading-relaxed text-ink/60">
                Dari teater sampai layar kaca — tempat-tempat Dawn bisa kamu temui.
              </p>
            </div>
          }
        />

        <div className="mt-14">
          {ACTIVITIES.map((item) => (
            <ScrollReveal key={item.index} className="block">
              <SpotlightCard
                color="rgba(58,53,84,0.14)"
                className="block border-t border-ink/15"
              >
                <article
                  data-activity-row
                  className="group relative grid items-start gap-6 py-10 md:grid-cols-[auto_1fr_auto] md:gap-12 md:py-14"
                >
                  <span className="font-display text-[clamp(2rem,4vw,3.2rem)] text-ink/35">
                    {item.index}
                  </span>
                  <div>
                    <h4 className="font-display text-[clamp(2rem,5vw,3.6rem)] uppercase leading-none text-ink transition-transform duration-500 group-hover:translate-x-2">
                      {item.title}
                    </h4>
                    <p className="mt-4 max-w-lg text-[0.9rem] leading-relaxed text-ink/65">{item.body}</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-all duration-500 group-hover:bg-ink group-hover:text-paper">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </span>
                  <span
                    data-activity-line
                    className="absolute inset-x-0 bottom-0 h-px bg-ink/10 md:hidden"
                  />
                </article>
              </SpotlightCard>
            </ScrollReveal>
          ))}
          <div className="h-px w-full bg-ink/15" />
        </div>
      </div>
    </section>
  );
}
