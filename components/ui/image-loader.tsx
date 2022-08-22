import { useState } from 'react';
import Image from 'next/image';
import cn from 'clsx';
import type { ReactNode } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  divStyle: string;
  children?: ReactNode;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  draggable?: boolean;
  imageStyle?: string;
  noPlaceholder?: boolean;
};

export function ImageLoader({
  src,
  alt,
  divStyle,
  children,
  objectFit,
  draggable,
  imageStyle,
  noPlaceholder
}: ImageLoaderProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = (): void => setIsLoading(false);

  return (
    <div
      className={cn(
        'relative',
        divStyle,
        !noPlaceholder && isLoading && 'animate-pulse !bg-primary'
      )}
    >
      <Image
        className={imageStyle}
        src={src}
        alt={alt}
        draggable={draggable}
        objectFit={objectFit}
        layout='fill'
        onLoadingComplete={!noPlaceholder ? handleLoad : undefined}
      />
      {children}
    </div>
  );
}
