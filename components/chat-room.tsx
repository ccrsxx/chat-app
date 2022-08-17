import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { messagesQuery } from '@lib/firebase-utils';
import { ChatMessage } from './chat-message';
import type { Messages } from '@lib/query-converter';

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

  useEffect(() => {
    if (!loading) setMessages(value as Messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ol
      className='flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-scroll
                 rounded-lg bg-neutral-800 px-4 pt-4'
    >
      {messages.map(({ id, ...rest }) => (
        <ChatMessage currentUserId={currentUserId} {...rest} key={id} />
      ))}
      <span id='scroll-bottom' />
    </ol>
  );
}
