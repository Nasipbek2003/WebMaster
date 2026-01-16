'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import CitySelector from './CitySelector';
import ServiceSelector from './ServiceSelector';
import AuthButton from './AuthButton';
import HeaderSearch from './HeaderSearch';
import MobileMenu from './MobileMenu';
import { 
  WrenchScrewdriverIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

// Instagram icon component (since it's not in heroicons)
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

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
                className="nav-link hidden sm:flex items-center gap-1 px-2 sm:px-3 py-2"
              >
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden lg:inline">Контакты</span>
              </Link>
              <AuthButton />
              <MobileMenu />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 min-h-[calc(100vh-200px)]">{children}</main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-4 sm:py-6 md:py-8 mt-4 sm:mt-8 md:mt-12">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="sm:col-span-2 lg:col-span-2">
              <h3 className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                <WrenchScrewdriverIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-400" />
                МастерСервис
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-2 sm:mb-3">
                Профессиональные мастера на дом. Работаем быстро, качественно и с гарантией.
              </p>
              <div className="flex gap-2 sm:gap-3">
                <a href="tel:+996707490348" className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200" title="Позвонить">
                  <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </a>
                <a href="https://wa.me/996707490348" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors duration-200" title="WhatsApp">
                  <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </a>
                <a href="mailto:bkalyev79@gmail.com" className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200" title="Email">
                  <EnvelopeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </a>
                <a href="https://www.instagram.com/ka1yevvv__/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-lg flex items-center justify-center hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-colors duration-200" title="Instagram">
                  <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">Навигация</h4>
              <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary-400 transition-colors duration-200 block py-0.5">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-primary-400 transition-colors duration-200 block py-0.5">
                    Услуги
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover:text-primary-400 transition-colors duration-200 block py-0.5">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">Контакты</h4>
              <div className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-gray-400">
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                  <a href="tel:+996707490348" className="hover:text-primary-400 transition-colors duration-200 break-all">
                    0707 490 348
                  </a>
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <EnvelopeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                  <a href="mailto:bkalyev79@gmail.com" className="hover:text-primary-400 transition-colors duration-200 break-all">
                    bkalyev79@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                  <a href="https://wa.me/996707490348" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors duration-200">
                    WhatsApp
                  </a>
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 flex-shrink-0" />
                  <a href="https://www.instagram.com/ka1yevvv__/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors duration-200">
                    @ka1yevvv__
                  </a>
                </p>
                <p className="flex items-center gap-1.5 sm:gap-2">
                  <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400 flex-shrink-0" />
                  <span>Работаем 24/7</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-3 sm:pt-4 md:pt-6 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} МастерСервис. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

