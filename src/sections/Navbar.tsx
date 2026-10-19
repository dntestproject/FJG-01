import { useEffect, useRef, useState } from 'react';
import { NAV, PROFILE } from '../lib/content';
import { gsap, scrollToSection } from '../lib/scroll';
import Dock from '../components/Dock';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nav-item]',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, delay: 0.2, ease: 'power3.out' },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-500 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled ? 'border-b border-paper/10 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between gap-6 py-4">
          <button
            type="button"
            data-nav-item
            data-cursor="TOP"
            onClick={() => scrollToSection('hero')}
            className="group flex items-baseline gap-2 text-left"
          >
            <span className="mono-label !tracking-[0.18em] text-paper">{PROFILE.name}</span>
            <span className="mono-label hidden !tracking-[0.18em] text-paper/55 sm:inline">
              {PROFILE.fullName} — {PROFILE.tagline}
            </span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <li key={item.id} data-nav-item>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="group relative flex items-center gap-1.5 px-3 py-2"
                >
                  <span className="mono-label !text-[0.6rem] text-paper/55 transition-colors group-hover:text-paper">
                    {item.index}
                  </span>
                  <span className="mono-label !tracking-[0.16em] text-paper/75 transition-colors group-hover:text-paper">
                    {item.label}
                  </span>
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-paper transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              </li>
            ))}
          </ul>

          <div data-nav-item className="hidden md:block">
            <Dock items={NAV} onNavigate={scrollToSection} />
          </div>
        </nav>
      </div>
    </header>
  );
}
