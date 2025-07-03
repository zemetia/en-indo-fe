'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';

import '@/styles/globals.css';
import '@/styles/colors.css';

import Navbar from '@/components/navigation/Navbar';

import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isLogin = pathname === '/login';

  return (
    <html lang='id'>
      <head>
        <link rel='icon' href='/favicon/favicon.ico' />
        <link
          rel='icon'
          href='/favicon/favicon-16x16.png'
          sizes='16x16'
          type='image/png'
        />
        <link
          rel='icon'
          href='/favicon/favicon-32x32.png'
          sizes='32x32'
          type='image/png'
        />
        <link
          rel='icon'
          href='/favicon/favicon-180x180.png'
          sizes='180x180'
          type='image/png'
        />
        <link
          rel='icon'
          href='/favicon/apple-touch-icon.png'
          sizes='180x180'
          type='image/png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {!isDashboard && !isLogin && <Navbar />}
          <div className={!isDashboard && !isLogin ? 'pt-16' : ''}>
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
