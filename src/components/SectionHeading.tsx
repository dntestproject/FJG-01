import type { ReactNode } from 'react';
import SplitText from './SplitText';

type Props = {
  index: string;
  title: string;
  className?: string;
  /** Rendered under the index row on the right. */
  aside?: ReactNode;
  dark?: boolean;
};

/** Shared section header: big index, hairline rule, and an animated title. */
export default function SectionHeading({ index, title, className = '', aside, dark = false }: Props) {
  const muted = dark ? 'text-paper/55' : 'text-ink/60';
  const strong = dark ? 'text-paper' : 'text-ink';
  const rule = dark ? 'bg-paper/20' : 'bg-ink/20';

  return (
    <div className={className}>
      <div className="flex items-baseline gap-4">
        <span className={`font-display text-[clamp(2.4rem,6vw,4.4rem)] ${strong}`}>{index}</span>
        <div className={`h-px flex-1 ${rule}`} />
        <span className={`mono-label !tracking-[0.28em] ${muted}`}>{title}</span>
      </div>
      <h2 className={`font-display mt-4 text-[clamp(2.2rem,7vw,6rem)] uppercase ${strong}`}>
        <SplitText text={title} splitBy="chars" stagger={0.028} />
      </h2>
      {aside ? <div className="mt-5">{aside}</div> : null}
    </div>
  );
}
