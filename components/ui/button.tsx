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
  iconStyle?: string;
  ariaLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
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
  iconStyle,
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
      {Icon && !flipped && <Icon className={iconStyle} />}
      {label}
      {Icon && flipped && <Icon className={iconStyle} />}
      {children}
    </button>
  );
}
