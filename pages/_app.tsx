import { AppHead } from '@components/common/app-head';
import '@assets/main.scss';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <AppHead />
      <Component {...pageProps} />
    </>
  );
}
