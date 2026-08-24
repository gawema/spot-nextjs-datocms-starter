'use client';

import Button from '@/components/ui/Button';
import { type ReactNode, useEffect, useId, useState } from 'react';

/*
 * Owns nothing but the open/closed state, so the navigation itself stays a
 * server component and arrives here already rendered as `children`. The only
 * JavaScript this ships is the toggle.
 *
 * Closing happens on any click inside the panel, which covers following a link
 * without watching the pathname, and on Escape.
 */

type Props = {
  label: string;
  children: ReactNode;
};

export default function MobileMenu({ label, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <div className="mobile-menu" data-open={isOpen ? '' : undefined}>
      <Button
        className="mobile-menu__toggle"
        variant="ghost"
        size="small"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </Button>

      {/* Click anywhere inside, a link included, and the panel closes. */}
      <div className="mobile-menu__panel" id={panelId} onClick={() => setIsOpen(false)}>
        {children}
      </div>
    </div>
  );
}
