import { getDocs } from 'firebase/firestore';
import { messagesQuery } from '@lib/firebase-utils';
import { MainLayout } from '@components/common/main-layout';
import { ChatRoom } from '@components/chat-room';
import { InputBox } from '@components/input-box';
import type { Messages } from '@lib/query-converter';
import type { InferGetServerSidePropsType } from 'next';

type ServerSideProps = {
  props: {
    messages: Messages;
  };
};

export async function getServerSideProps(): Promise<ServerSideProps> {
  const messagesRef = await getDocs(messagesQuery);
  const messages = messagesRef.docs.map((doc) => doc.data());

  return {
    props: {
      messages
    }
  };
}

export default function Home({
  messages
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return (
    <MainLayout
      className='flex flex-1 flex-col overflow-hidden px-2 inner:py-2'
      title='Chat App - Made with ♥️ by ccrsxx'
      description='Send a message here!'
      image='/home.png'
    >
      <ChatRoom messages={messages} />
      <InputBox />
    </MainLayout>
  );
}
