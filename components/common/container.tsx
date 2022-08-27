import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
};

export function Container({ children }: ContainerProps): JSX.Element {
  return (
    <div className='flex h-screen justify-center bg-background p-3 md:p-4'>
      <div className='flex w-full max-w-4xl flex-col gap-2 rounded-lg bg-main p-2 md:p-4'>
        {children}
      </div>
    </div>
  );
}
