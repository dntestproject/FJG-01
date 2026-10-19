import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Scroll to a section by element id, routed through Lenis when available. */
export function scrollToSection(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.35 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function scrollToTop() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration: 1.5 });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Boots Lenis and wires it to GSAP's ticker so ScrollTrigger stays in sync
 * with the smoothed scroll position instead of the native one.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    const teardown = () => {
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
      lenis = null;
      raf = null;
      lenisInstance = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };

    const setup = () => {
      if (lenis) return;
      lenis = new Lenis({
        duration: 1.15,
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      lenisInstance = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add('lenis', 'lenis-smooth');
    };

    const apply = () => (query.matches ? teardown() : setup());
    apply();
    query.addEventListener('change', apply);

    return () => {
      query.removeEventListener('change', apply);
      teardown();
    };
  }, []);

  return ScrollTrigger;
}

export { gsap, ScrollTrigger };
