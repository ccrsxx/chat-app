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
        <div className='relative flex max-w-md flex-col gap-2 rounded-lg rounded-tl-none bg-bubble py-3 px-4'>
          <Triangle isCurrentUser={false} />
          <div className='flex items-center'>
            <p className='skeleton font-medium text-transparent'>
              Lorem, ipsum.
            </p>
          </div>
          {image ? (
            <ImageSkeleton />
          ) : (
            <p
              className={cn(
                'skeleton whitespace-pre-line break-words text-transparent',
                !edit && 'mb-1'
              )}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam
              aliquid accusamus facere distinctio sit cumque sunt. Reprehenderit
              ipsa, quo, suscipit quasi animi explicabo magni fugit incidunt, ea
              quam accusamus eligendi.
            </p>
          )}
          {edit && (
            <p className='skeleton self-end text-right text-xs text-transparent'>
              Lorem ipsum dolor sit.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
