import { PROFILE_FACTS, PROFILE_PARAGRAPH, PROFILE, QUOTE } from '../lib/content';
import SectionHeading from '../components/SectionHeading';
import ScrollReveal from '../components/ScrollReveal';
import BlurText from '../components/BlurText';
import TiltedCard from '../components/TiltedCard';
import CountUp from '../components/CountUp';

export default function Profil() {
  return (
    <section id="profil" className="section-light relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          index="01"
          title="Profil"
          aside={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xl text-[0.9rem] leading-relaxed text-ink/70">
                <BlurText text={PROFILE_PARAGRAPH} stagger={0.022} />
              </p>
              <div className="text-right">
                <p className="mono-label text-ink/60">{PROFILE.portraitNo} — PORTRAIT</p>
                <p className="mono-label mt-1 text-ink/70">{PROFILE.group}</p>
              </div>
            </div>
          }
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <ScrollReveal>
            <p className="mono-label text-ink/60">Halo, aku</p>
            <h3 className="font-display mt-1 text-[clamp(3rem,9vw,7rem)] leading-[0.85] text-ink">
              {PROFILE.name}!
            </h3>

            <dl className="mt-10 grid grid-cols-2 gap-y-8 border-t border-ink/15 pt-8">
              {PROFILE_FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="mono-label text-ink/60">{fact.label}</dt>
                  <dd className="mt-2 text-[0.95rem] text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex items-center gap-8 border-t border-ink/15 pt-8">
              <div>
                <p className="font-display text-[3rem] leading-none text-ink">
                  <CountUp to={48} suffix="" />
                </p>
                <p className="mono-label mt-1 text-ink/60">Member NOVA48</p>
              </div>
              <div>
                <p className="font-display text-[3rem] leading-none text-ink">
                  <CountUp to={3} />
                </p>
                <p className="mono-label mt-1 text-ink/60">Pilar aktivitas</p>
              </div>
              <div>
                <p className="font-display text-[3rem] leading-none text-ink">
                  <CountUp to={8} />
                </p>
                <p className="mono-label mt-1 text-ink/60">Potret galeri</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-8">
            <TiltedCard className="w-full" maxTilt={7}>
              <figure className="relative overflow-hidden bg-ink">
                <img
                  src="/img/portrait-card.jpg"
                  alt="Potret Dawn untuk kartu profil"
                  className="duotone-img aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
                  <span className="mono-label text-paper/85">{PROFILE.fullName}</span>
                  <span className="mono-label text-paper/55">{PROFILE.portraitNo}</span>
                </figcaption>
              </figure>
            </TiltedCard>

            <ScrollReveal delay={0.1}>
              <blockquote className="border border-ink/15 p-6">
                <p className="mono-label text-ink/60">PERKENALAN</p>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink">{PROFILE.quote}</p>
                <footer className="mono-label mt-4 text-ink/50">{QUOTE.attribution}</footer>
              </blockquote>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
