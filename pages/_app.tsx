import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@lib/firebase-utils';
import { AppHead } from '@components/common/app-head';
import { Header } from '@components/header';
import '@assets/main.scss';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [user, loading, error] = useAuthState(auth);

  const userInfo = user ?? null;

  return (
    <>
      <AppHead />
      <Header userInfo={userInfo} loading={loading} error={error} />
      <Component {...pageProps} />
    </>
  );
}
