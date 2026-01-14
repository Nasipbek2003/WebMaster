'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  UserIcon,
  WrenchScrewdriverIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Показываем "Панель мастера" только для мастеров */}
        {session.user.role === 'MASTER' && (
          <Link
            href="/master/dashboard"
            className="nav-link flex items-center gap-1 px-2 sm:px-3 py-2"
            title="Панель мастера"
          >
            <WrenchScrewdriverIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden lg:inline">Панель мастера</span>
          </Link>
        )}
        <Link
          href="/profile"
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          title="Личный кабинет"
        >
          <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
          <span className="hidden lg:inline text-xs sm:text-sm font-medium text-primary-700 truncate max-w-[100px] lg:max-w-none">
            {session.user.name || session.user.email?.split('@')[0]}
          </span>
        </Link>
        <button
          onClick={async () => {
            await signOut({ redirect: false });
            window.location.href = '/';
          }}
          className="nav-link flex items-center gap-1 px-2 sm:px-3 py-2"
          title="Выйти"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden lg:inline">Выйти</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/auth/signin"
        className="nav-link px-2 sm:px-3 py-2 text-sm sm:text-base"
      >
        <span className="hidden sm:inline">Войти</span>
        <span className="sm:hidden">Вход</span>
      </Link>
      <Link
        href="/auth/signup"
        className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 whitespace-nowrap"
      >
        Регистрация
      </Link>
    </div>
  );
}

