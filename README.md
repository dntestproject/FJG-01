# Dawn — Portfolio

A recreation of the single-page idol portfolio shown in
`gustiawan.dev_2026-10-19-09-33-59_1792373639995.mp4`, rebuilt as a React app and
pushed further with **GSAP**, **Lenis** and **React Bits**-style components.

The original site is an Indonesian-language member portfolio. This rebuild keeps
that structure and tone but re-brands the identity to **Dawn** (`Dawn Amara`,
group `NOVA48`, "New Era").

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite 5 + React 18 + TypeScript |
| Styling | Tailwind CSS 3 + a small hand-written layer in `src/index.css` |
| Scroll | [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger |
| Motion components | React Bits-style components, reimplemented locally |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production bundle
```

## Sections

The page mirrors the reference recording, one section per nav entry:

| # | Section | Notes |
| --- | --- | --- |
| 01 | **Profil** | Bio, data table, portrait card, animated counters |
| 02 | **Aktivitas** | Three numbered rows (Teater / Media / Event) with spotlight hover |
| 03 | **Quote** | Dark statement with a per-word masked reveal |
| 04 | **Galeri** | Horizontally scrubbed gallery, pinned via ScrollTrigger |
| 05 | **Kontak** | Social links, back-to-top, oversized footer marquee |

A hero (giant split name wrapped around the portrait) and an intro preloader
sit above section 01.

## Motion architecture

`src/lib/scroll.ts` owns the scroll stack. It creates a single Lenis instance,
drives it from `gsap.ticker`, and forwards Lenis scroll events to
`ScrollTrigger.update` so pinned and scrubbed animations stay in sync with the
smoothed position. It also exposes `scrollToSection` / `scrollToTop` so nav
clicks animate through Lenis rather than jumping.

Every animated component falls back to its final state when
`prefers-reduced-motion: reduce` is set, and Lenis is torn down entirely in that
case.

### Components

React Bits-style components live in `src/components`:

- `ScrollReveal` — fade + lift + de-blur on enter
- `BlurText` / `SplitText` — word and character cascade reveals
- `Magnet` — cursor-attracted wrapper (`gsap.quickTo`)
- `Marquee` — seamless infinite CSS marquee
- `CountUp` — ScrollTrigger-gated number animation
- `TiltedCard` / `SpotlightCard` — 3D tilt and cursor spotlight
- `Aurora` — drifting gradient backdrop
- `Dock` — magnification dock used in the navbar
- `Cursor` / `ClickSpark` / `Preloader` — chrome and intro

## Imagery

No third-party photographs are bundled. All editorial imagery is generated
procedurally by `scripts/gen_assets.py` (duotone ink/paper with film grain) and
written to `public/img/`:

```bash
python3 scripts/gen_assets.py   # requires Pillow
```

Swap those files for real photography and the layout will pick them up
unchanged.

## Design tokens

Defined in `tailwind.config.js` and mirrored as CSS variables in
`src/index.css`:

- `ink` `#1f1f1f` — primary dark surface
- `paper` `#ededed` — primary light surface
- `slate` `#323947`, `indigo` `#3a3554` — muted accents
- Display type is Bebas Neue; UI text is Inter; labels use JetBrains Mono

## Accessibility

- The hero's decorative split name is `aria-hidden`; a real heading carries the
  text.
- All motion respects `prefers-reduced-motion`.
- Interactive elements are real buttons/links with labels.
