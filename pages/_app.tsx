import { AppHead } from '@components/common/app-head';
import { AppLayout } from '@components/common/app-layout';
import '@assets/main.scss';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AppLayout>
      <AppHead />
      <Component {...pageProps} />
    </AppLayout>
  );
}
