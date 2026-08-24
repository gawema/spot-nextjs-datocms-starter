import '@/components/ui/Toggle/index.css';
import { classList } from '@/lib/classList';
import type { InputHTMLAttributes, ReactNode } from 'react';

/*
 * A checkbox that says it is a switch. `role="switch"` changes how it is
 * announced (on/off instead of checked/unchecked) without changing what it is,
 * so it still submits and still works from the keyboard.
 */

type Props = {
  label?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Toggle({ label, className, ...props }: Props) {
  return (
    <label className={classList(['ui-toggle', className])}>
      <input {...props} type="checkbox" role="switch" className="ui-toggle__input" />
      <span className="ui-toggle__track" aria-hidden="true">
        <span className="ui-toggle__thumb" />
      </span>
      {label ? <span className="ui-toggle__label">{label}</span> : null}
    </label>
  );
}
