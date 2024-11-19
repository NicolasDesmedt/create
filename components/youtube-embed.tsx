const YoutubeEmbed = ({ url, title }: { url: string; title: string }) => {
  return (
    <div className='relative aspect-video w-full overflow-hidden rounded-lg bg-muted shadow-lg'>
      <iframe
        src={url}
        title={title}
        className='absolute inset-0 h-full w-full border-0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        loading='lazy'
      />
    </div>
  );
};

export default YoutubeEmbed;
