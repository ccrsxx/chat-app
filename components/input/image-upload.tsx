import { AnimatePresence, motion } from 'framer-motion';
import { ImageLoader } from '@components/ui/image-loader';
import { Button } from '@components/ui/button';
import { RiDeleteBinLine } from '@assets/icons';
import { variants } from './edit-mode';
import type { ImagesData } from './input-box';

type ImageUploadProps = {
  imagesPreview: ImagesData;
  removeImage: (targetId: number) => () => void;
};

export function ImageUpload({
  imagesPreview,
  removeImage
}: ImageUploadProps): JSX.Element {
  return (
    <motion.div
      className='grid auto-cols-min grid-flow-col gap-4 overflow-x-auto overflow-y-hidden'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <AnimatePresence initial={false}>
        {imagesPreview.map(({ id, src, name }) => (
          <motion.div
            className='relative flex h-56 w-56 flex-col items-center gap-2 rounded-lg bg-neutral-800 p-2'
            layout
            initial={{ top: 100, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            exit={{ top: 100, opacity: 0, transition: { duration: 0.2 } }}
            key={id}
          >
            <Button
              className='text- absolute top-0 right-0 z-10 rounded-br-none rounded-tl-none bg-bubble
                         p-2 text-primary/80 hover:bg-red-400 hover:text-primary'
              Icon={RiDeleteBinLine}
              ariaLabel='Remove image'
              onClick={removeImage(id)}
            />
            <ImageLoader
              src={src}
              alt={name}
              divStyle='flex h-full justify-center items-center w-full'
              imageStyle='!min-w-0 rounded-lg !w-auto !min-h-0 !h-auto'
              objectFit='contain'
              noPlaceholder
            />
            <p
              className='mx-2 overflow-hidden text-ellipsis break-all text-xs text-primary/80
                         [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]'
            >
              {name}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
