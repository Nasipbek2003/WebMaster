import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Файл должен быть изображением' },
        { status: 400 }
      );
    }

    // Проверка размера файла (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      );
    }

    // Создаем уникальное имя файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${user.id}-${timestamp}-${originalName}`;
    
    // Путь для сохранения файла
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    
    // Создаем директорию, если её нет
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, fileName);

    // Сохраняем файл
    await writeFile(filePath, buffer);

    // Относительный путь от public для использования в приложении
    const publicPath = `/uploads/avatars/${fileName}`;

    // Удаляем старое фото, если оно есть
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatar: true },
    });

    if (currentUser?.avatar && currentUser.avatar.startsWith('/uploads/avatars/')) {
      const oldFilePath = join(process.cwd(), 'public', currentUser.avatar);
      try {
        const { unlink } = await import('fs/promises');
        if (existsSync(oldFilePath)) {
          await unlink(oldFilePath);
        }
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    // Обновляем путь в базе данных
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar: publicPath },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: 'Фото успешно загружено',
      avatar: updatedUser.avatar,
    });
  } catch (error: any) {
    if (error.message === 'Необходима авторизация') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке фото' },
      { status: 500 }
    );
  }
}

