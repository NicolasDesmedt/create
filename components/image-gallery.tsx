'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

const images = [
  {
    alt: 'Two scuba divers exploring clear blue waters with coral reef visible on the right',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202021-08-02%20at%2018.22.07-HPLQdO30MSNoXI4E5HJNhdt1ENLB3W.jpeg',
  },
  {
    alt: 'Scuba diver near a coral reef wall in crystal clear blue water',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202021-08-02%20at%2018.23.13-ljUMcQjJdHTKjtQGjZmSSsZKHpqtyq.jpeg',
  },
  {
    alt: 'Two scuba divers at different depths exploring rocky seafloor',
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202021-08-02%20at%2018.23.11-PVnHkM9JQ2xOhttxOUcw6cb7wipKge.jpeg',
  },
];

export default function ImageGallery() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const showNextImage = () => {
    setCurrentImageIndex((index) => (index + 1) % images.length);
  };

  const showPreviousImage = () => {
    setCurrentImageIndex(
      (index) => (index - 1 + images.length) % images.length
    );
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowLeft') {
        showPreviousImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    },
    [isOpen]
  );

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <div className='grid grid-cols-3 gap-2'>
        {images.map((image, index) => (
          <button
            key={image.src}
            onClick={() => {
              setCurrentImageIndex(index);
              setIsOpen(true);
            }}
            className='relative aspect-square overflow-hidden rounded-lg transition-opacity hover:opacity-90'
          >
            <Image
              src={image.src}
              alt={image.alt}
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </button>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className='sr-only'>Image Gallery</DialogTitle>
        <DialogContent className='max-w-3xl backdrop-blur'>
          <div className='relative aspect-[3/2] w-full'>
            <Image
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className='object-contain'
              fill
              priority
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
          <div className='absolute inset-0 flex items-center justify-between p-4'>
            <Button
              variant='outline'
              size='icon'
              onClick={showPreviousImage}
              className='h-8 w-8 rounded-full bg-background/80 backdrop-blur'
            >
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Previous image</span>
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={showNextImage}
              className='h-8 w-8 rounded-full bg-background/80 backdrop-blur'
            >
              <ChevronRight className='h-4 w-4' />
              <span className='sr-only'>Next image</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
