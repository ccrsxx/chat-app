import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { messagesQuery } from '@lib/firebase-utils';
import { ChatMessage as ChatMessage } from './chat-message';
import type { Messages } from '@lib/query-converter';

type ChatRoomProps = {
  messages: Messages;
};

export function ChatRoom({
  messages: messagesProp
}: ChatRoomProps): JSX.Element {
  const [messages, setMessages] = useState<Messages>(messagesProp);
  const [value, loading] = useCollectionData(messagesQuery);

  useEffect(() => {
    if (!loading) setMessages(value as Messages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ol className='flex flex-1 flex-col gap-4 overflow-y-scroll'>
      {messages.map(({ id, ...rest }) => (
        <ChatMessage {...rest} key={id} />
      ))}
      <div id='scroll-bottom' />
    </ol>
  );
}
