import { useEffect, useState } from 'react';
import cn from 'clsx';
import { Skeleton } from './skeleton';

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
        <Skeleton />
      ) : (
        <picture className='flex max-h-[416px] justify-center'>
          <source srcSet={src} type='image/*' />
          <img
            className='cursor-pointer rounded-lg object-cover transition hover:brightness-75'
            src={src}
            alt={alt}
            onClick={onClick}
          />
        </picture>
      )}
    </div>
  );
}
