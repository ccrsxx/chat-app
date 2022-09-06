import cn from 'clsx';

type TriangleProps = {
  isCurrentUser?: boolean;
};

export function Triangle({ isCurrentUser }: TriangleProps): JSX.Element {
  return (
    <span
      className={cn(
        'absolute top-0 h-0 w-4 border-8 border-t-bubble',
        'border-l-transparent border-r-bubble border-b-transparent',
        {
          '-right-2 -rotate-90': isCurrentUser,
          '-left-2': !isCurrentUser
        }
      )}
    />
  );
}
