const SpotifyEmbed = ({ url }: { url: string }) => {
  return (
    <div className='relative w-full pt-[56.25%]'>
      <iframe
        className='absolute inset-0 h-full w-full rounded-xl border-0'
        src={url}
        allowFullScreen
        allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
        loading='lazy'
      />
    </div>
  );
};

export default SpotifyEmbed;
