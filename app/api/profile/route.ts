import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Получить профиль текущего пользователя
export async function GET() {
  try {
    const user = await requireAuth();

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        master: {
          include: {
            categories: true,
          },
        },
        orders: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            service: {
              include: {
                category: true,
              },
            },
            master: {
              include: {
                user: true,
              },
            },
          },
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = userData;

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    if (error.message === 'Необходима авторизация') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении профиля' },
      { status: 500 }
    );
  }
}

// Обновить профиль пользователя
export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { name, phone, email, currentPassword, newPassword, bio, experience, city, address, workRadius, hourlyRate } = body;

    const updateData: any = {};
    
    // Обновление основных данных пользователя
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    // Изменение email требует проверки уникальности
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email уже используется' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    // Изменение пароля
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Текущий пароль обязателен для смены пароля' },
          { status: 400 }
        );
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!currentUser?.password) {
        return NextResponse.json(
          { error: 'Пароль не установлен' },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Неверный текущий пароль' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Новый пароль должен содержать минимум 6 символов' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Обновление данных пользователя
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Обновление данных мастера, если пользователь - мастер
    if (user.role === 'MASTER' && user.master) {
      const masterUpdateData: any = {};
      
      if (bio !== undefined) masterUpdateData.bio = bio;
      if (experience !== undefined) masterUpdateData.experience = parseInt(experience);
      if (city !== undefined) masterUpdateData.city = city;
      if (address !== undefined) masterUpdateData.address = address;
      if (workRadius !== undefined) masterUpdateData.workRadius = workRadius ? parseInt(workRadius) : null;
      if (hourlyRate !== undefined) masterUpdateData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : null;

      await prisma.master.update({
        where: { id: user.master.id },
        data: masterUpdateData,
      });
    }

    // Убираем пароль из ответа
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Профиль успешно обновлен',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    if (error.message === 'Необходима авторизация') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении профиля' },
      { status: 500 }
    );
  }
}

