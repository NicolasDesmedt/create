import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  description: `Nicolas Desmedt's portfolio website`,
  title: 'Nicolas Desmedt || Software Engineer & People Enthusiast',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
      <Analytics />
    </html>
  );
}
