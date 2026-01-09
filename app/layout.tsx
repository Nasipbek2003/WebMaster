import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/Layout';
import SessionProvider from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: {
    default: 'МастерСервис - Вызов мастера на дом',
    template: '%s | МастерСервис',
  },
  description: 'Профессиональные услуги мастеров на дому: сантехник, электрик, ремонт бытовой техники и многое другое. Работаем быстро и качественно.',
  keywords: ['мастер на дом', 'сантехник', 'электрик', 'ремонт', 'бытовая техника', 'вызов мастера'],
  authors: [{ name: 'МастерСервис' }],
  openGraph: {
    title: 'МастерСервис - Вызов мастера на дом',
    description: 'Профессиональные услуги мастеров на дому',
    type: 'website',
    locale: 'ru_RU',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}

