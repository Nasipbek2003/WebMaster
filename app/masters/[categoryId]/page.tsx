import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import MasterCard from '@/components/MasterCard';
import {
  ArrowLeftIcon,
  WrenchScrewdriverIcon,
  BoltIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  CloudIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

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

interface MastersPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function generateMetadata({ params }: MastersPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  const category = await prisma.serviceCategory.findFirst({
    where: {
      OR: [
        { id: categoryId },
        { slug: categoryId },
      ],
    },
  });

  if (!category) {
    return {
      title: 'Категория не найдена - МастерСервис',
    };
  }

  return {
    title: `${category.name} - Мастера - МастерСервис`,
    description: `Выберите мастера по категории ${category.name}`,
  };
}

export default async function MastersPage({ params }: MastersPageProps) {
  const { categoryId } = await params;
  const category = await prisma.serviceCategory.findFirst({
    where: {
      OR: [
        { id: categoryId },
        { slug: categoryId },
      ],
      isActive: true,
    },
  });

  if (!category) {
    notFound();
  }

  // Получаем услуги в этой категории с мастерами
  const services = await prisma.service.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    include: {
      master: {
        include: {
          user: true,
          reviews: {
            include: {
              client: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          },
        },
      },
    },
    distinct: ['masterId'],
  });

  // Группируем по мастерам
  const mastersMap = new Map();
  
  services.forEach((service) => {
    const master = service.master;
    if (!mastersMap.has(master.id) && master.isAvailable) {
      mastersMap.set(master.id, {
        id: master.id,
        name: master.user.name || master.user.email,
        photo: master.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        rating: master.rating,
        reviewsCount: master.reviewsCount,
        experience: master.experience,
        price: service.price,
        categoryId: category.id,
        categoryName: category.name,
        phone: master.user.phone || '',
        description: master.bio || `Профессиональный мастер по категории ${category.name}`,
        isAvailable: master.isAvailable,
        services: [],
      });
    }
    
    const masterData = mastersMap.get(master.id);
    if (masterData) {
      masterData.services.push({
        id: service.id,
        name: service.name,
        price: service.price,
        priceType: service.priceType,
      });
    }
  });

  const masters = Array.from(mastersMap.values());

  return (
    <div className="animate-fade-in px-3 sm:px-4 md:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 sm:gap-2 text-primary-600 hover:text-primary-700 mb-4 sm:mb-6 font-medium transition-colors duration-200 group text-sm sm:text-base"
      >
        <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="hidden sm:inline">Назад на главную</span>
        <span className="sm:hidden">Назад</span>
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          {(() => {
            const IconComponent = getCategoryIcon(category.slug || category.id);
            return (
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
              </div>
            );
          })()}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 gradient-text break-words">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      {masters.length === 0 ? (
        <div className="card p-6 sm:p-8 md:p-10 lg:p-12 text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
            Мастера по этой категории временно недоступны
          </p>
          <Link href="/" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3">
            Вернуться на главную
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-600">
              Найдено мастеров: <span className="font-semibold text-gray-900">{masters.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {masters.map((master, index) => (
              <div
                key={master.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MasterCard master={master} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}





