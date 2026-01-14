'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  priceType: string;
  image: string;
  category: string;
  categoryId?: string;
  categorySlug?: string;
  master?: {
    id: string;
    name: string;
    rating: number;
  };
}

interface Master {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  experience: number;
  price: number;
  categoryId: string;
  categorySlug?: string;
  categoryName: string;
  city?: string;
  description: string;
  services: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setServices([]);
      setMasters([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Параллельно ищем услуги и мастеров
      const [servicesResponse, mastersResponse] = await Promise.allSettled([
        fetch(`/api/services`),
        fetch(`/api/masters/search?q=${encodeURIComponent(searchTerm)}`),
      ]);

      // Обработка услуг
      if (servicesResponse.status === 'fulfilled' && servicesResponse.value.ok) {
        const allServices = await servicesResponse.value.json();
        const searchLower = searchTerm.toLowerCase();
        const filtered = allServices.filter((service: Service) => {
          return (
            service.name?.toLowerCase().includes(searchLower) ||
            service.description?.toLowerCase().includes(searchLower) ||
            service.shortDescription?.toLowerCase().includes(searchLower) ||
            service.category?.toLowerCase().includes(searchLower)
          );
        });
        setServices(filtered);
      } else {
        setServices([]);
      }

      // Обработка мастеров
      if (mastersResponse.status === 'fulfilled' && mastersResponse.value.ok) {
        const data = await mastersResponse.value.json();
        // Убеждаемся, что у всех мастеров есть categorySlug
        const mastersWithSlug = data.map((master: Master) => ({
          ...master,
          categorySlug: master.categorySlug || master.categoryId,
        }));
        setMasters(mastersWithSlug);
      } else {
        // Если API поиска мастеров не существует, ищем через категории
        try {
          const categoriesResponse = await fetch('/api/categories');
          if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            const allMasters: Master[] = [];

            for (const category of categories) {
              try {
                const mastersResponse = await fetch(`/api/masters/by-category/${category.slug || category.id}`);
                if (mastersResponse.ok) {
                  const categoryMasters = await mastersResponse.json();
                  // Добавляем slug категории к каждому мастеру, если его нет
                  const mastersWithSlug = categoryMasters.map((master: Master) => ({
                    ...master,
                    categorySlug: master.categorySlug || category.slug,
                  }));
                  allMasters.push(...mastersWithSlug);
                }
              } catch (err) {
                console.error(`Error fetching masters for category ${category.slug}:`, err);
              }
            }

            const searchLower = searchTerm.toLowerCase();
            const filtered = allMasters.filter((master: Master) => {
              return (
                master.name.toLowerCase().includes(searchLower) ||
                master.description?.toLowerCase().includes(searchLower) ||
                master.categoryName.toLowerCase().includes(searchLower) ||
                master.city?.toLowerCase().includes(searchLower)
              );
            });

            // Удаляем дубликаты, сохраняя информацию о всех категориях
            const uniqueMastersMap = new Map<string, Master>();
            filtered.forEach((master: Master) => {
              const existing = uniqueMastersMap.get(master.id);
              if (!existing || !existing.categorySlug) {
                uniqueMastersMap.set(master.id, master);
              }
            });

            setMasters(Array.from(uniqueMastersMap.values()));
          }
        } catch (err) {
          setMasters([]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при поиске');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Обновляем URL без перезагрузки страницы
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery.trim());
      window.history.pushState({}, '', url.toString());
      performSearch(searchQuery);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
          <MagnifyingGlassIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary-600" />
          Поиск
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Найдите услуги или мастеров</p>
      </div>

      {/* Форма поиска */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите название услуги, мастера или категорию..."
                  className="input-field pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base whitespace-nowrap" disabled={loading}>
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Поиск...</p>
        </div>
      )}

      {!loading && searchQuery && (
        <>
          {/* Результаты поиска услуг */}
          {services.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <WrenchScrewdriverIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                Услуги ({services.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.id}`}
                    className="card group hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="relative h-48 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden rounded-t-2xl">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700">
                          {service.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {service.shortDescription || service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          {service.priceType === 'FROM' && 'от '}
                          {service.price.toLocaleString('ru-RU')} сом
                          {service.priceType === 'HOURLY' && '/час'}
                        </span>
                        {service.categorySlug || service.categoryId ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/masters/${service.categorySlug || service.categoryId}`);
                            }}
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors cursor-pointer"
                          >
                            Мастера →
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Результаты поиска мастеров */}
          {masters.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                Мастера ({masters.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {masters.map((master) => (
                  <Link
                    key={master.id}
                    href={`/masters/${master.categorySlug || master.categoryId}`}
                    className="card group hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="relative h-64 w-full bg-gray-200 overflow-hidden rounded-t-2xl">
                      <Image
                        src={master.photo}
                        alt={master.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {master.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <StarIconSolid className="w-5 h-5 text-yellow-400" />
                          <span className="font-semibold text-gray-900">{master.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-primary-600 font-medium mb-2">{master.categoryName}</p>
                      {master.city && (
                        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {master.city}
                        </p>
                      )}
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                        {master.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Опыт</p>
                          <p className="font-semibold text-gray-900">{master.experience} лет</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Цена от</p>
                          <p className="text-xl font-bold text-primary-600">{master.price} сом</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Сообщение, если ничего не найдено */}
          {!loading && services.length === 0 && masters.length === 0 && searchQuery && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Ничего не найдено</p>
              <p className="text-gray-500 text-sm">Попробуйте изменить запрос поиска</p>
            </div>
          )}
        </>
      )}

      {!loading && !searchQuery && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Введите запрос для поиска</p>
        </div>
      )}
    </div>
  );
}

