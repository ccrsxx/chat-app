import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs } from 'firebase/firestore';
import { auth, messagesQuery } from '@lib/firebase/utils';
import { useIntersection } from '@lib/hooks/useIntersection';
import { MainLayout } from '@components/common/main-layout';
import { Header } from '@components/common/header';
import { ChatRoom } from '@components/chat/chat-room';
import { InputBox } from '@components/input/input-box';
import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType
} from 'next';
import type { Messages } from '@lib/firebase/converter';
import type { MessageData } from '@components/input/input-box';

type HomeProps = {
  messagesProp: Messages;
};

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<HomeProps>
> {
  const messagesRef = await getDocs(messagesQuery);
  const messagesProp = messagesRef.docs.map((doc) => doc.data());

  return {
    props: {
      messagesProp
    }
  };
}

export default function Home({
  messagesProp
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [user, loading, error] = useAuthState(auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageData, setMessageData] = useState<MessageData | null>(null);

  const scrollArea = useRef<HTMLOListElement | null>(null);
  const bottomSpan = useRef<HTMLSpanElement | null>(null);

  const isAtBottom = useIntersection(scrollArea, bottomSpan, {
    rootMargin: '300px',
    threshold: 1.0
  });

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToEditMode = (docId: string, text: string) => (): void => {
    setMessageData({ docId, text });
    setIsEditMode(true);
  };

  const exitEditMode = (): void => {
    setIsEditMode(false);
    setTimeout(() => setMessageData(null), 500);
  };

  const scrollToBottom = (input?: boolean, delay?: number): void => {
    if (messageData || (input && isAtBottom)) return;
    setTimeout(
      () => bottomSpan.current?.scrollIntoView({ behavior: 'smooth' }),
      delay ?? 100
    );
  };

  const userInfo = user ?? null;
  const currentUserId = userInfo?.uid ?? null;

  return (
    <>
      <Header userInfo={userInfo} loading={loading} error={error} />
      <MainLayout
        className='flex flex-1 flex-col overflow-hidden px-2'
        title='Chat App - A Simple Chat Room App'
        description='Send a message here for the lulz 😁.'
        image='/home.png'
      >
        <ChatRoom
          scrollArea={scrollArea}
          bottomSpan={bottomSpan}
          isAtBottom={isAtBottom}
          messagesProp={messagesProp}
          currentUserId={currentUserId}
          goToEditMode={goToEditMode}
          exitEditMode={exitEditMode}
          scrollToBottom={scrollToBottom}
        />
        <InputBox
          isEditMode={isEditMode}
          messageData={messageData}
          currentUserId={currentUserId}
          exitEditMode={exitEditMode}
          scrollToBottom={scrollToBottom}
        />
      </MainLayout>
    </>
  );
}
