import React from 'react'
import { Sofa } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ImagePlaceholderProps {
  aspectRatio: 'square' | '4/5' | '16/9' | '3/2'
  label?: string
  className?: string
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspectRatio,
  label,
  className,
}) => {
  const aspectClasses = {
    'square': 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-video',
    '3/2': 'aspect-[3/2]',
  }

  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col items-center justify-center w-full bg-crema-marfil border-2 border-dashed border-gris-piedra/20 p-4',
          aspectClasses[aspectRatio],
          className
        )
      )}
      aria-label={label || 'Imagen del producto'}
    >
      <Sofa className="w-8 h-8 text-gris-piedra/40 mb-2" aria-hidden="true" />
      <span className="font-courier text-xs text-gris-piedra/50 text-center">
        {label || 'Imagen del producto'}
      </span>
    </div>
  )
}
