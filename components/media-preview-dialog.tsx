'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CldImage } from 'next-cloudinary';

interface MediaPreviewDialogProps {
  url: string;
  title: string;
  imageUrl: string;
}

const MediaPreviewDialog = ({
  url,
  title,
  imageUrl,
}: MediaPreviewDialogProps) => (
  <Dialog>
    <DialogTrigger>
      <div className='relative aspect-[1.6/1] w-full overflow-hidden'>
        <CldImage
          src={imageUrl}
          alt={title}
          width={1000}
          height={1000}
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
        <div className='absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />
      </div>

      {/* Title overlay */}
      <div className='absolute bottom-0 left-0 right-0 rounded-lg bg-gradient-to-t from-black/80 to-transparent p-4 text-white backdrop-blur-sm'>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='line-clamp-2 font-serif text-lg'>{title}</h3>
        </div>
      </div>
    </DialogTrigger>

    <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className='mt-4'>
        <iframe
          src={url}
          title={title}
          className='h-[70vh] w-full'
          allow='encrypted-media'
        />
      </div>
    </DialogContent>
  </Dialog>
);

export default MediaPreviewDialog;
