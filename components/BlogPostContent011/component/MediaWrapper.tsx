
// MediaWrapper.tsx
import React from 'react';

interface MediaWrapperProps {
  src: string;
  alt: string;
  type: 'image' | 'video';
}

export const MediaWrapper = ({ src, alt, type }: MediaWrapperProps) => {
  return (
    <figure className="my-8">
      <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
        {type === 'image' ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={src}
            controls
            className="w-full h-auto"
            title={alt}
          />
        )}
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

