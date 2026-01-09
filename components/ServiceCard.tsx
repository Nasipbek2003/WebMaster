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
      <div className="relative h-56 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 z-20">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700 shadow-lg">
            {service.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
          {service.name}
        </h3>
        <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {service.shortDescription}
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500 block mb-1">Цена от</span>
            <span className="text-2xl font-bold gradient-text">
              {service.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          {categoryLink ? (
            <Link
              href={`/masters/${categoryLink}`}
              className="w-full sm:w-auto btn-primary text-center"
            >
              Выбрать мастера →
            </Link>
          ) : (
            <Link
              href={`/services/${service.id}`}
              className="w-full sm:w-auto btn-primary text-center"
            >
              Заказать →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

