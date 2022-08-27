import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AnimatePresence } from 'framer-motion';
import { messagesQuery } from '@lib/firebase/utils';
import { ChatMessage } from './chat-message';
import type { Ref } from 'react';
import type { Messages } from '@lib/firebase/converter';

type ChatRoomProps = {
  scrollArea: Ref<HTMLOListElement> | null;
  bottomSpan: Ref<HTMLSpanElement> | null;
  isAtBottom: boolean;
  messagesProp: Messages;
  currentUserId: string | null;
  goToEditMode: (docId: string, text: string) => () => void;
  exitEditMode: () => void;
  scrollToBottom: (input?: boolean) => void;
};

export function ChatRoom({
  scrollArea,
  bottomSpan,
  isAtBottom,
  messagesProp,
  currentUserId,
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

  return (
    <ol
      className='grid flex-1 auto-rows-min flex-col gap-4 overflow-y-auto
                 overflow-x-hidden rounded-lg bg-neutral-800 px-4 pt-4'
      ref={scrollArea}
    >
      <AnimatePresence initial={false}>
        {messages.map(({ ...rest }) => (
          <ChatMessage
            currentUserId={currentUserId}
            goToEditMode={goToEditMode}
            exitEditMode={exitEditMode}
            {...rest}
            key={rest.id}
          />
        ))}
      </AnimatePresence>
      <span id='scroll-bottom' ref={bottomSpan} />
    </ol>
  );
}
