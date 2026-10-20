"use client";

import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductThumbProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ProductThumb({ src, alt, width, height, className }: ProductThumbProps) {
  if (!src) {
    return (
      <div
        className={cn('flex shrink-0 items-center justify-center overflow-hidden rounded bg-muted text-muted-foreground', className)}
        style={{ width, height }}
        aria-label={alt}
        role="img"
      >
        <ImageOff className="h-1/3 w-1/3" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
}
