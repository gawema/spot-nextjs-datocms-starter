import '@/components/ui/Radio/index.css';
import { classList } from '@/lib/classList';
import type { InputHTMLAttributes, ReactNode } from 'react';

/*
 * Same pattern as Checkbox, on a native radio. `name` is required because it is
 * what makes a group a group: without it the browser has nothing to toggle
 * between, and arrow-key navigation stops working.
 */

type Props = {
  label?: ReactNode;
  name: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Radio({ label, className, ...props }: Props) {
  return (
    <label className={classList(['ui-radio', className])}>
      <input {...props} type="radio" className="ui-radio__input" />
      <span className="ui-radio__control" aria-hidden="true">
        <span className="ui-radio__dot" />
      </span>
      {label ? <span className="ui-radio__label">{label}</span> : null}
    </label>
  );
}
