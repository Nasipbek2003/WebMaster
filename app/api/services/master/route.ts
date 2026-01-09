import { NextResponse } from 'next/server';
import { requireMaster } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { PriceType } from '@prisma/client';

// Получить все услуги мастера
export async function GET() {
  try {
    const { master } = await requireMaster();

    const services = await prisma.service.findMany({
      where: {
        masterId: master.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(services);
  } catch (error: any) {
    if (error.message === 'Необходима авторизация' || error.message.includes('мастеров')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error fetching master services:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении услуг' },
      { status: 500 }
    );
  }
}

// Добавить новую услугу
export async function POST(request: Request) {
  try {
    const { master } = await requireMaster();
    const body = await request.json();

    const {
      name,
      description,
      shortDescription,
      price,
      priceType = 'FIXED',
      duration,
      categoryId,
      images = [],
    } = body;

    // Валидация
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Цена должна быть больше 0' },
        { status: 400 }
      );
    }

    // Проверка существования категории
    const category = await prisma.serviceCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      );
    }

    // Создание услуги
    const service = await prisma.service.create({
      data: {
        name,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        priceType: priceType as PriceType,
        duration: duration ? parseInt(duration) : null,
        categoryId,
        masterId: master.id,
        images: Array.isArray(images) ? images : [],
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Необходима авторизация' || error.message.includes('мастеров')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании услуги' },
      { status: 500 }
    );
  }
}

