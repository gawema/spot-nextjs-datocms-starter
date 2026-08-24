import '@/components/layout/SectionContainer/index.css';
import { classList } from '@/lib/classList';
import type { ReactNode } from 'react';

/*
 * The frame every section sits in: page gutter, maximum width, and the vertical
 * rhythm above and below. Sections read their spacing from here instead of each
 * one inventing its own, and a full-bleed section simply does not use it.
 */

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionContainer({ children, className }: Props) {
  return (
    <section className={classList(['section-container', className])}>
      <div className="section-container__inner">{children}</div>
    </section>
  );
}
