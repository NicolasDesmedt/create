'use client';

interface InstagramEmbedProps {
  url: string;
}

const InstagramEmbed = ({ url }: InstagramEmbedProps) => {
  return (
    <div className='flex justify-center'>
      <blockquote
        className='instagram-media w-full min-w-[326px] max-w-[540px] rounded bg-white shadow-sm'
        data-instgrm-permalink={url}
        data-instgrm-version='14'
      >
        <div className='p-4'>
          <a
            href={url}
            className='block w-full bg-white text-center no-underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='flex items-center'>
              <div className='mr-3.5 h-10 w-10 flex-shrink-0 rounded-full bg-[#F4F4F4]' />
              <div className='flex flex-grow flex-col justify-center'>
                <div className='mb-1.5 h-3.5 w-24 rounded bg-[#F4F4F4]' />
                <div className='h-3.5 w-14 rounded bg-[#F4F4F4]' />
              </div>
            </div>
            <div className='py-[19%]' />
            <div className='mx-auto mb-3 h-12 w-12'>
              {/* Instagram Logo SVG */}
            </div>
            <div className='pt-2'>
              <div className='font-sans text-sm font-semibold leading-[18px] text-[#3897f0]'>
                View this post on Instagram
              </div>
            </div>
          </a>
          <p className='mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-sans text-sm leading-[17px] text-[#c9c8cd]'>
            <a
              href='https://www.instagram.com/p/C_kKdzHuGdn/?utm_source=ig_embed&amp;utm_campaign=loading'
              className='font-sans text-sm text-[#c9c8cd] no-underline'
              target='_blank'
              rel='noopener noreferrer'
            >
              A post shared by Nicolas Desmedt (@nicolasdesmedt)
            </a>
          </p>
        </div>
      </blockquote>
      <script async src='//www.instagram.com/embed.js' />
    </div>
  );
};

export default InstagramEmbed;
