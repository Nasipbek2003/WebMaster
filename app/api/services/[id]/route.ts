import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Получаем услугу по ID из базы данных
    const service = await prisma.service.findUnique({
      where: {
        id,
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
          take: 10,
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Преобразуем данные в формат, ожидаемый фронтендом
    const formattedService = {
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
      categorySlug: service.category.slug,
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
    };

    return NextResponse.json(formattedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
