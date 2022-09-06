import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging';
import { AnimatePresence } from 'framer-motion';
import {
  auth,
  getMessagesSize,
  getMessagesQuery,
  saveMessagingDeviceToken
} from '@lib/firebase/utils';
import { useNotification } from '@lib/hooks/useNotification';
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
  messagesLength: number;
};

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<HomeProps>
> {
  const [messagesSnapshot, messagesLength] = await Promise.all([
    getDocs(getMessagesQuery(20)),
    getMessagesSize()
  ]);
  const messagesProp = messagesSnapshot.docs.map((doc) => doc.data());

  return {
    props: {
      messagesProp,
      messagesLength
    }
  };
}

export default function Home({
  messagesProp,
  messagesLength
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const [user, loading, error] = useAuthState(auth);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageData, setMessageData] = useState<MessageData | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const scrollArea = useRef<HTMLOListElement>(null);
  const bottomSpan = useRef<HTMLSpanElement>(null);

  const isNotificationAllowed = useNotification();

  const isAtBottom = useIntersection(scrollArea, bottomSpan, {
    rootMargin: '0px 0px 300px',
    threshold: 1.0
  });

  useEffect(() => {
    if (user) void saveMessagingDeviceToken();
  }, [user]);

  useEffect(() => {
    let unsubscribe: () => void | undefined;

    if (user)
      unsubscribe = onMessage(getMessaging(), (message) => {
        if (isAtBottom) return;
        const { title, icon, body } = message.notification as {
          [key: string]: string;
        };
        new Notification(title, {
          icon,
          body
        });
      });

    return () => unsubscribe && unsubscribe();
  }, [user, isAtBottom]);

  const goToEditMode = (docId: string, docText: string) => (): void => {
    setMessageData({ docId, docText });
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
      <Header
        error={error}
        loading={loading}
        userInfo={userInfo}
        isNotificationAllowed={isNotificationAllowed}
      />
      <MainLayout
        className='flex flex-1 flex-col overflow-hidden px-2'
        title='Chat App - A Simple Chat Room App'
        description='Send and receive messages here.'
        image='/home.png'
      >
        <ChatRoom
          scrollArea={scrollArea}
          bottomSpan={bottomSpan}
          isAtBottom={isAtBottom}
          messagesProp={messagesProp}
          currentUserId={currentUserId}
          messagesLength={messagesLength}
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
