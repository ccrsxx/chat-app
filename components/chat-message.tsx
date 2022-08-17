import { motion } from 'framer-motion';
import cn from 'clsx';
import { ImageLoader } from '@components/ui/image-loader';
import { Triangle } from '@components/ui/triangle';
import { convertDate } from '@lib/date';

type ChatItemProps = {
  uid: string;
  name: string;
  text: string;
  photoURL: string;
  createdAt: number;
  editedAt: number | null;
  currentUserId: string | null;
};

const variants = [
  {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  },
  {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  }
];

export function ChatMessage({
  uid,
  name,
  text,
  photoURL,
  editedAt,
  createdAt,
  currentUserId
}: ChatItemProps): JSX.Element {
  const isCurrentUser = currentUserId === uid;

  return (
    <motion.li
      className={cn(
        'flex gap-4',
        isCurrentUser && 'animate-fade flex-row-reverse self-end'
      )}
      variants={variants[+isCurrentUser]}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <ImageLoader
        divStyle='w-10 h-10 rounded-full shrink-0'
        imageStyle='rounded-full'
        src={photoURL}
        alt={name}
      />
      <div
        className={cn('relative flex flex-col rounded-lg bg-bubble py-2 px-4', {
          'rounded-tr-none': isCurrentUser,
          'rounded-tl-none': !isCurrentUser
        })}
      >
        <Triangle isCurrentUser={isCurrentUser} />
        <div className='flex items-center gap-2'>
          <p className='font-medium text-primary'>{name}</p>
          <p className='text-sm text-secondary/80'>{convertDate(createdAt)}</p>
        </div>
        <p className='max-w-md whitespace-pre-line break-words text-white/80'>
          {text}
        </p>
      </div>
    </motion.li>
  );
}
