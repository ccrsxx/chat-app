import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs } from 'firebase/firestore';
import { auth, messagesQuery } from '@lib/firebase-utils';
import { MainLayout } from '@components/common/main-layout';
import { Header } from '@components/header';
import { ChatRoom } from '@components/chat-room';
import { InputBox } from '@components/input-box';
import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType
} from 'next';
import type { Messages } from '@lib/query-converter';

type HomeProps = {
  messages: Messages;
};

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<HomeProps>
> {
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
  const [user, loading, error] = useAuthState(auth);

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
        <ChatRoom messages={messages} currentUserId={currentUserId} />
        <InputBox userInfo={userInfo} />
      </MainLayout>
    </>
  );
}
