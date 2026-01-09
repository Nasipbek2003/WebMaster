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
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Контакты
        </h1>
        <p className="text-lg text-gray-600">
          Свяжитесь с нами любым удобным способом
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Телефон</h3>
          <a
            href="tel:+79991234567"
            className="text-xl text-primary-600 hover:text-primary-700 font-semibold"
          >
            +7 (999) 123-45-67
          </a>
          <p className="text-gray-500 mt-2">Круглосуточно</p>
        </div>

        <div className="card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Email</h3>
          <a
            href="mailto:info@masterservice.ru"
            className="text-xl text-primary-600 hover:text-primary-700 font-semibold break-all"
          >
            info@masterservice.ru
          </a>
          <p className="text-gray-500 mt-2">Ответим в течение часа</p>
        </div>

        <div className="card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Адрес</h3>
          <p className="text-lg text-gray-700 font-medium">
            г. Москва, ул. Примерная, д. 1
          </p>
          <p className="text-gray-500 mt-2">Офис работает с 9:00 до 18:00</p>
        </div>

        <div className="card p-8 text-center hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Режим работы</h3>
          <p className="text-lg text-gray-700 font-medium">
            Круглосуточно
          </p>
          <p className="text-gray-500 mt-2">Без выходных</p>
        </div>
      </div>

      <div className="card p-8 md:p-12 bg-gradient-to-br from-primary-50 to-blue-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Остались вопросы?
        </h2>
        <p className="text-lg text-gray-700 text-center mb-8">
          Заполните форму заказа, и наш менеджер свяжется с вами в ближайшее время
        </p>
        <div className="text-center">
          <Link
            href="/order"
            className="inline-block btn-primary text-lg"
          >
            Оформить заказ
          </Link>
        </div>
      </div>
    </div>
  );
}


