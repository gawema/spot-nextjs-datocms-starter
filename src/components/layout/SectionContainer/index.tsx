'use client';

import '@/components/layout/SectionContainer/index.css';
import { useInViewReveal } from '@/lib/animations/useInViewReveal';
import { classList } from '@/lib/classList';
import { type ReactNode, useRef } from 'react';

/*
 * The frame every section sits in: page gutter, maximum width, and the vertical
 * rhythm above and below. Sections read their spacing from here instead of each
 * one inventing its own, and a full-bleed section simply does not use it.
 *
 * A client component only for the reveal: the sections themselves arrive
 * already rendered from the server as `children`, so what ships to the browser
 * is one observer, not the content.
 */

type Props = {
  children: ReactNode;
  className?: string;
  /** Drops the gutter and the maximum width, for sections that go edge to edge. */
  bleed?: boolean;
};

export default function SectionContainer({ children, className, bleed = false }: Props) {
  const section = useRef<HTMLElement>(null);
  const isInView = useInViewReveal(section);

  return (
    <section
      ref={section}
      className={classList([
        'section-container',
        bleed && 'section-container--bleed',
        isInView && 'is-in-view',
        className,
      ])}
    >
      <div className="section-container__inner">{children}</div>
    </section>
  );
}
