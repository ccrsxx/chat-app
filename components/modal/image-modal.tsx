import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VscLoading } from '@assets/icons';
import type { ImageData } from '@components/form/main-form';

type ImageModalProps = {
  imageData: ImageData;
  closeModal: () => void;
};

export function ImageModal({
  imageData,
  closeModal
}: ImageModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  const { src, alt } = imageData;

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = (): void => setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='fixed inset-0 z-40'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed h-screen w-screen bg-black/60'
        onClick={closeModal}
      />
      <div className='flex h-full w-full items-center justify-center'>
        <div className='z-50 p-4'>
          {isLoading ? (
            <motion.i
              className='text-4xl text-primary'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <VscLoading className='animate-spin' />
            </motion.i>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { type: 'spring', duration: 0.5, bounce: 0.4 }
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            >
              <picture className='group relative flex max-w-3xl'>
                <source srcSet={src} type='image/*' />
                <img
                  className='max-h-[75vh] rounded-lg object-contain md:max-h-[80vh]'
                  src={src}
                  alt={alt}
                />
                <a
                  className='trim-alt absolute bottom-0 right-0 mx-2 mb-2 translate-y-4
                             rounded-lg bg-black/40 px-2 py-1 text-sm text-primary/80 opacity-0 transition
                             hover:bg-blue-400 hover:text-primary group-hover:translate-y-0
                             group-hover:opacity-100'
                  href={src}
                  target='_blank'
                  rel='noreferrer'
                >
                  {alt}
                </a>
                <a
                  className='absolute left-0 -bottom-7 text-primary/80 decoration-transparent
                             underline-offset-2 transition hover:text-primary hover:underline
                             hover:decoration-primary'
                  href={src}
                  target='_blank'
                  rel='noreferrer'
                >
                  Open original
                </a>
              </picture>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
