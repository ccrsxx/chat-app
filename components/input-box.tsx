import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { sendMessage } from '@lib/firebase/utils';
import { RiSendPlane2Line } from '@assets/icons';
import type { KeyboardEvent } from 'react';

type InputBoxProps = {
  currentUserId: string | null;
};

function scrollToBottom(): void {
  const bottomSpan = document.getElementById('scroll-bottom');
  setTimeout(() => bottomSpan?.scrollIntoView({ behavior: 'smooth' }), 100);
}

export function InputBox({ currentUserId }: InputBoxProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const handleChange = ({
    target: { value }
  }: KeyboardEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleSubmit =
    (check?: boolean) =>
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      const { key, shiftKey } = e;

      const isMultiLine = key === 'Enter' && !shiftKey;

      if (isMultiLine) e.preventDefault();

      const trimmedValue = inputValue.trim();

      if (check || (trimmedValue && isMultiLine)) {
        void sendMessage(trimmedValue);
        setInputValue('');
        scrollToBottom();
      }
    };

  const isDisabled = !inputValue.trim();

  return (
    <form className='mt-4 flex gap-4'>
      <TextareaAutosize
        className='text-secondary-500 focus:shadow-outline w-full flex-1 resize-none rounded-lg bg-neutral-800 
                   py-2 px-3 text-secondary placeholder-neutral-500 transition duration-300
                   hover:brightness-110 focus:border-neutral-900 focus:text-primary focus:outline-none 
                   focus:brightness-[1.15] active:scale-[0.98] active:duration-150 disabled:cursor-not-allowed
                   disabled:brightness-90 disabled:hover:brightness-100'
        placeholder={
          currentUserId ? 'Send a message' : 'Sign in to send a message'
        }
        maxRows={10}
        onChange={handleChange}
        onKeyDown={handleSubmit()}
        value={inputValue}
        disabled={!currentUserId}
      />
      <Button
        className='bg-neutral-800 text-secondary hover:!bg-neutral-800 hover:brightness-110
                   enabled:hover:text-primary disabled:brightness-90 disabled:hover:brightness-100'
        iconStyle={cn('transition', !isDisabled && '-rotate-[40deg]')}
        Icon={RiSendPlane2Line}
        disabled={isDisabled || !currentUserId}
        onClick={handleSubmit(true)}
      />
    </form>
  );
}
