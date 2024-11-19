'use client';

import { CldImage } from 'next-cloudinary';

interface EmbeddedLinkedInArticleProps {
  title: string;
  url: string;
  imageUrl: string;
}

export default function EmbeddedLinkedInArticle({
  title,
  url,
  imageUrl,
}: EmbeddedLinkedInArticleProps) {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='relative block overflow-hidden rounded-lg'
    >
      <CldImage
        src={imageUrl}
        alt={title}
        width={800}
        height={400}
        className='aspect-[3/2] object-cover'
      />
      <div className='absolute left-0 right-0 top-0 p-4'>
        <p className='text-xs uppercase tracking-wider text-gray-100'>
          LINKEDIN.COM ARTICLE
        </p>
      </div>
    </a>
  );
}
