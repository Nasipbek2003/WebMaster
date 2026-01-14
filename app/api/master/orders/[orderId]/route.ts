import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';
import { sendOrderStatusUpdateToClient } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
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

    const { orderId } = await params;
    const body = await request.json();
    const { status, scheduledAt, finalPrice } = body;

    // Получаем мастера
    const master = await prisma.master.findUnique({
      where: { userId: session.user.id },
    });

    if (!master) {
      return NextResponse.json(
        { error: 'Мастер не найден' },
        { status: 404 }
      );
    }

    // Проверяем, что заказ принадлежит этому мастеру
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        master: true,
        client: true,
        service: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      );
    }

    if (order.masterId !== master.id) {
      return NextResponse.json(
        { error: 'Заказ не принадлежит вам' },
        { status: 403 }
      );
    }

    // Подготавливаем данные для обновления
    const updateData: any = {};
    
    if (status && Object.values(OrderStatus).includes(status)) {
      updateData.status = status as OrderStatus;
      
      // Автоматически устанавливаем даты в зависимости от статуса
      if (status === 'CONFIRMED' || status === 'IN_PROGRESS') {
        if (scheduledAt) {
          updateData.scheduledAt = new Date(scheduledAt);
        }
      }
      
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
        if (finalPrice !== undefined) {
          updateData.finalPrice = parseFloat(finalPrice);
        }
      }
      
      if (status === 'CANCELLED') {
        updateData.scheduledAt = null;
      }
    }

    if (finalPrice !== undefined && status !== 'COMPLETED') {
      updateData.finalPrice = parseFloat(finalPrice);
    }

    // Сохраняем старый статус для проверки изменений
    const oldStatus = order.status;

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
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
              },
            },
          },
        },
      },
    });

    // Отправляем email уведомление клиенту, если статус изменился и клиент авторизован
    if (status && status !== oldStatus && updatedOrder.client && updatedOrder.client.email) {
      console.log(`📧 Отправка уведомления клиенту на email: ${updatedOrder.client.email}`);
      console.log(`   Статус изменился: ${oldStatus} → ${status}`);
      sendOrderStatusUpdateToClient(
        updatedOrder.client.email,
        updatedOrder.client.name || 'Клиент',
        updatedOrder.orderNumber,
        updatedOrder.service.name,
        updatedOrder.master.user.name || 'Мастер',
        status,
        updatedOrder.scheduledAt || undefined,
        updatedOrder.finalPrice || undefined
      )
        .then((result) => {
          if (result.success) {
            console.log(`✅ Email уведомление клиенту успешно отправлено: ${result.messageId}`);
          } else {
            console.error(`❌ Не удалось отправить email клиенту: ${result.message || result.error}`);
          }
        })
        .catch((error) => {
          console.error('❌ Ошибка при отправке email уведомления клиенту:', error);
          // Не прерываем обновление заказа, если email не отправился
        });
    } else {
      if (!updatedOrder.client) {
        console.log('ℹ️ Клиент не авторизован, email уведомление не отправлено');
      } else if (!updatedOrder.client.email) {
        console.warn('⚠️ Email клиента не указан, уведомление не отправлено');
      } else if (status === oldStatus) {
        console.log('ℹ️ Статус не изменился, email уведомление не требуется');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Статус заказа обновлен',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении статуса заказа' },
      { status: 500 }
    );
  }
}
