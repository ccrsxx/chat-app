import cn from 'clsx';
import { saveMessagingDeviceToken, signIn, signOut } from '@lib/firebase/utils';
import { Button } from '@components/ui/button';
import {
  VscLoading,
  RiGithubFill,
  RiGoogleFill,
  RiLogoutBoxLine,
  RiErrorWarningLine,
  RiNotificationFill,
  RiNotificationOffFill
} from '@assets/icons';
import type { User } from 'firebase/auth';

type HeaderProps = {
  error: Error | undefined;
  loading: boolean;
  userInfo: User | null;
  isNotificationAllowed: boolean;
};

export function Header({
  error,
  loading,
  userInfo,
  isNotificationAllowed
}: HeaderProps): JSX.Element {
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
      {userInfo && (
        <Button
          className={cn('animate-fade', {
            'text-green-400': isNotificationAllowed,
            'text-red-400': !isNotificationAllowed
          })}
          onClick={saveMessagingDeviceToken}
          disabled={isNotificationAllowed}
        >
          {isNotificationAllowed ? (
            <RiNotificationFill />
          ) : (
            <RiNotificationOffFill />
          )}
          <span className='hidden md:block'>
            Notification {isNotificationAllowed ? 'on' : 'off'}
          </span>
        </Button>
      )}
      {error ? (
        <Button Icon={RiErrorWarningLine} label='Try Again' onClick={signIn} />
      ) : loading ? (
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
