import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { sendMessage } from '@lib/firebase-utils';
import type { KeyboardEvent } from 'react';
import type { User } from 'firebase/auth';

const scrollElement =
  typeof document !== 'undefined'
    ? document.getElementById('scroll-bottom')
    : null;

const scrollToBottom = (): void =>
  void setTimeout(
    () => scrollElement?.scrollIntoView({ behavior: 'smooth' }),
    100
  );

type InputBoxProps = {
  userInfo: User | null;
};

export function InputBox({ userInfo }: InputBoxProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleChange = ({
    target: { value }
  }: KeyboardEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const submitOnEnter = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const { key, shiftKey } = e;

    const isMultiLine = key === 'Enter' && !shiftKey;

    if (isMultiLine) e.preventDefault();

    const trimmedValue = inputValue.trim();

    if (trimmedValue && isMultiLine) {
      void sendMessage(trimmedValue);
      setInputValue('');
      scrollToBottom();
    }
  };

  return (
    <form className='mt-4'>
      <TextareaAutosize
        className='text-secondary-500 focus:shadow-outline w-full resize-none rounded-lg bg-neutral-800 py-2 
                   px-3 text-secondary placeholder-neutral-500 transition duration-300 hover:brightness-110
                   focus:border-neutral-900 focus:text-primary focus:outline-none focus:brightness-[1.15] 
                   active:scale-[0.98] active:duration-150 disabled:cursor-not-allowed'
        placeholder={userInfo ? 'Send a message' : 'Sign in to send a message'}
        maxRows={10}
        onChange={handleChange}
        onKeyDown={submitOnEnter}
        value={inputValue}
        disabled={!userInfo}
      />
    </form>
  );
}
