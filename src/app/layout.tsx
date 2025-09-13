import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { ToastProvider } from '@/context/ToastContext';
import ConditionalWrapper from '@/components/ConditionalWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
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
      <body>
        <ToastProvider>
          <ConditionalWrapper>
            {children}
          </ConditionalWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
