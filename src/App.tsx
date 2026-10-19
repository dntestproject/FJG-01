import { useEffect, useState } from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Profil from './sections/Profil';
import Aktivitas from './sections/Aktivitas';
import Quote from './sections/Quote';
import Galeri from './sections/Galeri';
import Kontak from './sections/Kontak';
import Cursor from './components/Cursor';
import ClickSpark from './components/ClickSpark';
import Preloader from './components/Preloader';
import { ScrollTrigger, useSmoothScroll } from './lib/scroll';

export default function App() {
  useSmoothScroll();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Fonts and images settle after first paint; refresh triggers once stable.
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', refresh);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [ready]);

  return (
    <div className="grain relative bg-ink">
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <ClickSpark />
      <Navbar />
      <main>
        <Hero />
        <Profil />
        <Aktivitas />
        <Quote />
        <Galeri />
      </main>
      <Kontak />
    </div>
  );
}
