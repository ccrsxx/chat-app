import { useEffect, useRef, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useIntersection } from '@lib/hooks/useIntersection';
import { messagesQuery } from '@lib/firebase/utils';
import { ChatMessage } from './chat-message';
import type { Messages } from '@lib/firebase/converter';

type ChatRoomProps = {
  messages: Messages;
  currentUserId: string | null;
};

export function ChatRoom({
  messages: messagesProp,
  currentUserId
}: ChatRoomProps): JSX.Element {
  const [messages, setMessages] = useState<Messages>(messagesProp);
  const [value, loading] = useCollectionData(messagesQuery);

  const scrollArea = useRef<HTMLOListElement | null>(null);
  const bottomSpan = useRef<HTMLSpanElement | null>(null);

  const isAtBottom = useIntersection(scrollArea, bottomSpan, {
    rootMargin: '300px',
    threshold: 1.0
  });

  const scrollToBottom = (): void =>
    void setTimeout(
      () => bottomSpan.current?.scrollIntoView({ behavior: 'smooth' }),
      100
    );

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!loading) {
      setMessages(value as Messages);
      if (isAtBottom) scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ol
      className='flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-scroll
                 rounded-lg bg-neutral-800 px-4 pt-4'
      ref={scrollArea}
    >
      {messages.map(({ ...rest }) => (
        <ChatMessage currentUserId={currentUserId} {...rest} key={rest.id} />
      ))}
      <span id='scroll-bottom' ref={bottomSpan} />
    </ol>
  );
}
