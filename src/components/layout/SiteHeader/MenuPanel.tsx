'use client';

import Button from '@/components/ui/Button';
import { type ReactNode, useEffect, useRef, useState } from 'react';

/*
 * The navigation panel.
 *
 * It owns nothing but the open state: the menu itself arrives already rendered
 * from the server as `children`, so the only JavaScript shipped is the opening.
 *
 * The panel is a native `<dialog>` opened with `showModal()`, which hands us the
 * focus trap, Escape, and the inertness of everything behind it for free. A
 * hand-written trap would be more code and worse. Locking the page scroll is a
 * single CSS rule on `body:has(dialog[open])`, so that is not here either.
 *
 * Whether the panel replaces the row at every width, and which edge it comes
 * from, are decided by the Layout record in the CMS and arrive as data
 * attributes: the CSS reads them, this component does not branch on them.
 */

type Props = {
  label: string;
  closeLabel: string;
  style: string;
  position: string;
  children: ReactNode;
};

export default function MenuPanel({ label, closeLabel, style, position, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;

    if (!element) {
      return;
    }

    if (isOpen && !element.open) {
      element.showModal();
    }

    if (!isOpen && element.open) {
      element.close();
    }
  }, [isOpen]);

  return (
    <div className="menu-panel" data-style={style} data-position={position}>
      <Button
        className="menu-panel__toggle"
        variant="ghost"
        size="small"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>

      {/*
       * `onClose` keeps our state in step when the dialog is dismissed by the
       * browser, on Escape or on a backdrop click. Clicking anywhere inside,
       * a link included, closes it too.
       */}
      <dialog
        ref={dialog}
        className="menu-panel__dialog"
        aria-label={label}
        onClose={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
      >
        <div className="menu-panel__body">
          <Button
            className="menu-panel__close"
            variant="ghost"
            size="small"
            onClick={() => setIsOpen(false)}
          >
            {closeLabel}
          </Button>
          {children}
        </div>
      </dialog>
    </div>
  );
}
