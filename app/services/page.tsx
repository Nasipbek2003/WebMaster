import { Metadata } from 'next';
import { getServices } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

interface ServicesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Все услуги - МастерСервис',
  description: 'Полный каталог услуг от проверенных мастеров. Сантехник, электрик, ремонт техники и многое другое.',
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const { services, pagination } = await getServices(currentPage, 12);

  return (
    <div className="animate-fade-in px-3 sm:px-4 md:px-6">
      <div className="mb-6 sm:mb-8">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 font-medium transition-colors duration-200 group text-sm sm:text-base"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="hidden sm:inline">Назад на главную</span>
          <span className="sm:hidden">Назад</span>
        </Link>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Все услуги
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Выберите нужную услугу от проверенных мастеров
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Услуги временно недоступны</h3>
            <p className="text-gray-600">Мы работаем над добавлением новых услуг. Попробуйте позже.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Найдено услуг: <span className="font-semibold text-gray-900">{pagination.totalCount}</span>
              {pagination.totalPages > 1 && (
                <span className="ml-2">
                  (Страница {pagination.page} из {pagination.totalPages})
                </span>
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 sm:mt-12">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                baseUrl="/services"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}