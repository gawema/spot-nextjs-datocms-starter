'use client';

import '@/components/ui/Button/index.css';
import { classList } from '@/lib/classList';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/*
 * A client component even though it holds no state: a button exists to be
 * clicked, and an `onClick` cannot be handed to it from a server component.
 * Rendering it inside one is fine.
 */

type Props = {
  variant?: 'fill' | 'outline' | 'ghost';
  size?: 'base' | 'small';
  /** Renders a square button holding only the icon, sized from `size`. */
  iconOnly?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = 'fill',
  size = 'base',
  iconOnly = false,
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...props
}: Props) {
  const icon = leftIcon ?? rightIcon;

  return (
    <button
      {...props}
      type={type}
      className={classList([
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        iconOnly && 'ui-button--icon-only',
        className,
      ])}
    >
      {iconOnly ? (
        <span className="ui-button__icon">{icon}</span>
      ) : (
        <>
          {leftIcon ? <span className="ui-button__icon">{leftIcon}</span> : null}
          <span>{children}</span>
          {rightIcon ? <span className="ui-button__icon">{rightIcon}</span> : null}
        </>
      )}
    </button>
  );
}
