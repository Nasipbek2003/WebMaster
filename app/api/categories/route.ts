import { NextResponse } from 'next/server';
import { prisma, checkDatabaseConnection } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Проверяем подключение к базе данных
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection failed');
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL environment variable.' },
        { status: 503 }
      );
    }

    const categories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    
    // Более детальная обработка ошибок
    if (error.code === 'P1001' || error.code === 'P1002' || error.code === 'P1017') {
      return NextResponse.json(
        { 
          error: 'Database connection error',
          message: 'Unable to connect to the database. Please check your DATABASE_URL configuration.',
          code: error.code
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}





