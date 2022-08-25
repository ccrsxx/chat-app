import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AnimatePresence } from 'framer-motion';
import { deleteAllMessages, messagesQuery } from '@lib/firebase/utils';
import { Button } from '@components/ui/button';
import { FaFan } from '@assets/icons';
import { ChatMessage } from './chat-message';
import type { Ref } from 'react';
import type { Messages } from '@lib/firebase/converter';
import type { ImageData } from '@components/form/main-form';

type ChatRoomProps = {
  scrollArea: Ref<HTMLOListElement> | null;
  bottomSpan: Ref<HTMLSpanElement> | null;
  isAtBottom: boolean;
  messagesProp: Messages;
  currentUserId: string | null;
  openModal: (data: ImageData) => () => void;
  goToEditMode: (docId: string, text: string) => () => void;
  exitEditMode: () => void;
  scrollToBottom: (input?: boolean) => void;
};

export const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;

export function ChatRoom({
  scrollArea,
  bottomSpan,
  isAtBottom,
  messagesProp,
  currentUserId,
  openModal,
  goToEditMode,
  exitEditMode,
  scrollToBottom
}: ChatRoomProps): JSX.Element {
  const [messages, setMessages] = useState<Messages>(messagesProp);
  const [value, loading] = useCollectionData(messagesQuery);

  useEffect(() => {
    if (!loading) {
      setMessages(value as Messages);
      if (isAtBottom) scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const isAdmin = currentUserId === ADMIN_ID;

  return (
    <ol
      className='flex flex-1 flex-col-reverse gap-4 overflow-y-auto
                 overflow-x-hidden rounded-lg bg-neutral-800 px-4 pt-4'
      ref={scrollArea}
    >
      {isAdmin && (
        <div className='group fixed z-10 -translate-x-4 translate-y-0 rounded-lg p-4'>
          <Button
            className='translate-y-4 bg-bubble p-2 text-lg text-primary/80 opacity-0
                       hover:bg-red-400 group-hover:translate-y-0 group-hover:opacity-100'
            iconStyle='animate-spin'
            Icon={FaFan}
            onClick={deleteAllMessages}
          />
        </div>
      )}
      <div className='flex flex-col gap-4'>
        <AnimatePresence initial={false}>
          {messages.map(({ ...rest }) => (
            <ChatMessage
              isAdmin={isAdmin}
              currentUserId={currentUserId}
              openModal={openModal}
              goToEditMode={goToEditMode}
              exitEditMode={exitEditMode}
              {...rest}
              key={rest.id}
            />
          ))}
        </AnimatePresence>
        <span ref={bottomSpan} />
      </div>
    </ol>
  );
}
