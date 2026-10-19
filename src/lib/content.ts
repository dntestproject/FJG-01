export const PROFILE = {
  name: 'Dawn',
  fullName: 'Dawn Amara',
  tagline: 'Portfolio',
  group: 'NOVA48',
  era: 'New Era',
  nickname: 'Fajar',
  birth: 'Bandung, 09-01-2006',
  birthShort: '09-01-2006',
  city: 'Bandung',
  quote: 'Seperti fajar yang selalu dinanti semua orang, selalu nantikan aku ya!',
  greeting: 'Halo aku Dawn!',
  portraitNo: 'NO. 001',
  projectBy: 'Project By Nusantara',
  year: '2026',
} as const;

export const NAV = [
  { id: 'profil', index: '01', label: 'PROFIL' },
  { id: 'aktivitas', index: '02', label: 'AKTIVITAS' },
  { id: 'quote', index: '03', label: 'QUOTE' },
  { id: 'galeri', index: '04', label: 'GALERI' },
  { id: 'kontak', index: '05', label: 'KONTAK' },
] as const;

export const NEWS =
  'Dawn adalah member NOVA48 yang dijuluki sebagai fajar hidup karena auranya yang sangat hangat.';

export const PROFILE_PARAGRAPH =
  'Dawn Amara adalah member NOVA48 yang dijuluki sebagai fajar hidup karena auranya yang sangat hangat. Lahir di Bandung, saat ini ia aktif di berbagai kegiatan teater dan media.';

export const PROFILE_FACTS = [
  { label: 'NAMA', value: 'Dawn Amara' },
  { label: 'LAHIR', value: 'Bandung, 9 Januari 2006' },
  { label: 'GRUP', value: 'NOVA48' },
  { label: 'JULUKAN', value: 'Fajar hidup' },
] as const;

export const ACTIVITIES = [
  {
    index: '01',
    title: 'Teater',
    body: 'Tampil di panggung teater NOVA48 bersama member lainnya.',
  },
  {
    index: '02',
    title: 'Media',
    body: 'Hadir di berbagai konten dan program media.',
  },
  {
    index: '03',
    title: 'Event',
    body: 'Bertemu penggemar di berbagai event dan acara NOVA48.',
  },
] as const;

export const QUOTE = {
  eyebrow: 'The Question Is:',
  headline: "It's not impossible, it's just hard.",
  attribution: '-Dawn Amara-',
} as const;

export const GALLERY = [
  { no: 'NO. 01', label: 'STREET', src: '/img/g1.jpg' },
  { no: 'NO. 02', label: 'SELFIE', src: '/img/g2.jpg' },
  { no: 'NO. 03', label: 'EDITORIAL', src: '/img/g3.jpg' },
  { no: 'NO. 04', label: 'GOLDEN HOUR', src: '/img/g4.jpg' },
  { no: 'NO. 05', label: 'THEATER', src: '/img/g5.jpg' },
  { no: 'NO. 06', label: 'COSTUME', src: '/img/g6.jpg' },
  { no: 'NO. 07', label: 'BACKSTAGE', src: '/img/g7.jpg' },
  { no: 'NO. 08', label: 'PORTRAIT', src: '/img/g8.jpg' },
] as const;

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
  { label: 'X/Twitter', href: 'https://x.com' },
] as const;
