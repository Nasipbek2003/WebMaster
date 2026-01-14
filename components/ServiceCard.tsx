import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  // Используем categorySlug или categoryId из данных услуги для ссылки
  const categoryLink = (service as any).categorySlug || (service as any).categoryId || null;

  return (
    <div className="card group animate-fade-in">
      <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700 shadow-lg whitespace-nowrap">
            {service.category}
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-200 break-words">
          {service.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-relaxed break-words">
          {service.shortDescription || service.description}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-500 block mb-1">Цена от</span>
            <span className="text-xl sm:text-2xl font-bold gradient-text">
              {service.priceType === 'FROM' && 'от '}
              {service.price.toLocaleString('ru-RU')} сом
              {service.priceType === 'HOURLY' && '/час'}
            </span>
          </div>
          {categoryLink ? (
            <Link
              href={`/masters/${categoryLink}`}
              className="w-full sm:w-auto btn-primary text-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
            >
              <span className="hidden sm:inline">Выбрать мастера</span>
              <span className="sm:hidden">Мастера</span>
              <span className="ml-1">→</span>
            </Link>
          ) : (
            <Link
              href={`/services/${service.id}`}
              className="w-full sm:w-auto btn-primary text-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
            >
              Заказать →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

