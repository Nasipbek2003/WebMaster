import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;
    // Находим категорию по slug или id
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
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    // Получаем мастеров, у которых есть услуги в этой категории
    const services = await prisma.service.findMany({
      where: {
        categoryId: category.id,
        isActive: true,
      },
      include: {
        master: {
          include: {
            user: true,
            categories: true,
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

    // Группируем по мастерам и формируем ответ
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
          categorySlug: category.slug,
          categoryName: category.name,
          phone: master.user.phone || '',
          description: master.bio || `Профессиональный мастер по категории ${category.name}`,
          isAvailable: master.isAvailable,
          services: [],
        });
      }
      
      // Добавляем услугу к мастеру
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

    return NextResponse.json(masters);
  } catch (error) {
    console.error('Error fetching masters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch masters' },
      { status: 500 }
    );
  }
}
