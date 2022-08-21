import { motion } from 'framer-motion';
import cn from 'clsx';
import { deleteMessage } from '@lib/firebase/utils';
import { convertDate } from '@lib/date';
import { ImageLoader } from '@components/ui/image-loader';
import { Triangle } from '@components/ui/triangle';
import { MessageOptions } from './message-options';

type ChatItemProps = {
  id: string;
  uid: string;
  name: string;
  text: string;
  photoURL: string;
  createdAt: number;
  editedAt: number | null;
  currentUserId: string | null;
  goToEditMode: (docId: string, text: string) => () => void;
};

const variants = [
  {
    initial: { opacity: 0, x: -100, transition: { duration: 0.1 } },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } }
  },
  {
    initial: { opacity: 0, x: 100, transition: { duration: 0.1 } },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100, transition: { duration: 0.2 } }
  }
];

export function ChatMessage({
  id,
  uid,
  name,
  text,
  photoURL,
  editedAt,
  createdAt,
  currentUserId,
  goToEditMode
}: ChatItemProps): JSX.Element {
  const isCurrentUser = currentUserId === uid;

  return (
    <motion.li
      className={cn(
        'flex gap-4',
        isCurrentUser && 'animate-fade flex-row-reverse self-end'
      )}
      layout
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
        className={cn('group flex items-center gap-4', {
          'rounded-tr-none': isCurrentUser,
          'rounded-tl-none': !isCurrentUser
        })}
      >
        {isCurrentUser && (
          <MessageOptions
            goToEditMode={goToEditMode(id, text)}
            deleteMessage={deleteMessage(id)}
          />
        )}
        <div
          className={cn('relative rounded-lg bg-bubble py-2 px-4', {
            'rounded-tr-none': isCurrentUser,
            'rounded-tl-none': !isCurrentUser
          })}
        >
          <Triangle isCurrentUser={isCurrentUser} />
          <div className='flex items-center gap-2'>
            <p className='font-medium text-primary'>{name}</p>
            <p className='text-sm text-secondary/80'>
              {convertDate(createdAt)}
            </p>
          </div>
          <p className='max-w-md whitespace-pre-line break-words text-white/80'>
            {text}
          </p>
          {editedAt && (
            <p className='py-1 text-right text-xs text-secondary/80'>
              Edited {convertDate(editedAt)}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
}
