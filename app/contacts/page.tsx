import { Metadata } from 'next';
import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Контакты - МастерСервис',
  description: 'Свяжитесь с нами. Телефон, email, адрес. Работаем круглосуточно.',
};

export default function ContactsPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 animate-fade-in">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-3 sm:mb-4">
          Контакты
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
          Свяжитесь с нами любым удобным способом
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
        <div className="card p-5 sm:p-6 md:p-8 text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Телефон</h3>
          <a
            href="tel:+79991234567"
            className="text-base sm:text-lg md:text-xl text-primary-600 hover:text-primary-700 font-semibold block break-all"
          >
            +7 (999) 123-45-67
          </a>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Круглосуточно</p>
        </div>

        <div className="card p-5 sm:p-6 md:p-8 text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Email</h3>
          <a
            href="mailto:info@masterservice.ru"
            className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-600 hover:text-primary-700 font-semibold break-all block"
          >
            info@masterservice.ru
          </a>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Ответим в течение часа</p>
        </div>

        <div className="card p-5 sm:p-6 md:p-8 text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Адрес</h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium break-words">
            г. Москва, ул. Примерная, д. 1
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Офис работает с 9:00 до 18:00</p>
        </div>

        <div className="card p-5 sm:p-6 md:p-8 text-center hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Режим работы</h3>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium">
            Круглосуточно
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">Без выходных</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Остались вопросы?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 text-center mb-6 sm:mb-8 px-2">
          Свяжитесь с нами любым удобным способом, и мы поможем вам решить вашу задачу
        </p>
      </div>
    </div>
  );
}


