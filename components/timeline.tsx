'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import SpotifyEmbed from './podcast-embed';

const InstagramEmbed = dynamic(() => import('./instagram-embed'), {
  ssr: false,
});

interface TimelineEvent {
  date: string;
  title: string;
  content: React.ReactNode;
}

interface TimelinePeriod {
  year: number;
  location: keyof typeof cityColors;
  events: TimelineEvent[];
}

interface TimelineEventProps {
  event: TimelineEvent;
  isEven: boolean;
  location: keyof typeof cityColors;
}

const cityColors = {
  Belgium: 'from-black via-yellow-500 to-red-500', // Black, yellow, and red to represent the Belgian flag
  Lisbon: 'from-blue-500 via-teal-400 to-orange-300', // Ocean blue to vibrant terracotta, evoking Lisbon's coastal vibe
  'New York City': 'from-gray-700 via-slate-500 to-blue-600', // Urban grays and blues to capture NYC's skyscrapers and sky
  'San Francisco': 'from-cyan-200 via-gray-300 to-orange-400', // Soft foggy cyan to sunset orange, echoing SF’s iconic sunsets
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
            <div className='mr-2 h-3 w-3 rounded-full bg-current'></div>
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
  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollToYear = (year: number) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement) {
      yearElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='relative min-h-screen bg-white'>
      <div className='container relative mx-auto overflow-hidden px-6 py-10'>
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
              key={`${period.year}-${period.location}-${periodIndex}`}
              className='pb-32'
              id={`year-${period.year}-${periodIndex}`}
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
                <div
                  className={`${cityColors[period.location]} bg-gradient-to-r px-4 py-2 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105`}
                  style={{
                    clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
                    width: '150px',
                  }}
                >
                  <span className='font-mono text-lg font-bold text-white'>
                    {period.year}
                  </span>
                </div>
              </motion.div>

              {/* Events */}
              <div className='space-y-16'>
                {period.events.map((event, eventIndex) => (
                  <TimelineEvent
                    key={`${event.date}-${event.title}`}
                    event={event}
                    isEven={(periodIndex + eventIndex) % 2 === 0}
                    location={period.location}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 transform animate-bounce'>
          <ChevronDown className='h-8 w-8 text-gray-700' />
        </div>
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
        date: 'October',
        title: 'Podcast on my founder story with Emiliano',
      },
    ],
    location: 'Lisbon',
    year: 2024,
  },
  {
    events: [
      {
        content: (
          <SpotifyEmbed url='https://open.spotify.com/embed/episode/3YuluJlnZ2JtEPRPtrcmwY/video?utm_source=generator' />
        ),
        date: 'September',
        title: 'My second podcast appearance!',
      },
      {
        content: (
          <SpotifyEmbed url='https://open.spotify.com/embed/episode/3EbtkeU24u4PJumKIIqQPd/video?utm_source=generator' />
        ),
        date: 'September',
        title: 'My first podcast appearance!',
      },
      {
        content: (
          <InstagramEmbed url='https://www.instagram.com/p/C_kKdzHuGdn/?utm_source=ig_embed&amp;utm_campaign=loading' />
        ),
        date: 'August',
        title: 'Burning Man',
      },
      {
        content: '',
        date: 'August',
        title: 'Split with Conveo',
      },
      {
        content: 'Picture of me and the team placeholder',
        date: 'July',
        title: 'Start of Y Combinator S24 in San Francisco',
      },
    ],
    location: 'San Francisco',
    year: 2024,
  },
  {
    events: [
      {
        content: '',
        date: 'May',
        title: 'Accepted into Y Combinator!',
      },
      {
        content: '',
        date: 'March',
        title: 'Onboarded Dieter as new CTO',
      },
      {
        content: '',
        date: 'January',
        title: 'Co-founded Conveo.ai with Hendrik and Ben',
      },
    ],
    location: 'Lisbon',
    year: 2024,
  },
  {
    events: [
      {
        content: '',
        date: 'April',
        title: 'Moved to Lisbon',
      },
    ],
    location: 'Lisbon',
    year: 2023,
  },
  {
    events: [
      {
        content: 'Blog highlight placeholder',
        date: 'December',
        title: 'Growing Professionally and Personally in NYC',
      },
      {
        content: '',
        date: 'August',
        title: 'Back to Belgium (but with a promise to return one day)',
      },
      {
        content: 'Pictures placeholder',
        date: 'May',
        title: 'Moved to New York City for Business Development at Panenco',
      },
    ],
    location: 'New York City',
    year: 2022,
  },
  {
    events: [
      {
        content: '',
        date: 'September',
        title: 'Started at Panenco',
      },
      {
        content: 'Highlight of published paper placeholder',
        date: 'June',
        title: 'Graduated MEng in Computer Science',
      },
    ],
    location: 'Belgium',
    year: 2020,
  },
];

export default Timeline;
