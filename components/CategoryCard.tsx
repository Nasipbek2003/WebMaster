import Link from 'next/link';
import Image from 'next/image';
import {
  WrenchScrewdriverIcon,
  BoltIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  CloudIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { ServiceCategory } from '@/types';

// Функция для получения иконки категории
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'plumbing':
      return WrenchScrewdriverIcon;
    case 'electrician':
      return BoltIcon;
    case 'appliance':
      return Cog6ToothIcon;
    case 'carpenter':
      return CubeIcon;
    case 'painter':
      return PaintBrushIcon;
    case 'ac':
      return CloudIcon;
    default:
      return WrenchScrewdriverIcon;
  }
};

interface CategoryCardProps {
  category: ServiceCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = getCategoryIcon(category.id);
  
  return (
    <Link 
      href={`/masters/${category.slug}`}
      className="card group animate-fade-in hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48 sm:h-56 md:h-64 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
        )}
        {/* Иконка в правом верхнем углу */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors duration-200 break-words">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-relaxed break-words">
            {category.description}
          </p>
        )}
        <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-gray-100">
          <span className="text-sm sm:text-base text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-200">
            <span className="hidden sm:inline">Выбрать мастеров</span>
            <span className="sm:hidden">Мастера</span>
            <span className="ml-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
