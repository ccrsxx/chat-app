/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { editMessage, sendMessage, sendImages } from '@lib/firebase/utils';
import { RiImageAddLine, RiSendPlane2Line } from '@assets/icons';
import { ImageUpload } from './image-upload';
import { EditMode } from './edit-mode';
import type { ChangeEvent, KeyboardEvent } from 'react';

export type MessageData = {
  docId: string;
  text: string;
};

export type ImagesData = {
  id: number;
  src: string;
  name: string;
}[];

type FilesWithId = (File & {
  id: number;
})[];

type InputBoxProps = {
  isEditMode: boolean;
  messageData: MessageData | null;
  currentUserId: string | null;
  exitEditMode: () => void;
  scrollToBottom: (input?: boolean, delay?: number) => void;
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
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesData>([]);

  const inputElement = useRef<HTMLTextAreaElement | null>(null);

  const isUploadingImages = !!imagesPreview.length;

  useEffect(() => {
    if (!currentUserId) setInputValue('');
  }, [currentUserId]);

  useEffect(() => {
    if (isEditMode) {
      inputElement.current?.focus();
      setInputValue(docText!);
      cleanImages();
    } else setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, docId]);

  const addMessage = (text: string): void => {
    if (isEditMode) {
      if (docText !== text) editMessage(docId!, text);
      exitEditMode();
    } else {
      if (isUploadingImages) {
        void sendImages(text, selectedImages);
        cleanImages();
        scrollToBottom(true, 500);
        scrollToBottom(undefined, 1000);
      } else void sendMessage(text);
      scrollToBottom(true);
    }

    setInputValue('');
  };

  const handleChange = ({
    target: { value }
  }: KeyboardEvent<HTMLTextAreaElement>): void => setInputValue(value);

  const handleFileUpload = ({
    target: { files }
  }: ChangeEvent<HTMLInputElement>): void => {
    if (!files || !files.length) return;

    const rawImages = [...files];

    const imagesId = rawImages.map((_, index) =>
      Math.floor(Date.now() + Math.random() + index)
    );

    setSelectedImages(
      rawImages.map((image, index) =>
        Object.assign(image, { id: imagesId[index] })
      )
    );

    const imagesData = rawImages.map((image, index) => ({
      id: imagesId[index],
      src: URL.createObjectURL(image),
      name: image.name
    }));

    setImagesPreview([...imagesPreview, ...imagesData]);

    inputElement.current?.focus();
  };

  const handleSubmit = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    const { key, shiftKey } = e;

    if (isEditMode && key === 'Escape') exitEditMode();

    const isMultiLine = key === 'Enter' && !shiftKey;

    if (isMultiLine) e.preventDefault();

    const trimmedValue = inputValue.trim();

    if ((isUploadingImages || trimmedValue) && isMultiLine)
      addMessage(trimmedValue);
  };

  const removeImage = (targetId: number) => (): void => {
    setSelectedImages(selectedImages.filter(({ id }) => id !== targetId));
    setImagesPreview(imagesPreview.filter(({ id }) => id !== targetId));

    const { src } = imagesPreview.find(({ id }) => id === targetId)!;
    URL.revokeObjectURL(src);
  };

  const addWithIcon = (): void => addMessage(inputValue);

  const cleanImages = (): void => {
    setSelectedImages([]);
    setImagesPreview([]);
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));
  };

  const isDisabled = !inputValue.trim();

  return (
    <form className='mt-4 flex flex-col gap-4'>
      <AnimatePresence>
        {isEditMode ? (
          <EditMode
            isDisabled={isDisabled}
            addWithIcon={addWithIcon}
            exitEditMode={exitEditMode}
          />
        ) : isUploadingImages ? (
          <ImageUpload
            imagesPreview={imagesPreview}
            removeImage={removeImage}
          />
        ) : null}
      </AnimatePresence>
      <div className='flex gap-4'>
        {!isEditMode && (
          <>
            <input
              id='image-upload'
              className='peer hidden'
              type='file'
              accept='image/*'
              onChange={handleFileUpload}
              disabled={!currentUserId}
              multiple
            />
            <label
              htmlFor='image-upload'
              className='custom-button smooth-hover cursor-pointer self-end bg-neutral-800 py-3 text-secondary 
                         hover:bg-neutral-800 hover:brightness-110 peer-enabled:hover:text-primary
                         peer-disabled:cursor-not-allowed peer-disabled:brightness-90 peer-disabled:hover:brightness-100'
            >
              <RiImageAddLine />
            </label>
          </>
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
        <Button
          ariaLabel='Send message'
          className='self-end bg-neutral-800 py-3 text-secondary hover:bg-neutral-800 hover:text-secondary
                     hover:brightness-110 enabled:hover:text-primary disabled:brightness-90 disabled:hover:brightness-100'
          iconStyle={cn(
            'transition-transform',
            (isUploadingImages || !isDisabled) && '-rotate-[40deg]'
          )}
          Icon={RiSendPlane2Line}
          disabled={!currentUserId || (!isUploadingImages && isDisabled)}
          onClick={addWithIcon}
        />
      </div>
    </form>
  );
}
