import { useRouter } from 'next/router';
import Error from 'next/error';
import { MainLayout } from '@components/common/main-layout';

export default function NotFound(): JSX.Element {
  const { asPath } = useRouter();

  return (
    <MainLayout
      className='flex items-center justify-center'
      title='Chat App | Not Found'
      description='Sorry we couldn’t find the page you were looking for.'
      image='/not_found.png'
      url={asPath}
    >
      <Error statusCode={404} />
    </MainLayout>
  );
}
