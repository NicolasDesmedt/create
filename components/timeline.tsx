'use client';

import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';

import ImageGallery from './image-gallery';

// Add interfaces for the data structure
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

interface ParallaxSectionProps {
  children: React.ReactNode;
}

// Update cityColors to be a const assertion for better type inference
const cityColors = {
  Belgium: 'from-amber-100 to-amber-200',
  Lisbon: 'from-sky-100 to-sky-200',
  'New York City': 'from-slate-100 to-slate-200',
  'San Francisco': 'from-rose-100 to-rose-200',
} as const;

// Update component definitions with types
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
    <div
      className={`relative z-10 mb-8 flex ${
        isEven ? 'justify-end' : 'justify-start'
      } w-full`}
    >
      <motion.div
        ref={ref}
        initial='hidden'
        animate={controls}
        style={{
          width: 'calc(50% - 2.5rem)',
        }}
        variants={{
          hidden: { opacity: 0, x: isEven ? 50 : -50 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
            x: 0,
          },
        }}
      >
        <div
          className={`transform rounded-lg bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:rotate-1 hover:scale-105`}
        >
          <div className='mb-2 flex items-center'>
            <div className='mr-2 h-3 w-3 rounded-full bg-current'></div>
            <h4 className='font-mono text-lg font-semibold'>{event.date}</h4>
          </div>
          <h3 className='mb-2 font-serif text-xl font-bold'>{event.title}</h3>
          {event.content && (
            <div className='mt-2 rounded bg-white/50 p-4'>{event.content}</div>
          )}
        </div>
        <div
          className={`absolute top-6 ${
            isEven ? 'left-0 md:-left-4' : 'right-0 md:-right-4'
          } h-4 w-4 transform ${
            isEven ? '-translate-x-1/2' : 'translate-x-1/2'
          } rotate-45 bg-white/80`}
        ></div>
      </motion.div>
    </div>
  );
};

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ['start end', 'end start'],
    target: ref as RefObject<HTMLElement>,
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className='relative'>
      <motion.div ref={ref} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

const estimatedCardHeight = 300;
const verticalSpacing = 150;

// Add a helper function to calculate the total height needed for a period
const calculatePeriodHeight = (period: TimelinePeriod) => {
  return period.events.length * estimatedCardHeight + verticalSpacing;
};

// Update the main Timeline component
const Timeline: React.FC = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentLocation, setCurrentLocation] = useState<
    keyof typeof cityColors
  >(timelineData[0].location);

  const scrollToYear = (year: number) => {
    const yearElement = document.getElementById(`year-${year}`);
    if (yearElement) {
      yearElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sections =
        document.querySelectorAll<HTMLElement>('[data-location]');

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition) {
          if (
            section.dataset.location &&
            section.dataset.location in cityColors
          ) {
            setCurrentLocation(
              section.dataset.location as keyof typeof cityColors
            );
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timelineHeight = timelineRef.current?.clientHeight ?? 1200;
    setSvgHeight(timelineHeight);
  }, [timelineRef]);

  const [svgHeight, setSvgHeight] = useState(5000);

  const totalHeight = timelineData.reduce(
    (total, period) => total + calculatePeriodHeight(period),
    0
  );

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${cityColors[currentLocation]}`}
    >
      <div className='container mx-auto overflow-hidden px-6 py-10'>
        <h2 className='mb-12 text-center font-serif text-5xl font-bold italic'>
          My Journey
        </h2>
        <div
          className='relative'
          ref={timelineRef}
          style={{ height: `${totalHeight}px` }}
        >
          <svg
            className='absolute left-1/2 w-40 -translate-x-1/2 transform'
            viewBox={`0 0 100 ${svgHeight}`}
            preserveAspectRatio='none'
          >
            <motion.path
              d='M50,0 C20,200 80,400 40,600 C10,750 90,900 50,1200 10,1350 90,1500 50,1800 10,1950 90,2100 50,2400 10,2550 90,2700 50,3000'
              stroke='currentColor'
              strokeWidth='40'
              fill='none'
              className='text-gray-900/10'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </svg>

          {timelineData.map((period, periodIndex) => {
            // Calculate the total height of all previous periods
            const previousPeriodsHeight = timelineData
              .slice(0, periodIndex)
              .reduce((total, p) => total + calculatePeriodHeight(p), 0);

            return (
              <ParallaxSection key={`${period.year}-${period.location}`}>
                <div
                  className='mb-16'
                  data-location={period.location}
                  style={{
                    marginTop: periodIndex === 0 ? 0 : `${verticalSpacing}px`,
                    position: 'absolute',
                    top: `${previousPeriodsHeight}px`,
                    width: '100%',
                  }}
                >
                  <div
                    id={`year-${period.year}`}
                    className='mb-8 flex items-center justify-center'
                  >
                    <div className='z-10 flex h-16 w-16 transform items-center justify-center rounded-full border-4 border-current bg-white shadow-lg transition-all duration-300 hover:rotate-12 hover:scale-110'>
                      <span className='font-mono text-lg font-bold'>
                        {period.year}
                      </span>
                    </div>
                  </div>
                  {period.events.map((event, eventIndex) => (
                    <TimelineEvent
                      key={`${event.date}-${event.title}`}
                      event={event}
                      isEven={(periodIndex + eventIndex) % 2 === 0}
                      location={period.location}
                    />
                  ))}
                </div>
              </ParallaxSection>
            );
          })}
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
    location: 'Belgium',
    year: 2024,
  },
  {
    events: [
      {
        content:
          'Video embeds placeholder for "How to Make Friends" and "Being Adventurous"',
        date: 'September',
        title: '2 Podcasts with Natalie',
      },
      {
        content: <ImageGallery />,
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
    location: 'Lisbon',
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
    location: 'San Francisco',
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
