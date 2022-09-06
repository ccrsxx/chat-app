/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AnimatePresence } from 'framer-motion';
import { useIntersection } from '@lib/hooks/useIntersection';
import {
  getMessagesSize,
  getMessagesQuery,
  deleteAllMessages
} from '@lib/firebase/utils';
import { Button } from '@components/ui/button';
import { FaFan } from '@assets/icons';
import { ChatSkeleton } from '@components/ui/chat-skeleton';
import { ChatMessage } from './chat-message';
import type { MutableRefObject } from 'react';
import type { Messages } from '@lib/firebase/converter';
import type { ImageData } from '@components/form/main-form';

type ChatRoomProps = {
  scrollArea: MutableRefObject<HTMLOListElement | null>;
  bottomSpan: MutableRefObject<HTMLSpanElement | null>;
  isAtBottom: boolean;
  messagesProp: Messages;
  currentUserId: string | null;
  messagesLength: number;
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
  messagesLength,
  openModal,
  goToEditMode,
  exitEditMode,
  scrollToBottom
}: ChatRoomProps): JSX.Element {
  const [messages, setMessages] = useState<Messages>(messagesProp);
  const [messageLimit, setMessageLimit] = useState(20);
  const [messagesSize, setMessagesSize] = useState(messagesLength);
  const [isReachedLimit, setIsReachedLimit] = useState(false);

  const [messagesDb, loading] = useCollectionData(
    getMessagesQuery(messageLimit)
  );

  const topSkeleton = useRef<HTMLDivElement>(null);

  const isAtTop = useIntersection(scrollArea, topSkeleton, {
    rootMargin: '100px 0px 0px',
    threshold: 0.1
  });

  const isNearTop = useIntersection(scrollArea, topSkeleton, {
    rootMargin: '1300px 0px 0px',
    threshold: 0.1
  });

  useEffect(() => {
    const checkLimit =
      messagesSize !== null ? messageLimit >= messagesSize : false;
    setIsReachedLimit(checkLimit);
  }, [messagesSize, messageLimit]);

  useEffect(() => {
    if (isReachedLimit) return;

    let timeoutId: NodeJS.Timeout;

    if ((isAtTop || isNearTop) && !loading) {
      timeoutId = setTimeout(() => setMessageLimit(messageLimit + 20), 1000);
      const firstMessageId = messages[0]?.id;

      if (firstMessageId) {
        scrollToChat(firstMessageId, 500);
        scrollToChat(firstMessageId, 1000);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [isNearTop, loading]);

  useEffect(() => {
    if (!loading) {
      if (isAtBottom) scrollToBottom();

      setMessages(messagesDb as Messages);
      void setDocumentLength();
    }
  }, [messagesDb]);

  const scrollToChat = (chatId: string, delay?: number): void => {
    const chatElement = document.getElementById(chatId);
    setTimeout(() => {
      if (!isAtTop) return;
      chatElement?.scrollIntoView();
    }, delay ?? 100);
  };

  const setDocumentLength = async (): Promise<void> => {
    const messagesSize = await getMessagesSize();
    setMessagesSize(messagesSize);
  };

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
            tabIndex={-1}
          />
        </div>
      )}
      <div className='grid grid-flow-row auto-rows-min gap-3 md:gap-4'>
        <ChatSkeleton
          topSkeleton={topSkeleton}
          visible={!isReachedLimit && !!(messagesSize && messagesSize >= 20)}
        />
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
