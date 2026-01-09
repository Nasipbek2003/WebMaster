import { NextResponse } from 'next/server';
import { requireMaster } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { PriceType } from '@prisma/client';

// Обновить услугу
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { master } = await requireMaster();
    const body = await request.json();

    // Проверка, что услуга принадлежит мастеру
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    if (existingService.masterId !== master.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этой услуге' },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      shortDescription,
      price,
      priceType,
      duration,
      categoryId,
      images,
      isActive,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (priceType !== undefined) updateData.priceType = priceType as PriceType;
    if (duration !== undefined) updateData.duration = duration ? parseInt(duration) : null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (isActive !== undefined) updateData.isActive = isActive;

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(service);
  } catch (error: any) {
    if (error.message === 'Необходима авторизация' || error.message.includes('мастеров')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении услуги' },
      { status: 500 }
    );
  }
}

// Удалить услугу
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { master } = await requireMaster();

    // Проверка, что услуга принадлежит мастеру
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }

    if (existingService.masterId !== master.id) {
      return NextResponse.json(
        { error: 'Нет доступа к этой услуге' },
        { status: 403 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Услуга удалена' });
  } catch (error: any) {
    if (error.message === 'Необходима авторизация' || error.message.includes('мастеров')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении услуги' },
      { status: 500 }
    );
  }
}

