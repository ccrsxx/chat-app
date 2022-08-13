import { Navbar } from './navbar';
import { Footer } from './footer';
import type { ReactNode } from 'react';

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
