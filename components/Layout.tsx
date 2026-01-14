'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import CitySelector from './CitySelector';
import ServiceSelector from './ServiceSelector';
import AuthButton from './AuthButton';
import HeaderSearch from './HeaderSearch';
import { 
  WrenchScrewdriverIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-3 sm:px-4">
          <nav className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 md:gap-4 py-3 sm:py-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-200 flex-shrink-0 self-center sm:self-auto"
            >
              <WrenchScrewdriverIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
              <span className="hidden sm:inline md:hidden">МС</span>
              <span className="hidden md:inline">МастерСервис</span>
              <span className="sm:hidden">МС</span>
            </Link>
            
            {/* Поисковик в шапке - занимает основное пространство */}
            <div className="flex-1 w-full sm:w-auto min-w-0 sm:min-w-[200px] max-w-full sm:max-w-[600px] mx-auto order-3 sm:order-2">
              <HeaderSearch />
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0 order-2 sm:order-3">
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 md:gap-4">
                <ServiceSelector />
                <CitySelector />
              </div>
              <Link
                href="/contacts"
                className="nav-link flex items-center gap-1 px-2 sm:px-3 py-2"
              >
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:inline">Контакты</span>
              </Link>
              <AuthButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 min-h-[calc(100vh-200px)]">{children}</main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 sm:py-12 mt-8 sm:mt-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                <WrenchScrewdriverIcon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-400" />
                МастерСервис
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-3 sm:mb-4">
                Профессиональные мастера на дом. Работаем быстро, качественно и с гарантией.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="tel:+79991234567" className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
                <a href="mailto:info@masterservice.ru" className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Навигация</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary-400 transition-colors duration-200 block py-1">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-primary-400 transition-colors duration-200 block py-1">
                    Услуги
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover:text-primary-400 transition-colors duration-200 block py-1">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Контакты</h4>
              <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-400">
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                  <a href="tel:+79991234567" className="hover:text-primary-400 transition-colors duration-200 break-all">
                    +7 (999) 123-45-67
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                  <a href="mailto:info@masterservice.ru" className="hover:text-primary-400 transition-colors duration-200 break-all">
                    info@masterservice.ru
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0" />
                  <span>Работаем 24/7</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} МастерСервис. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

