import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Получаем все активные услуги из базы данных
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        master: {
          include: {
            user: true,
          },
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Преобразуем данные в формат, ожидаемый фронтендом
    const formattedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription || service.description.substring(0, 100) + '...',
      price: service.price,
      priceType: service.priceType,
      duration: service.duration,
      image: service.images && service.images.length > 0 ? service.images[0] : 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
      category: service.category.name,
      categoryId: service.category.id,
      categorySlug: service.category.slug, // Добавляем slug для ссылок
      master: {
        id: service.master.id,
        name: service.master.user.name || service.master.user.email,
        rating: service.master.rating,
        reviewsCount: service.master.reviewsCount,
      },
      reviews: service.reviews.map((review) => ({
        id: review.id,
        author: review.client.name || review.client.email,
        rating: review.rating,
        comment: review.comment,
        date: review.createdAt.toISOString().split('T')[0],
      })),
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}






