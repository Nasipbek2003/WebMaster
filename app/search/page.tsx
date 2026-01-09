'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const type = searchParams?.get('type') || 'services'; // 'services' or 'masters'

  const [searchQuery, setSearchQuery] = useState(query);
  const [searchType, setSearchType] = useState<'services' | 'masters'>(type as 'services' | 'masters');
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, type as 'services' | 'masters');
    }
  }, [query, type]);

  const performSearch = async (searchTerm: string, searchType: 'services' | 'masters') => {
    if (!searchTerm.trim()) {
      setServices([]);
      setMasters([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (searchType === 'services') {
        // Поиск услуг
        const response = await fetch(`/api/services`);
        if (!response.ok) throw new Error('Ошибка при поиске услуг');

        const allServices = await response.json();
        const filtered = allServices.filter((service: Service) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            service.name?.toLowerCase().includes(searchLower) ||
            service.description?.toLowerCase().includes(searchLower) ||
            service.shortDescription?.toLowerCase().includes(searchLower) ||
            service.category?.toLowerCase().includes(searchLower)
          );
        });

        setServices(filtered);
        setMasters([]);
      } else {
        // Поиск мастеров
        const response = await fetch(`/api/masters/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          // Если API поиска мастеров не существует, ищем через категории
          const categoriesResponse = await fetch('/api/categories');
          if (!categoriesResponse.ok) throw new Error('Ошибка при поиске мастеров');

          const categories = await categoriesResponse.json();
          const allMasters: Master[] = [];

          // Получаем мастеров из всех категорий
          for (const category of categories) {
            try {
              // Используем slug вместо id для поиска мастеров
              const mastersResponse = await fetch(`/api/masters/${category.slug || category.id}`);
              if (mastersResponse.ok) {
                const categoryMasters = await mastersResponse.json();
                allMasters.push(...categoryMasters);
              }
            } catch (err) {
              // Продолжаем поиск
              console.error(`Error fetching masters for category ${category.slug}:`, err);
            }
          }

          const filtered = allMasters.filter((master: Master) =>
            master.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            master.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            master.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            master.city?.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // Удаляем дубликаты
          const uniqueMasters = Array.from(
            new Map(filtered.map((master: Master) => [master.id, master])).values()
          );

          setMasters(uniqueMasters);
          setServices([]);
          return;
        }

        const data = await response.json();
        setMasters(data);
        setServices([]);
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при поиске');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery, searchType);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <MagnifyingGlassIcon className="w-10 h-10 text-primary-600" />
          Поиск
        </h1>
        <p className="text-gray-600">Найдите услуги или мастеров</p>
      </div>

      {/* Форма поиска */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Введите название услуги, мастера или категорию..."
                  className="input-field pl-12 pr-4 py-3 text-base"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary px-8 py-3" disabled={loading}>
              {loading ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="services"
                checked={searchType === 'services'}
                onChange={(e) => setSearchType('services')}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">Услуги</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="masters"
                checked={searchType === 'masters'}
                onChange={(e) => setSearchType('masters')}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm font-medium text-gray-700">Мастера</span>
            </label>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Результаты поиска услуг */}
      {searchType === 'services' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Найдено услуг: {services.length}
          </h2>
          {services.length === 0 && searchQuery ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Услуги не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="card group hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="relative h-48 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
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
                        {service.price.toLocaleString('ru-RU')} ₽
                        {service.priceType === 'HOURLY' && '/час'}
                      </span>
                      {service.categorySlug || service.categoryId ? (
                        <Link
                          href={`/masters/${service.categorySlug || service.categoryId}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Мастера →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Результаты поиска мастеров */}
      {searchType === 'masters' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Найдено мастеров: {masters.length}
          </h2>
          {masters.length === 0 && searchQuery ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Мастера не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masters.map((master) => (
                <Link
                  key={master.id}
                  href={`/masters/${master.categoryId}`}
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
                        <p className="text-xl font-bold text-primary-600">{master.price} ₽</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

