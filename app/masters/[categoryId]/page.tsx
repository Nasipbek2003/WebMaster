import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import MasterCard from '@/components/MasterCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
    <div className="animate-fade-in">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium transition-colors duration-200 group"
      >
        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        Назад на главную
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 gradient-text">
              {category.name}
            </h1>
            <p className="text-gray-600 mt-1">{category.description}</p>
          </div>
        </div>
      </div>

      {masters.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            Мастера по этой категории временно недоступны
          </p>
          <Link href="/" className="btn-primary">
            Вернуться на главную
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              Найдено мастеров: <span className="font-semibold text-gray-900">{masters.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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





