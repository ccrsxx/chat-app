import cn from 'clsx';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

type ButtonProps = {
  Icon?: IconType;
  id?: string;
  type?: 'button' | 'submit' | 'reset';
  label?: string;
  flipped?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  children?: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

export function Button({
  Icon,
  id,
  type,
  label,
  flipped,
  disabled,
  tabIndex,
  children,
  className,
  ariaLabel,
  onClick
}: ButtonProps): JSX.Element {
  return (
    <button
      id={id}
      className={cn('smooth-tab smooth-hover custom-button', className)}
      aria-label={ariaLabel}
      type={type ?? 'button'}
      onClick={onClick}
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {Icon && !flipped && <Icon />}
      {label}
      {Icon && flipped && <Icon />}
      {children}
    </button>
  );
}
