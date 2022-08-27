import Head from 'next/head';
import type { ReactNode } from 'react';

type MainLayoutProps = {
  url?: string;
  title?: string;
  image?: string;
  children: ReactNode;
  product?: boolean;
  className?: string;
  description?: string;
};

const siteUrl = 'https://chat-app-ccrsxx.vercel.app';

export function MainLayout({
  url,
  title,
  image,
  children,
  className,
  description
}: MainLayoutProps): JSX.Element {
  const siteTitle = title;
  const siteDescription = description;
  const siteImage = image;

  return (
    <main className={className}>
      <Head>
        <title>{siteTitle}</title>
        <meta name='og:title' content={siteTitle} />
        <meta name='description' content={siteDescription} />
        <meta name='og:description' content={siteDescription} />
        <meta property='og:image' content={siteImage} />
        <meta name='og:url' content={`${siteUrl}${url ?? ''}`} />
        <meta name='theme-color' content='#000000' />
      </Head>
      {children}
    </main>
  );
}
