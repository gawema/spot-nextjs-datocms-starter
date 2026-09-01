'use client';

import '@/components/ui/Carousel/index.css';
import { classList } from '@/lib/classList';
import useEmblaCarousel from 'embla-carousel-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

/*
 * A real carousel, on embla: drag with a pointer, swipe on touch, snap points it
 * actually knows about, and buttons that disable themselves at the ends.
 *
 * It owns only the behaviour. The slides arrive already rendered from the
 * server as `children`, so the images are still server components, and the
 * labels come in as props rather than being read from the CMS here.
 */

type Props = {
  children: ReactNode;
  previousLabel: string;
  nextLabel: string;
  /** Accessible name for the whole carousel, usually the section heading. */
  label?: string;
};

export default function Carousel({ children, previousLabel, nextLabel, label }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const sync = useCallback((api: NonNullable<typeof embla>) => {
    setSnaps(api.scrollSnapList());
    setSelected(api.selectedScrollSnap());
    setCanScrollPrevious(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!embla) {
      return;
    }

    embla.on('select', sync).on('reInit', sync);

    /*
     * Subscribe first, then ask embla to emit once, so the initial values arrive
     * through the same path as every later one. Setting them from inside the
     * effect instead would be a synchronous setState, which is both a lint error
     * and an extra render.
     */
    embla.reInit();

    return () => {
      embla.off('select', sync).off('reInit', sync);
    };
  }, [embla, sync]);

  return (
    <div className="carousel" role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel__viewport" ref={emblaRef}>
        <div className="carousel__track">{children}</div>
      </div>

      <div className="carousel__controls">
        <div className="carousel__dots">
          {snaps.map((snap, index) => (
            <button
              // The snap position is the stable identity of a dot.
              key={snap}
              type="button"
              className={classList(['carousel__dot', index === selected && 'is-selected'])}
              aria-label={`${index + 1}`}
              aria-current={index === selected ? 'true' : undefined}
              onClick={() => embla?.scrollTo(index)}
            />
          ))}
        </div>

        <div className="carousel__arrows">
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => embla?.scrollPrev()}
            disabled={!canScrollPrevious}
            aria-label={previousLabel}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M10 3l1.1 1.1L7.2 8l3.9 3.9L10 13l-5-5 5-5Z" />
            </svg>
          </button>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => embla?.scrollNext()}
            disabled={!canScrollNext}
            aria-label={nextLabel}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M6 3l5 5-5 5-1.1-1.1L8.8 8 4.9 4.1 6 3Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
