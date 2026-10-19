import { useEffect, useRef } from 'react';
import { PROFILE, SOCIALS } from '../lib/content';
import { gsap, scrollToTop } from '../lib/scroll';
import Magnet from '../components/Magnet';
import Marquee from '../components/Marquee';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowUp, Instagram, Music2 } from 'lucide-react';

export default function Kontak() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('[data-footer-link]', { opacity: 1, y: 0 });
        gsap.set('[data-footer-wordmark]', { opacity: 1, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        '[data-footer-link]',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 70%' },
        },
      );
      gsap.fromTo(
        '[data-footer-wordmark]',
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 55%' },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const icons = [Instagram, Music2, ArrowUp];

  return (
    <footer id="kontak" ref={root} className="section-dark relative overflow-hidden pt-24 md:pt-32">
      <div className="shell">
        <div className="flex items-baseline gap-4">
          <span className="font-display text-[clamp(2.4rem,6vw,4.4rem)] text-paper">05</span>
          <div className="h-px flex-1 bg-paper/20" />
          <span className="mono-label !tracking-[0.28em] text-paper/55">KONTAK</span>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.9] text-paper">
              Terima kasih
              <br />
              sudah mampir!
            </h2>

            <ul className="mt-12 space-y-1">
              {SOCIALS.map((social, i) => {
                const Icon = icons[i] ?? Instagram;
                return (
                  <li key={social.label} data-footer-link>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="BUKA"
                      className="group flex items-center justify-between border-t border-paper/10 py-5"
                    >
                      <span className="flex items-center gap-4">
                        <Icon size={18} strokeWidth={1.5} className="text-paper/50" />
                        <span className="text-[1.05rem] text-paper/85 transition-colors group-hover:text-paper">
                          {social.label}
                        </span>
                      </span>
                      <span className="mono-label text-paper/55 transition-transform duration-300 group-hover:translate-x-1">
                        {'0' + (i + 1)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3">
              <p className="mono-label text-paper/55">{PROFILE.group}</p>
              <p className="mono-label text-paper/55">{PROFILE.birth}</p>
              <p className="mono-label text-paper/55">{PROFILE.projectBy}</p>
            </div>
          </div>

          <ScrollReveal className="flex flex-col items-start gap-6 lg:items-end">
            <Magnet strength={0.4}>
              <button
                type="button"
                onClick={scrollToTop}
                data-cursor="ATAS"
                className="group flex items-center gap-4 border border-paper/20 px-6 py-4 transition-colors hover:bg-paper hover:text-ink"
              >
                <span className="mono-label !tracking-[0.22em]">KEMBALI KE ATAS</span>
                <ArrowUp size={16} strokeWidth={1.5} className="transition-transform duration-300 group-hover:-translate-y-1" />
              </button>
            </Magnet>

            <div className="border border-paper/10 p-6">
              <p className="mono-label text-paper/55">NO. 001 — PORTRAIT</p>
              <p className="mt-3 max-w-xs text-[0.9rem] leading-relaxed text-paper/65">
                Terbuka untuk kolaborasi teater, media, dan event. Sapa lewat salah satu kanal di samping.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="relative mt-20">
        <Marquee speed={34} reverse>
          {[0, 1].map((i) => (
            <span key={i} className="flex items-center">
              <span className="font-display px-8 text-[clamp(4rem,16vw,15rem)] uppercase leading-none text-paper/[0.09]">
                {PROFILE.fullName}
              </span>
              <span className="font-display px-8 text-[clamp(4rem,16vw,15rem)] uppercase leading-none text-paper/[0.09]">
                {PROFILE.tagline}
              </span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 py-8">
          <p data-footer-wordmark className="mono-label text-paper/55">
            © {PROFILE.year} {PROFILE.projectBy}
          </p>
          <p data-footer-wordmark className="mono-label text-paper/55">
            {PROFILE.fullName} — {PROFILE.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
