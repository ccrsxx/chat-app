import { signIn, signOut } from '@lib/firebase-utils';
import { Button } from '@components/ui/button';
import {
  RiGithubFill,
  RiGoogleFill,
  RiLogoutBoxLine,
  VscLoading
} from '@assets/icons';
import type { User } from 'firebase/auth';

type HeaderProps = {
  userInfo: User | null;
  loading: boolean;
  error: Error | undefined;
};

export function Header({ userInfo, loading, error }: HeaderProps): JSX.Element {
  const { Icon, label, onClick } = userInfo
    ? {
        Icon: RiLogoutBoxLine,
        label: 'Sign Out',
        onClick: signOut
      }
    : {
        Icon: RiGoogleFill,
        label: 'Sign In',
        onClick: signIn
      };

  return (
    <header className='flex justify-between font-bold text-primary/80'>
      <a
        className='smooth-tab smooth-hover custom-button'
        href='https://github.com/ccrsxx'
        target='_blank'
        rel='noreferrer'
      >
        <RiGithubFill className='text-xl' />
        <p className='text-lg'>ccrsxx</p>
      </a>
      {loading ? (
        <i className='flex w-14 items-center'>
          <VscLoading className='animate-spin' size={20} />
        </i>
      ) : (
        <Button
          className='animate-fade'
          Icon={Icon}
          label={label}
          onClick={onClick}
        />
      )}
    </header>
  );
}
