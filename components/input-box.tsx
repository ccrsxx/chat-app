import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { sendMessage } from '@lib/firebase-utils';
import type { KeyboardEvent } from 'react';

const scrollBottom =
  typeof document !== 'undefined'
    ? document.getElementById('scroll-bottom')
    : null;

export function InputBox(): JSX.Element {
  const [inputValue, setInputValue] = useState('');

  const handleChange = ({
    target: { value }
  }: KeyboardEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const submitOnEnter = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(e.target.value);
      setInputValue('');
      setTimeout(
        () => scrollBottom?.scrollIntoView({ behavior: 'smooth' }),
        100
      );
    }
  };

  return (
    <form>
      <TextareaAutosize
        className='text-secondary-500 focus:shadow-outline w-full resize-none rounded-lg bg-neutral-800 py-2 
                   px-3 text-secondary placeholder-neutral-500 transition duration-300 
                   hover:brightness-110 focus:border-neutral-900 focus:text-primary focus:outline-none 
                   focus:brightness-[1.15] active:scale-[0.98] active:duration-150'
        placeholder='Send a message'
        maxRows={10}
        onChange={handleChange}
        onKeyDown={submitOnEnter}
        value={inputValue}
      />
    </form>
  );
}
