'use client';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className='min-h-screen'>
      <main className='container mx-auto px-4'>
        <section className='my-12'>
          <h2 className='mb-4 text-2xl font-semibold'>About Me</h2>
          <p>
            Software engineer with a passion to meet people, share a laugh, and
            create more.
          </p>
          <p>
            Currently in Lisbon 🇵🇹 growing an office for{' '}
            <Link href='https://www.panenco.com'>Panenco</Link> - and happy to
            meet up!
          </p>
        </section>

        <section className='mb-12'>
          <h2 className='mb-4 text-2xl font-semibold'>Featured Article</h2>
          <div className='overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl'>
            <iframe
              src='https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7014139094632906752'
              className='h-96 w-full'
              title='LinkedIn - Growing in NYC'
            ></iframe>
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='mb-4 text-2xl font-semibold'>Work in Progress</h2>
          <p>
            This website is currently a work in progress. I'll be adding more
            content, projects, and images soon. Stay tuned!
          </p>
        </section>
      </main>

      <footer className='bg-4A89C9 py-4 text-center'>
        <Button
          onClick={() => {
            window.open('mailto:nicolasdesmedt97@gmail.com');
          }}
        >
          Get in touch
        </Button>
      </footer>
    </div>
  );
}
