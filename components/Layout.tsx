import Link from 'next/link';
import { ReactNode } from 'react';
import CitySelector from './CitySelector';
import ServiceSelector from './ServiceSelector';
import AuthButton from './AuthButton';
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
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-2xl md:text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
            >
              <WrenchScrewdriverIcon className="w-8 h-8 text-primary-600" />
              <span>МастерСервис</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <Link
                href="/search"
                className="nav-link flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden md:inline">Поиск</span>
              </Link>
              <ServiceSelector />
              <CitySelector />
              <Link
                href="/contacts"
                className="nav-link flex items-center gap-1"
              >
                <PhoneIcon className="w-5 h-5" />
                <span className="hidden md:inline">Контакты</span>
              </Link>
              <AuthButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 min-h-[calc(100vh-200px)]">{children}</main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="flex items-center gap-2 text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                <WrenchScrewdriverIcon className="w-7 h-7 text-primary-400" />
                МастерСервис
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Профессиональные мастера на дом. Работаем быстро, качественно и с гарантией.
              </p>
              <div className="flex gap-4">
                <a href="tel:+79991234567" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200">
                  <PhoneIcon className="w-5 h-5 text-white" />
                </a>
                <a href="mailto:info@masterservice.ru" className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200">
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Навигация</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary-400 transition-colors duration-200">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/#services" className="hover:text-primary-400 transition-colors duration-200">
                    Услуги
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover:text-primary-400 transition-colors duration-200">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Контакты</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5 text-primary-400" />
                  <a href="tel:+79991234567" className="hover:text-primary-400 transition-colors duration-200">
                    +7 (999) 123-45-67
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                  <a href="mailto:info@masterservice.ru" className="hover:text-primary-400 transition-colors duration-200">
                    info@masterservice.ru
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary-400" />
                  <span>Работаем 24/7</span>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} МастерСервис. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

