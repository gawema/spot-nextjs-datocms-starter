'use client';

import { type RefObject, useEffect, useState } from 'react';

type InViewOptions = {
  /** IntersectionObserver `threshold`. Default 0. */
  threshold?: number | number[];
  /**
   * IntersectionObserver `rootMargin`. Default `'0px 0px -20% 0px'`, so the
   * trigger fires once the element is meaningfully inside the viewport rather
   * than the instant its top edge appears.
   */
  rootMargin?: string;
};

/**
 * True once the element has entered the viewport, and true from then on: a
 * reveal that plays a second time on the way back up reads as a glitch.
 *
 * Pair it with a class on the element, and keep the revealed state as the CSS
 * default so that anything without JavaScript, and anything asking for reduced
 * motion, simply sees the content.
 *
 * There is no fallback for a browser without IntersectionObserver: one that old
 * would already be failing on the `:has()` and `<dialog>` this project relies
 * on, so pretending to support it here would be theatre.
 */
export function useInViewReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { threshold = 0, rootMargin = '0px 0px -20% 0px' }: InViewOptions = {},
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || isInView) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref, isInView, threshold, rootMargin]);

  return isInView;
}
