import Link from 'next/link';
import Image from 'next/image';
import { ServiceCategory } from '@/types';

interface CategoryCardProps {
  category: ServiceCategory;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/masters/${category.slug}`}
      className="card group animate-fade-in hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-56 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : category.icon ? (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <span className="text-6xl md:text-7xl transition-transform duration-300 group-hover:scale-110">
              {category.icon}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-4xl">🔧</span>
            </div>
          </div>
        )}
        {category.icon && (
          <div className="absolute top-4 right-4 z-20">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">{category.icon}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}
        <div className="flex items-center justify-end pt-4 border-t border-gray-100">
          <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-200">
            Выбрать мастеров →
          </span>
        </div>
      </div>
    </Link>
  );
}
