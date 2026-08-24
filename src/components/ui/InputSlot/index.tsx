import '@/components/ui/InputSlot/index.css';
import { classList } from '@/lib/classList';
import type { InputHTMLAttributes, ReactNode } from 'react';

/*
 * A text field in a framed slot, with room for an icon on either side.
 *
 * Wrapping the whole slot in a label keeps this a server component: no `useId`,
 * no `htmlFor`, and clicking anywhere in the frame focuses the input. Camping's
 * version defaults to a mail icon and bundles a password-visibility toggle,
 * both of which belong to the project that needs them, not to the primitive.
 */

type Props = {
  label?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputSlot({
  label,
  leadingIcon,
  trailingIcon,
  className,
  type = 'text',
  ...props
}: Props) {
  return (
    <label className={classList(['ui-input-slot', className])}>
      {leadingIcon ? <span className="ui-input-slot__icon">{leadingIcon}</span> : null}
      <span className="ui-input-slot__content">
        {label ? <span className="ui-input-slot__label">{label}</span> : null}
        <input {...props} type={type} className="ui-input-slot__input" />
      </span>
      {trailingIcon ? <span className="ui-input-slot__icon">{trailingIcon}</span> : null}
    </label>
  );
}
