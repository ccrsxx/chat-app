/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import cn from 'clsx';
import { Button } from '@components/ui/button';
import { useWindowSize } from '@lib/hooks/useWindowSize';
import { editMessage, sendMessage, sendImages } from '@lib/firebase/utils';
import { isValidImage } from '@lib/file';
import { RiImageAddLine, RiSendPlane2Line } from '@assets/icons';
import { ImageUpload } from './image-upload';
import { EditMode } from './edit-mode';
import type { ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';

export type MessageData = {
  docId: string;
  docText: string;
};

export type ImageData = {
  src: string;
  alt: string;
};

export type ImagesData = (ImageData & {
  id: number;
})[];

type FilesWithId = (File & {
  id: number;
})[];

type InputBoxProps = {
  isEditMode: boolean;
  messageData: MessageData | null;
  currentUserId: string | null;
  openModal: (data: ImageData) => () => void;
  exitEditMode: () => void;
  scrollToBottom: (input?: boolean, delay?: number) => void;
};

export function MainForm({
  isEditMode,
  messageData,
  currentUserId,
  openModal,
  exitEditMode,
  scrollToBottom
}: InputBoxProps): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [selectedImages, setSelectedImages] = useState<FilesWithId>([]);
  const [imagesPreview, setImagesPreview] = useState<ImagesData>([]);

  const inputElement = useRef<HTMLTextAreaElement>(null);
  const inputFileElement = useRef<HTMLInputElement>(null);

  const isMobile = useWindowSize();

  const { docId, docText } = messageData ?? {};
  const isUploadingImages = !!imagesPreview.length;

  useEffect(
    () => () => imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src)),
    []
  );

  useEffect(() => {
    if (!currentUserId) {
      cleanImages();
      exitEditMode();
      setInputValue('');
    }
  }, [currentUserId]);

  useEffect(() => {
    if (isEditMode) {
      inputElement.current?.focus();
      setInputValue(docText!);
      cleanImages();
    } else setInputValue('');
  }, [isEditMode, docId]);

  const addMessage = (text: string): void => {
    if (isEditMode) {
      if (docText !== text) editMessage(docId!, text);
      exitEditMode();
    } else {
      if (isUploadingImages) {
        void sendImages(inputValue, selectedImages);
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

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement> | ClipboardEvent<HTMLTextAreaElement>
  ): void => {
    if (!currentUserId || isEditMode) return;

    const files = 'clipboardData' in e ? e.clipboardData.files : e.target.files;

    if (!files || !files.length) return;

    const rawImages = [...files].filter(({ name, size }) =>
      isValidImage(name, size)
    );

    const imagesId = rawImages.map((_, index) =>
      Math.floor(Date.now() + Math.random() + index)
    );

    setSelectedImages([
      ...selectedImages,
      ...rawImages.map((image, index) =>
        Object.assign(image, { id: imagesId[index] })
      )
    ]);

    const imagesData = rawImages.map((image, index) => ({
      id: imagesId[index],
      src: URL.createObjectURL(image),
      alt: image.name
    }));

    setImagesPreview([...imagesPreview, ...imagesData]);

    inputElement.current?.focus();
  };

  const handleImageUploadClick = (): void => inputFileElement.current?.click();

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

  const addWithIcon = (): void => addMessage(inputValue.trim());

  const cleanImages = (): void => {
    setSelectedImages([]);
    setImagesPreview([]);
    imagesPreview.forEach(({ src }) => URL.revokeObjectURL(src));
  };

  const isDisabled = !inputValue.trim();

  return (
    <form className='mt-4 mb-2 flex flex-col gap-4'>
      <AnimatePresence>
        {isEditMode ? (
          <EditMode
            isMobile={isMobile}
            isDisabled={isDisabled}
            addWithIcon={addWithIcon}
            exitEditMode={exitEditMode}
          />
        ) : isUploadingImages ? (
          <ImageUpload
            imagesPreview={imagesPreview}
            openModal={openModal}
            removeImage={removeImage}
          />
        ) : null}
      </AnimatePresence>
      <div className='flex gap-4'>
        {!isEditMode && (
          <Button
            className='cursor-pointer self-end rounded-lg bg-neutral-800 p-3 text-secondary hover:bg-neutral-800
                       hover:text-current hover:text-secondary hover:brightness-110 enabled:hover:text-primary
                       disabled:cursor-not-allowed disabled:brightness-90 disabled:hover:brightness-100'
            onClick={handleImageUploadClick}
            disabled={!currentUserId}
          >
            <input
              className='hidden'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              disabled={!currentUserId}
              ref={inputFileElement}
              multiple
            />
            <RiImageAddLine />
          </Button>
        )}
        <TextareaAutosize
          className='text-secondary-500 focus:shadow-outline w-full resize-none rounded-lg border-none 
                     bg-neutral-800 py-2 px-3 text-secondary placeholder-neutral-500 outline-none
                     transition-all hover:brightness-110 hover:duration-300 focus:text-primary/80 
                     focus:brightness-[1.15] active:scale-[0.98] active:duration-150 disabled:cursor-not-allowed 
                     disabled:brightness-90 disabled:hover:brightness-100'
          placeholder={
            currentUserId ? 'Send a message' : 'Sign in to send a message'
          }
          maxRows={isUploadingImages ? 5 : 10}
          onChange={handleChange}
          onKeyDown={!isMobile ? handleSubmit : undefined}
          onPaste={handleImageUpload}
          value={inputValue}
          disabled={!currentUserId}
          ref={inputElement}
        />
        <Button
          ariaLabel='Send message'
          className='z-0 self-end bg-neutral-800 py-3 text-secondary hover:bg-neutral-800 hover:text-secondary
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
