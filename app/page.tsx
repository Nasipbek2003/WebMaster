import { Metadata } from 'next';
import { getCategories, getServices } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';
import ServiceCard from '@/components/ServiceCard';
import { 
  BoltIcon, 
  CheckBadgeIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';

export const metadata: Metadata = {
  title: 'Главная - МастерСервис',
  description: 'Выберите нужную услугу и закажите вызов мастера на дом. Сантехник, электрик, ремонт бытовой техники и многое другое.',
};

export default async function HomePage() {
  const [categories, services] = await Promise.all([
    getCategories(),
    getServices()
  ]);

  // Структурированные данные для SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'МастерСервис',
    description: 'Профессиональные услуги мастеров на дому',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://masterservice.ru',
    telephone: '+7 (999) 123-45-67',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
    },
    priceRange: '$$',
    serviceArea: {
      '@type': 'City',
      name: 'Россия',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
      <section className="mb-10 sm:mb-12 md:mb-16 lg:mb-20 animate-fade-in">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl">
          {/* Фоновое изображение - инструменты и ремонт */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1920&q=80&auto=format&fit=crop")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
          {/* Градиентный оверлей для лучшей читаемости текста */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-primary-600/70 via-primary-700/65 to-primary-800/70"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              МастерСервис
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-primary-100 leading-relaxed max-w-2xl">
              Профессиональные мастера на дом. Быстро, качественно, с гарантией.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                <span className="text-sm sm:text-base font-semibold">Быстро</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CheckBadgeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                <span className="text-sm sm:text-base font-semibold">Качественно</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                <span className="text-sm sm:text-base font-semibold">С гарантией</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории услуг */}
      <section id="categories" className="animate-slide-up scroll-mt-16 sm:scroll-mt-20 mb-16 sm:mb-20">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Категории услуг
          </h2>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-base sm:text-lg text-gray-600">Категории услуг временно недоступны</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Наши услуги */}
      <section id="services" className="animate-slide-up scroll-mt-16 sm:scroll-mt-20">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Наши услуги
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-2">
            Актуальные услуги от проверенных мастеров
          </p>
        </div>
        {services.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-base sm:text-lg text-gray-600">Услуги временно недоступны</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.slice(0, 6).map((service, index) => (
              <div 
                key={service.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
        {services.length > 6 && (
          <div className="text-center mt-8 sm:mt-12">
            <a
              href="/services"
              className="inline-flex items-center gap-2 btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base font-semibold"
            >
              Посмотреть все услуги
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}
      </section>
    </div>
    </>
  );
}

