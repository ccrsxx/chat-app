import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import {
  auth,
  messagesQuery,
  saveMessagingDeviceToken
} from '@lib/firebase/utils';
import { useIntersection } from '@lib/hooks/useIntersection';
import { Container } from '@components/common/container';
import { MainLayout } from '@components/common/main-layout';
import { Header } from '@components/common/header';
import { ImageModal } from '@components/modal/image-modal';
import { ChatRoom } from '@components/chat/chat-room';
import { MainForm } from '@components/form/main-form';
import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType
} from 'next';
import type { Messages } from '@lib/firebase/converter';
import type { MessageData, ImageData } from '@components/form/main-form';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const scrollArea = useRef<HTMLOListElement | null>(null);
  const bottomSpan = useRef<HTMLSpanElement | null>(null);

  const isAtBottom = useIntersection(scrollArea, bottomSpan, {
    rootMargin: '300px',
    threshold: 1.0
  });

  // TODO: add notification
  // useEffect(() => {
  //   if (user) void saveMessagingDeviceToken();
  // }, [user]);

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

  const openModal = (data: ImageData) => (): void => {
    setIsModalOpen(true);
    setImageData(data);
  };

  const closeModal = (): void => setIsModalOpen(false);

  const userInfo = user ?? null;
  const currentUserId = userInfo?.uid ?? null;

  return (
    <Container>
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
          openModal={openModal}
          goToEditMode={goToEditMode}
          exitEditMode={exitEditMode}
          scrollToBottom={scrollToBottom}
        />
        <AnimatePresence>
          {isModalOpen && imageData && (
            <ImageModal imageData={imageData} closeModal={closeModal} />
          )}
        </AnimatePresence>
        <MainForm
          isEditMode={isEditMode}
          messageData={messageData}
          currentUserId={currentUserId}
          openModal={openModal}
          exitEditMode={exitEditMode}
          scrollToBottom={scrollToBottom}
        />
      </MainLayout>
    </Container>
  );
}
