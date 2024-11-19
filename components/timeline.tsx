'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import ImageGallery from './image-gallery';
import MediaPreviewDialog from './media-preview-dialog';
import SpotifyEmbed from './podcast-embed';
import YoutubeEmbed from './youtube-embed';

const EmbeddedLinkedInArticle = dynamic(
  () => import('./embedded-linkedin-article'),
  {
    ssr: false,
  }
);

const InstagramEmbed = dynamic(() => import('./instagram-embed'), {
  ssr: false,
});

interface TimelineEvent {
  date: string;
  title: string;
  location: string;
  content: React.ReactNode;
}

interface TimelinePeriod {
  year: keyof typeof yearColors;
  events: TimelineEvent[];
}

interface TimelineEventProps {
  event: TimelineEvent;
  isEven: boolean;
}

const yearColors = {
  2020: 'from-black via-yellow-500 to-red-500', // Black, yellow, and red to represent the Belgian flag
  2022: 'from-blue-500 via-teal-400 to-orange-300', // Ocean blue to vibrant terracotta, evoking Lisbon's coastal vibe
  2023: 'from-green-700 via-red-500 to-amber-600', // Soft foggy cyan to sunset orange, echoing SF’s iconic sunsets
  2024: 'from-cyan-200 via-gray-300 to-orange-400', // Urban grays and blues to capture NYC's skyscrapers and sky
} as const;

const createPath = (height: number) => {
  const segments = Math.floor(height / 600); // One segment every 600px
  let path = 'M80,-10 '; // Start at center

  for (let i = 0; i < segments; i++) {
    const yStart = i * 600;
    const yEnd = yStart + 600;

    if (i % 2 === 0) {
      // Curve to the left, with control points to create smooth transitions
      path += `C30,${yStart + 200} 30,${yEnd - 200} 80,${yEnd} `;
    } else {
      // Curve to the right, with control points to create smooth transitions
      path += `C130,${yStart + 200} 130,${yEnd - 200} 80,${yEnd} `;
    }
  }

  return path;
};

const TimelineEvent: React.FC<TimelineEventProps> = ({ event, isEven }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref as RefObject<Element>, {
    amount: 0.5,
    once: true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      void controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <div className={`flex ${isEven ? 'justify-end' : 'justify-start'} w-full`}>
      <motion.div
        ref={ref}
        initial='hidden'
        animate={controls}
        style={{ width: 'calc(50% - 2.5rem)' }}
        variants={{
          hidden: { opacity: 0, x: isEven ? 50 : -50 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
            x: 0,
          },
        }}
      >
        <div className='relative transform rounded-lg bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:rotate-1 hover:scale-105'>
          <div className='mb-2 flex items-center'>
            <h4 className='font-mono text-lg font-semibold'>{event.date}</h4>
          </div>
          <h3 className='mb-2 font-serif text-xl font-bold'>{event.title}</h3>
          {event.content && (
            <div className='mt-2 rounded bg-white/50 p-4'>{event.content}</div>
          )}
          <div
            className={`absolute top-6 ${
              isEven ? '-left-4 -translate-x-1/2' : '-right-4 translate-x-1/2'
            } h-4 w-4 rotate-45 transform bg-amber-200/50`}
          ></div>
        </div>
      </motion.div>
    </div>
  );
};

const svgPath = createPath(10000);

const Timeline: React.FC = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        Math.ceil(window.innerHeight + window.scrollY) >=
        document.documentElement.scrollHeight;
      setIsAtBottom(bottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToYear = (year: number) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement) {
      yearElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allEvents = timelineData.flatMap((period) =>
    period.events.map((event) => ({ ...event, year: period.year }))
  );

  return (
    <div className='relative min-h-screen bg-neutral-50/40'>
      <div className='container relative mx-auto overflow-hidden px-6 pt-10'>
        <h2 className='mb-24 text-center font-serif text-5xl font-bold italic'>
          My Journey
        </h2>
        <div className='relative' ref={timelineRef}>
          <svg className='absolute' preserveAspectRatio='none'>
            <defs>
              <mask id='pathMask'>
                <motion.path
                  d={svgPath}
                  stroke='white'
                  strokeWidth='40'
                  fill='none'
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                />
              </mask>
            </defs>
          </svg>
          <div
            className={`absolute left-1/2 flex h-full w-40 -translate-x-1/2 transform bg-gradient-to-br from-blue-500/40 to-amber-800/40`}
            style={{
              WebkitMask: 'url(#pathMask)',
              mask: 'url(#pathMask)',
            }}
          />

          {timelineData.map((period, periodIndex) => (
            <div
              key={`${period.year}-${periodIndex}`}
              className='pb-32'
              id={`year-${period.year}`}
            >
              <motion.div
                initial={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 16,
                  opacity: 0,
                  y: -60,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: periodIndex * 0.2,
                    duration: 0.5,
                  },
                  y: -40,
                }}
                viewport={{ amount: 0.8, once: true }}
              >
                <div className='group relative'>
                  <div
                    className={`relative z-10 ${yearColors[period.year]} bg-gradient-to-r px-8 py-3 shadow-lg backdrop-blur-sm transition-all duration-300 before:absolute before:-left-6 before:top-0 before:h-full before:w-6 before:skew-x-[15deg] before:bg-inherit after:absolute after:-right-6 after:top-0 after:h-full after:w-6 after:-skew-x-[15deg] after:bg-inherit group-hover:scale-110 group-hover:shadow-2xl`}
                  >
                    <div className='absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                    <span className='relative z-10 font-mono text-2xl font-bold tracking-wider text-white'>
                      {period.year}
                    </span>
                  </div>

                  <div className='absolute -bottom-1 -left-2 -right-2 h-1/2 skew-x-12 transform bg-black/20 blur-sm' />
                </div>
              </motion.div>

              <div className='space-y-16'>
                {period.events.map((event) => {
                  const globalIndex = allEvents.findIndex(
                    (e) => e.date === event.date && e.title === event.title
                  );
                  return (
                    <TimelineEvent
                      key={`${event.date}-${event.title}`}
                      event={event}
                      isEven={globalIndex % 2 === 0}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            window.scrollTo({
              behavior: 'smooth',
              top: document.documentElement.scrollHeight,
            });
          }}
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 transform transition-all duration-300 ${isAtBottom ? 'pointer-events-none opacity-0' : 'opacity-100'} `}
        >
          <ChevronDown className='h-8 w-8 animate-bounce text-gray-700' />
        </button>
        <div
          className={`fixed right-0 top-0 h-full w-12 bg-gray-200 transition-all duration-300 ${
            isNavVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => {
            setIsNavVisible(true);
          }}
          onMouseLeave={() => {
            setIsNavVisible(false);
          }}
        >
          <div
            className={`absolute right-0 top-0 h-full w-48 bg-white shadow-lg transition-all duration-300 ${
              isNavVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className='p-4'>
              <h3 className='mb-4 text-lg font-bold'>Jump to Year</h3>
              {Array.from(
                new Set(timelineData.map((period) => period.year))
              ).map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    scrollToYear(year);
                  }}
                  className='block w-full px-4 py-2 text-left transition-colors duration-200 hover:bg-gray-100'
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update timelineData type
const timelineData: TimelinePeriod[] = [
  {
    events: [
      {
        content: 'Embedded video podcast placeholder',
        date: '🇵🇹 October',
        location: 'Lisbon',
        title: 'Podcast on my founder story with Emiliano',
      },
      {
        content: (
          <SpotifyEmbed url='https://open.spotify.com/embed/episode/3YuluJlnZ2JtEPRPtrcmwY/video?utm_source=generator' />
        ),
        date: '🌉 September',
        location: 'San Francisco',
        title: 'Getting the podcast bug w Natalie',
      },
      {
        content: (
          <SpotifyEmbed url='https://open.spotify.com/embed/episode/3EbtkeU24u4PJumKIIqQPd/video?utm_source=generator' />
        ),
        date: '🌉 September',
        location: 'San Francisco',
        title: 'My first podcast appearance!',
      },
      {
        content: (
          <InstagramEmbed url='https://www.instagram.com/p/C_kKdzHuGdn/?utm_source=ig_embed&amp;utm_campaign=loading' />
        ),
        date: '🌉 August',
        location: 'San Francisco',
        title: 'Burning Man',
      },
      {
        content: (
          <ImageGallery
            images={[
              {
                alt: 'Conveo in San Francisco',
                src: 'create/conveo-in-sf',
              },
            ]}
          />
        ),
        date: '🌉 July',
        location: 'San Francisco',
        title: 'Start of Y Combinator S24 in San Francisco',
      },
      {
        content: (
          <ImageGallery
            images={[
              {
                alt: 'Accepted into Y Combinator',
                src: 'create/accepted-into-yc',
              },
            ]}
          />
        ),
        date: '🇵🇹 May',
        location: 'Portugal',
        title: 'Accepted into Y Combinator!',
      },
      {
        content: (
          <YoutubeEmbed
            url='https://www.youtube.com/embed/XNbHpJ6vVBQ?si=R5QSbvvsgZY7ikUo'
            title='Co-founded Conveo.ai with Hendrik and Ben'
          />
        ),
        date: '🇧🇪 January',
        location: 'Belgium',
        title: 'Co-founded Conveo.ai with Hendrik and Ben',
      },
    ],
    year: 2024,
  },
  {
    events: [
      {
        content: (
          <InstagramEmbed url='https://www.instagram.com/p/CtJtAQ9tHjn/?utm_source=ig_embed&amp;utm_campaign=loading' />
        ),
        date: '🇵🇹 April',
        location: 'Lisbon',
        title: 'Moved to Lisbon',
      },
    ],
    year: 2023,
  },
  {
    events: [
      {
        content: (
          <EmbeddedLinkedInArticle
            title='Life in the Fast Lane: Growing Professionally and Personally in NYC'
            url='https://www.linkedin.com/pulse/life-fast-lane-growing-professionally-personally-nyc-nicolas-desmedt/'
            imageUrl='/create/nyc-blog-cover'
          />
        ),
        date: '🗽 August',
        location: 'New York City',
        title: 'Back to Belgium (but with a promise to return one day)',
      },
      {
        content: (
          <InstagramEmbed url='https://www.instagram.com/p/ChEqD3KD0yV/?utm_source=ig_embed&amp;utm_campaign=loading' />
        ),
        date: '🗽 May',
        location: 'New York City',
        title: 'Moved to New York City for Business Development at Panenco',
      },
    ],
    year: 2022,
  },
  {
    events: [
      {
        content: '',
        date: '🇧🇪 September',
        location: 'Belgium',
        title: 'Started at Panenco',
      },
      {
        content: (
          <MediaPreviewDialog
            url='https://www.sciencedirect.com/science/article/pii/S221282712100531X#!'
            title='Paper: Active Preference Learning in Product Design Decisions'
            imageUrl='/create/active-preference-learning'
          />
        ),
        date: '🇧🇪 June',
        location: 'Belgium',
        title: 'Graduated MEng in Computer Science',
      },
    ],
    year: 2020,
  },
];

export default Timeline;
