import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'MASTER') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    // Получаем мастера по userId
    const master = await prisma.master.findUnique({
      where: { userId: session.user.id },
    });

    if (!master) {
      return NextResponse.json(
        { error: 'Мастер не найден' },
        { status: 404 }
      );
    }

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Строим фильтр по статусу
    const where: any = { masterId: master.id };
    if (status) {
      where.status = status;
    }

    // Получаем заказы
    const orders = await prisma.order.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        service: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Форматируем заказы для фронтенда
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      problemDescription: order.problemDescription,
      address: order.address,
      city: order.city,
      preferredTime: order.preferredTime,
      urgency: order.urgency,
      estimatedPrice: order.estimatedPrice,
      finalPrice: order.finalPrice,
      scheduledAt: order.scheduledAt,
      completedAt: order.completedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      client: order.client ? {
        id: order.client.id,
        name: order.client.name || 'Не указано',
        email: order.client.email,
        phone: order.client.phone || 'Не указано',
        address: order.client.address || 'Не указано',
      } : null,
      service: {
        id: order.service.id,
        name: order.service.name,
        description: order.service.description,
        price: order.service.price,
        category: order.service.category,
      },
      review: order.review ? {
        id: order.review.id,
        rating: order.review.rating,
        comment: order.review.comment,
      } : null,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching master orders:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    );
  }
}
