import { Metadata } from 'next';
import { getCategories } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';
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
  const categories = await getCategories();

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
      <section className="mb-16 md:mb-20 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white shadow-2xl">
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              МастерСервис
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed max-w-2xl">
              Профессиональные мастера на дом. Быстро, качественно, с гарантией.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <BoltIcon className="w-6 h-6 text-yellow-300" />
                <span className="font-semibold">Быстро</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CheckBadgeIcon className="w-6 h-6 text-green-300" />
                <span className="font-semibold">Качественно</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <ShieldCheckIcon className="w-6 h-6 text-blue-300" />
                <span className="font-semibold">С гарантией</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="animate-slide-up scroll-mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Наши услуги
          </h2>
          <div className="hidden md:block w-24 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Категории услуг временно недоступны</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
    </div>
    </>
  );
}

