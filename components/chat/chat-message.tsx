import { motion } from 'framer-motion';
import cn from 'clsx';
import { deleteMessage } from '@lib/firebase/utils';
import { convertDate } from '@lib/date';
import { ImageLoader } from '@components/ui/image-loader';
import { ImageLoaderLegacy } from '@components/ui/image-loader-legacy';
import { Skeleton } from '@components/ui/skeleton';
import { Triangle } from '@components/ui/triangle';
import { ADMIN_ID } from './chat-room';
import { MessageOptions } from './message-options';
import type { Message } from '@lib/firebase/converter';
import type { ImageData } from '@components/form/main-input';

type ChatItemProps = Message & {
  isAdmin: boolean;
  currentUserId: string | null;
  openModal: (data: ImageData) => () => void;
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

export function ChatMessage({
  id,
  uid,
  name,
  text,
  isAdmin,
  photoURL,
  editedAt,
  imageData,
  createdAt,
  currentUserId,
  openModal,
  goToEditMode,
  exitEditMode
}: ChatItemProps): JSX.Element {
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
          className={cn('relative max-w-md rounded-lg bg-bubble py-2 px-4', {
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
            <ImageLoaderLegacy
              src={imageData.src}
              alt={imageData.alt}
              onClick={openModal(imageData)}
            />
          ) : (
            <Skeleton />
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
