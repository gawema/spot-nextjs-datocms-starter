'use client';

import '@/components/layout/SectionContainer/index.css';
import { useInViewReveal } from '@/lib/animations/useInViewReveal';
import { classList } from '@/lib/classList';
import { type ReactNode, useRef } from 'react';

/*
 * The frame every section sits in: the width lane, and the vertical rhythm
 * above and below. Sections read both from here instead of each one inventing
 * its own max-width, and going edge to edge is a lane like any other.
 *
 * A client component only for the reveal: the sections themselves arrive
 * already rendered from the server as `children`, so what ships to the browser
 * is one observer, not the content.
 */

/** The lanes of `.layout-lanes`, in tokens/utilities.css. */
export type SectionWidth = 'measure' | 'content' | 'wide' | 'bleed';

type Props = {
  children: ReactNode;
  className?: string;
  width?: SectionWidth;
};

export default function SectionContainer({ children, className, width = 'content' }: Props) {
  const section = useRef<HTMLElement>(null);
  const isInView = useInViewReveal(section);

  return (
    <section
      ref={section}
      className={classList([
        'section-container',
        'layout-lanes',
        isInView && 'is-in-view',
        className,
      ])}
    >
      <div className="section-container__inner" data-lane={width}>
        {children}
      </div>
    </section>
  );
}
