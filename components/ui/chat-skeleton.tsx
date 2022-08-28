import cn from 'clsx';
import { ImageSkeleton } from './image-skeleton';
import { Triangle } from './triangle';
import type { Ref } from 'react';

const listOfSkeletons = [
  {
    image: false,
    edit: true
  },
  {
    image: true,
    edit: false
  },
  {
    image: false,
    edit: false
  }
];

type ChatSkeletonProps = {
  visible: boolean;
  topSkeleton: Ref<HTMLDivElement>;
};

export function ChatSkeleton({
  visible,
  topSkeleton
}: ChatSkeletonProps): JSX.Element {
  return (
    <div
      className={cn('flex-col gap-3 md:gap-4', visible ? 'flex' : 'hidden')}
      ref={topSkeleton}
    >
      {listOfSkeletons.map(({ image, edit }, index) => (
        <Skeleton image={image} edit={edit} key={index} />
      ))}
    </div>
  );
}

type SkeletonProps = {
  image?: boolean;
  edit?: boolean;
};

function Skeleton({ image, edit }: SkeletonProps): JSX.Element {
  return (
    <li className='flex w-full gap-4'>
      <div className='skeleton h-10 w-10 shrink-0 rounded-full' />
      <div className='group flex items-center justify-end gap-4'>
        <div
          className='relative max-w-md rounded-lg rounded-tl-none 
                     bg-bubble py-2 px-3 md:py-3 md:px-4'
        >
          <Triangle isCurrentUser={false} />
          <div className='flex items-center gap-2'>
            <p className='skeleton text-sm font-medium text-transparent md:text-base'>
              Lorem, ipsum.
            </p>
            <p className='skeleton text-xs text-transparent md:text-sm'>
              Lorem, ipsum dolor.
            </p>
          </div>
          <div className='mt-2 flex flex-col gap-2'>
            {image ? (
              <div className='-mb-1 -mt-2'>
                <ImageSkeleton />
              </div>
            ) : (
              <p
                className={cn(
                  'skeleton whitespace-pre-line break-words text-sm text-transparent md:text-base',
                  !edit && 'mb-1'
                )}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
                aliquid accusamus facere distinctio sit cumque sunt.
                Reprehenderit ipsa, quo, suscipit quasi animi explicabo magni
                fugit incidunt, ea quam accusamus eligendi.
              </p>
            )}
            {edit && (
              <p className='skeleton self-end text-right text-xs text-transparent'>
                Lorem ipsum dolor sit.
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
