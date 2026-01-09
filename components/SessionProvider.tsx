'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider
      refetchInterval={0} // Отключаем автоматическое обновление по интервалу
      refetchOnWindowFocus={false} // Отключаем обновление при фокусе на вкладку
    >
      {children}
    </NextAuthSessionProvider>
  );
}

