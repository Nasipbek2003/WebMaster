import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ masterId: string }> }
) {
  try {
    const { masterId } = await params;

    const services = await prisma.service.findMany({
      where: {
        masterId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        priceType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching master services:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении услуг мастера' },
      { status: 500 }
    );
  }
}
