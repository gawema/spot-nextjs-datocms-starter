'use client';

import '@/components/layout/PageTransition/index.css';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/*
 * A cross-fade between pages, done with the smallest thing that works: the
 * pathname is the key, so navigating remounts the wrapper and the CSS animation
 * plays again. No library, and no experimental Next flag.
 *
 * What this cannot do is animate the outgoing page, because it is already gone
 * by the time the new one mounts. That needs the View Transitions API, which is
 * worth revisiting once it is stable in Next.
 */

type Props = {
  children: ReactNode;
};

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
