'use client';

import Image from 'next/image';
import { Master } from '@/types';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import MasterOrderForm from '@/components/MasterOrderForm';

interface MasterCardProps {
  master: Master;
}

export default function MasterCard({ master }: MasterCardProps) {
  const fullStars = Math.floor(master.rating);
  const hasHalfStar = master.rating % 1 !== 0;

  return (
    <div className="card group hover:scale-[1.02] sm:hover:scale-105 transition-transform duration-300">
      <div className="p-4 sm:p-5 md:p-6">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-200">
            <Image
              src={master.photo}
              alt={master.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 72px, 80px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors break-words">
              {master.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <StarIcon key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                ))}
                {hasHalfStar && (
                  <StarOutlineIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                )}
                {Array.from({ length: 5 - Math.ceil(master.rating) }).map((_, i) => (
                  <StarOutlineIcon key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {master.rating.toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                ({master.reviewsCount} {master.reviewsCount === 1 ? 'отзыв' : master.reviewsCount < 5 ? 'отзыва' : 'отзывов'})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              Опыт: {master.experience} {master.experience === 1 ? 'год' : master.experience < 5 ? 'года' : 'лет'}
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-2 leading-relaxed break-words">
          {master.description}
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="w-full sm:w-auto">
            <span className="text-xs sm:text-sm text-gray-500 block mb-1">Цена от</span>
            <span className="text-xl sm:text-2xl font-bold gradient-text">
              {master.price.toLocaleString('ru-RU')} сом
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <MasterOrderForm
              masterId={master.id}
              masterName={master.name}
              masterPhone={master.phone}
            />
            {master.phone && (
              <a
                href={`tel:${master.phone}`}
                className="hidden sm:flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex-shrink-0"
                title="Позвонить"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





