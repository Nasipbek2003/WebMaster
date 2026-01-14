import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Указываем, что этот route должен быть динамическим
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Получаем все категории
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
    });

    const allMasters: any[] = [];

    // Получаем мастеров из всех категорий, где имя, описание или категория содержат запрос
    for (const category of categories) {
      const services = await prisma.service.findMany({
        where: {
          categoryId: category.id,
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' as any } },
            { description: { contains: query, mode: 'insensitive' as any } },
          ],
        },
        include: {
          master: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  phone: true,
                },
              },
              reviews: {
                include: {
                  client: true,
                },
                take: 5,
              },
            },
          },
          category: true,
        },
        distinct: ['masterId'],
      });

      for (const service of services) {
        const master = service.master;
        if (master && master.isAvailable) {
          const masterName = master.user.name || master.user.email;
          const masterBio = master.bio || '';
          const masterCity = master.city || '';

          // Проверяем, соответствует ли мастер поисковому запросу
          const matchesQuery =
            masterName.toLowerCase().includes(query.toLowerCase()) ||
            masterBio.toLowerCase().includes(query.toLowerCase()) ||
            masterCity.toLowerCase().includes(query.toLowerCase()) ||
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            service.name.toLowerCase().includes(query.toLowerCase());

          if (matchesQuery) {
            // Проверяем, не добавлен ли уже этот мастер
            let masterData = allMasters.find((m) => m.id === master.id);

            if (!masterData) {
              // Создаем нового мастера
              masterData = {
                id: master.id,
                name: masterName,
                photo: master.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                rating: master.rating,
                reviewsCount: master.reviewsCount,
                experience: master.experience,
                price: service.price,
                categoryId: category.id,
                categorySlug: category.slug,
                categoryName: category.name,
                city: master.city,
                description: master.bio || `Профессиональный мастер по категории ${category.name}`,
                isAvailable: master.isAvailable,
                services: [],
              };
              allMasters.push(masterData);
            }

            // Добавляем услугу к мастеру, если её ещё нет
            if (!masterData.services.find((s: any) => s.id === service.id)) {
              masterData.services.push({
                id: service.id,
                name: service.name,
                price: service.price,
                priceType: service.priceType,
              });
            }
          }
        }
      }
    }

    return NextResponse.json(allMasters);
  } catch (error) {
    console.error('Error searching masters:', error);
    return NextResponse.json(
      { error: 'Ошибка при поиске мастеров' },
      { status: 500 }
    );
  }
}

