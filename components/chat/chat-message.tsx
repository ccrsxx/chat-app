import { motion } from 'framer-motion';
import cn from 'clsx';
import { deleteMessage } from '@lib/firebase/utils';
import { convertDate } from '@lib/date';
import { ImageLoader } from '@components/ui/image-loader';
import { Triangle } from '@components/ui/triangle';
import { MessageOptions } from './message-options';
import type { Message } from '@lib/firebase/converter';

type ChatItemProps = Message & {
  currentUserId: string | null;
  goToEditMode: (docId: string, text: string) => () => void;
  exitEditMode: () => void;
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

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;

export function ChatMessage({
  id,
  uid,
  name,
  text,
  photoURL,
  editedAt,
  imageData,
  createdAt,
  currentUserId,
  goToEditMode,
  exitEditMode
}: ChatItemProps): JSX.Element {
  const isAdmin = currentUserId === ADMIN_ID;
  const isFromAdmin = uid === ADMIN_ID;
  const isCurrentUser = currentUserId === uid;

  const deleteChat = (): void => {
    exitEditMode();
    deleteMessage(id);
  };

  return (
    <motion.li
      className={cn(
        'flex w-full gap-4',
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
        className={cn('group flex items-center justify-end gap-4', {
          'flex-row-reverse': isAdmin && !isCurrentUser,
          'rounded-tr-none': isCurrentUser,
          'rounded-tl-none': !isCurrentUser
        })}
      >
        {(isAdmin || isCurrentUser) && (
          <MessageOptions
            goToEditMode={text ? goToEditMode(id, text) : null}
            deleteMessage={deleteChat}
          />
        )}
        <div
          className={cn('relative max-w-xl rounded-lg bg-bubble py-2 px-4', {
            'rounded-tr-none': isCurrentUser,
            'rounded-tl-none': !isCurrentUser
          })}
        >
          <Triangle isCurrentUser={isCurrentUser} />
          <div className='flex items-center gap-2'>
            <p
              className={cn('font-medium', {
                'text-red-400': isFromAdmin,
                'text-primary': !isFromAdmin
              })}
            >
              {name} {isFromAdmin && '👑'}
            </p>
            <p className='text-sm text-secondary/80'>
              {convertDate(createdAt)}
            </p>
          </div>
          {text ? (
            <p className='whitespace-pre-line break-words text-white/80'>
              {text}
            </p>
          ) : imageData ? (
            <ImageLoader
              divStyle='flex h-[384px] justify-center items-center w-[384px] my-2 rounded-lg'
              imageStyle='!min-w-0 rounded-lg !w-auto !min-h-0 !h-auto'
              objectFit='cover'
              src={imageData.url}
              alt={imageData.name}
            />
          ) : (
            <div className='my-2 h-[384px] w-[384px] animate-pulse rounded-lg bg-white' />
          )}
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
