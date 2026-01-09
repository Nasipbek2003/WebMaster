import Link from 'next/link';
import Image from 'next/image';
import { Master } from '@/types';
import { StarIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface MasterCardProps {
  master: Master;
}

export default function MasterCard({ master }: MasterCardProps) {
  const fullStars = Math.floor(master.rating);
  const hasHalfStar = master.rating % 1 !== 0;

  return (
    <div className="card group hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-200">
            <Image
              src={master.photo}
              alt={master.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {master.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
                {hasHalfStar && (
                  <StarOutlineIcon className="w-4 h-4 text-yellow-400" />
                )}
                {Array.from({ length: 5 - Math.ceil(master.rating) }).map((_, i) => (
                  <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {master.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({master.reviewsCount} отзывов)
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Опыт: {master.experience} лет
            </p>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
          {master.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500 block mb-1">Цена от</span>
            <span className="text-2xl font-bold gradient-text">
              {master.price.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${master.phone}`}
              className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200"
            >
              <PhoneIcon className="w-5 h-5 text-white" />
            </a>
            <Link
              href={`/order?masterId=${master.id}`}
              className="btn-primary text-sm px-4 py-2"
            >
              Заказать
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





