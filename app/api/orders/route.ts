import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendNewOrderNotificationToMaster } from '@/lib/email';

// Получить заказы текущего клиента
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем параметры запроса
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Строим фильтр
    const where: any = { clientId: session.user.id };
    if (status) {
      where.status = status;
    }

    // Получаем заказы
    const orders = await prisma.order.findMany({
      where,
      include: {
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
        master: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
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
      service: {
        id: order.service.id,
        name: order.service.name,
        price: order.service.price,
        category: order.service.category,
      },
      master: {
        id: order.master.id,
        name: order.master.user.name || order.master.user.email,
        phone: order.master.user.phone,
        avatar: order.master.user.avatar,
      },
      hasReview: !!order.review,
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заказов' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      serviceId,
      masterId,
      customerName,
      phone,
      address,
      problemDescription,
      preferredTime,
      urgency = 'NORMAL',
    } = body;

    const isAuthenticated = !!session?.user;

    // Валидация обязательных полей
    if (!serviceId || !address || !problemDescription) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    // Для неавторизованных пользователей требуем дополнительные поля
    if (!isAuthenticated) {
      if (!customerName || !phone) {
        return NextResponse.json(
          { error: 'Для неавторизованных пользователей необходимо указать имя и телефон' },
          { status: 400 }
        );
      }
    }

    // Проверяем существование услуги
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        master: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    // Если masterId не указан, используем мастера из услуги
    const finalMasterId = masterId || service.masterId;

    // Проверяем существование мастера и получаем его данные с пользователем
    const master = await prisma.master.findUnique({
      where: { id: finalMasterId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!master) {
      return NextResponse.json(
        { error: 'Мастер не найден' },
        { status: 404 }
      );
    }

    // Генерируем уникальный номер заказа
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Если пользователь авторизован, получаем его данные из базы
    let finalAddress = address;
    let finalPhone = phone;
    let finalCustomerName = customerName;

    if (isAuthenticated && session.user.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, phone: true, address: true },
      });

      if (user) {
        // Используем данные из базы, если они есть, иначе из формы
        finalCustomerName = user.name || customerName || '';
        finalPhone = user.phone || phone || '';
        finalAddress = user.address || address || '';

        // Обновляем данные пользователя, если они были изменены в форме
        const updateData: any = {};
        if (phone && phone !== user.phone) updateData.phone = phone;
        if (address && address !== user.address) updateData.address = address;

        if (Object.keys(updateData).length > 0) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
          });
          // Обновляем финальные значения
          if (updateData.phone) finalPhone = updateData.phone;
          if (updateData.address) finalAddress = updateData.address;
        }
      }
    }

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientId: isAuthenticated && session.user.id ? session.user.id : null,
        serviceId,
        masterId: finalMasterId,
        problemDescription,
        address: finalAddress,
        preferredTime: preferredTime ? new Date(preferredTime) : null,
        urgency: urgency as any,
        estimatedPrice: service.price,
        status: 'PENDING',
      },
    });

    // Отправляем email уведомление мастеру асинхронно (не ждем ответа)
    if (master.user.email) {
      console.log(`📧 Отправка уведомления мастеру на email: ${master.user.email}`);
      sendNewOrderNotificationToMaster(
        master.user.email,
        master.user.name || 'Мастер',
        order.orderNumber,
        finalCustomerName || 'Клиент',
        service.name,
        finalAddress,
        problemDescription,
        preferredTime || undefined
      )
        .then((result) => {
          if (result.success) {
            console.log(`✅ Email уведомление мастеру успешно отправлено: ${result.messageId}`);
          } else {
            console.error(`❌ Не удалось отправить email мастеру: ${result.message || result.error}`);
          }
        })
        .catch((error) => {
          console.error('❌ Ошибка при отправке email уведомления мастеру:', error);
          // Не прерываем создание заказа, если email не отправился
        });
    } else {
      console.warn('⚠️ Email мастера не указан, уведомление не отправлено');
    }

    return NextResponse.json({
      success: true,
      message: 'Заказ успешно создан!',
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    );
  }
}
