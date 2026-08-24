import '@/components/ui/Checkbox/index.css';
import { classList } from '@/lib/classList';
import type { InputHTMLAttributes, ReactNode } from 'react';

/*
 * A real `<input type="checkbox">`, visually hidden behind a styled box, with
 * the whole thing wrapped in a label. That buys form submission, the native
 * keyboard behaviour and screen-reader semantics for free, and keeps this a
 * server component: no state, no handler, no JavaScript shipped.
 *
 * Camping renders a `<button role="checkbox">` instead, to control the visuals
 * completely. It does not submit inside a form, which for a starter is the
 * wrong default.
 */

type Props = {
  label?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ label, className, ...props }: Props) {
  return (
    <label className={classList(['ui-checkbox', className])}>
      <input {...props} type="checkbox" className="ui-checkbox__input" />
      <span className="ui-checkbox__control" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="ui-checkbox__icon">
          <path
            fill="currentColor"
            d="M6.3 11.1 2.9 7.7l1.1-1.1 2.3 2.3 5.7-5.7 1.1 1.1-6.8 6.8Z"
          />
        </svg>
      </span>
      {label ? <span className="ui-checkbox__label">{label}</span> : null}
    </label>
  );
}
