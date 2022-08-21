/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { editMessage, sendMessage } from '@lib/firebase/utils';
import { RiImageAddLine, RiSendPlane2Line } from '@assets/icons';
import { EditMode } from './edit-mode';
import type { ChangeEvent, KeyboardEvent } from 'react';

export type MessageData = {
  docId: string;
  text: string;
};

type InputBoxProps = {
  isEditMode: boolean;
  messageData: MessageData | null;
  currentUserId: string | null;
  exitEditMode: () => void;
  scrollToBottom: (input?: boolean) => void;
};

export function InputBox({
  isEditMode,
  messageData,
  currentUserId,
  exitEditMode,
  scrollToBottom
}: InputBoxProps): JSX.Element {
  const { docId, text: docText } = messageData ?? {};

  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>('');

  const inputElement = useRef<HTMLTextAreaElement | null>(null);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    // console.log(selectedFile);

    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // console.log({ selectedFile, objectUrl });

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!currentUserId) setInputValue('');
  }, [currentUserId]);

  useEffect(() => {
    if (isEditMode) {
      inputElement.current?.focus();
      setInputValue(docText!);
    } else setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, docId]);

  const handleChange = ({
    target: { value }
  }: KeyboardEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleFileUpload = ({
    target: { files }
  }: ChangeEvent<HTMLInputElement>): void => {
    if (!files || !files.length) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(files[0]);
  };

  const addMessage = (text: string): void => {
    if (isEditMode) {
      if (docText !== text) editMessage(docId!, text);
      exitEditMode();
    } else {
      sendMessage(text);
      scrollToBottom(true);
    }

    setInputValue('');
  };

  const handleSubmit = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const { key, shiftKey } = e;

    if (isEditMode && key === 'Escape') exitEditMode();

    const isMultiLine = key === 'Enter' && !shiftKey;

    if (isMultiLine) e.preventDefault();

    const trimmedValue = inputValue.trim();

    if (trimmedValue && isMultiLine) addMessage(trimmedValue);
  };

  const addWithIcon = (): void => addMessage(inputValue);

  const isDisabled = !inputValue.trim();

  return (
    <form className='mt-4 flex gap-4'>
      <div className='flex w-full flex-col gap-2'>
        <AnimatePresence>
          {isEditMode && (
            <EditMode
              isDisabled={isDisabled}
              addWithIcon={addWithIcon}
              exitEditMode={exitEditMode}
            />
          )}
        </AnimatePresence>
        <div className='flex gap-4'>
          {!isEditMode && (
            <label
              className='custom-button smooth-hover cursor-pointer self-end bg-neutral-800 py-3
                       text-secondary hover:bg-neutral-800 hover:text-primary hover:brightness-110'
            >
              <input
                className='hidden'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                multiple
              />
              <RiImageAddLine />
            </label>
          )}
          <TextareaAutosize
            className='text-secondary-500 focus:shadow-outline w-full resize-none rounded-lg border-none 
                       bg-neutral-800 py-2 px-3 text-secondary placeholder-neutral-500 outline-none
                       transition-all duration-300 hover:brightness-110 focus:border-neutral-900 focus:text-primary/80
                       focus:brightness-[1.15] active:scale-[0.98] active:duration-150 disabled:cursor-not-allowed
                       disabled:brightness-90 disabled:hover:brightness-100'
            placeholder={
              currentUserId ? 'Send a message' : 'Sign in to send a message'
            }
            maxRows={10}
            onChange={handleChange}
            onKeyDown={handleSubmit}
            value={inputValue}
            disabled={!currentUserId}
            ref={inputElement}
          />
        </div>
      </div>
      <Button
        className='self-end bg-neutral-800 py-3 text-secondary hover:bg-neutral-800 hover:text-secondary
                   hover:brightness-110 enabled:hover:text-primary disabled:brightness-90 disabled:hover:brightness-100'
        iconStyle={cn('transition-transform', !isDisabled && '-rotate-[40deg]')}
        Icon={RiSendPlane2Line}
        disabled={isDisabled || !currentUserId}
        onClick={addWithIcon}
      />
    </form>
  );
}
