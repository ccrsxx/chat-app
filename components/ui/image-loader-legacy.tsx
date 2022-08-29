import { useEffect, useState } from 'react';
import cn from 'clsx';
import { ImageSkeleton } from './image-skeleton';

type ImageLoaderLegacyProps = {
  src: string;
  alt: string;
  onClick?: () => void;
};

export function ImageLoaderLegacy({
  src,
  alt,
  onClick
}: ImageLoaderLegacyProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = (): void => setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn(!isLoading && 'py-2')}>
      {isLoading ? (
        <ImageSkeleton />
      ) : (
        <picture className='flex max-h-[320px] justify-center md:max-h-[416px]'>
          <source srcSet={src} type='image/*' />
          <img
            className='normalize-highlight cursor-pointer rounded-lg object-cover transition hover:brightness-75'
            src={src}
            alt={alt}
            onClick={onClick}
          />
        </picture>
      )}
    </div>
  );
}
