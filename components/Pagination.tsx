'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams();
  
  // Создаем URL с сохранением других query параметров
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  // Генерируем массив страниц для отображения
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Максимум видимых страниц

    if (totalPages <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Если страниц много, показываем с многоточием
      if (currentPage <= 3) {
        // В начале
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // В конце
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // В середине
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Пагинация">
      {/* Первая страница */}
      <Link
        href={createPageUrl(1)}
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
        aria-label="Первая страница"
        aria-disabled={currentPage === 1}
      >
        <ChevronDoubleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>

      {/* Предыдущая страница */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
        aria-label="Предыдущая страница"
        aria-disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>

      {/* Номера страниц */}
      <div className="flex items-center gap-1 sm:gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`flex items-center justify-center min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200 hover:border-primary-200'
              }`}
              aria-label={`Страница ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Следующая страница */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
        aria-label="Следующая страница"
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>

      {/* Последняя страница */}
      <Link
        href={createPageUrl(totalPages)}
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-colors duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
        }`}
        aria-label="Последняя страница"
        aria-disabled={currentPage === totalPages}
      >
        <ChevronDoubleRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
    </nav>
  );
}
