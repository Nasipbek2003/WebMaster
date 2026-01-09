import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from './prisma';

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        master: true,
      },
    });

    return user;
  } catch (error) {
    // Если ошибка декодирования JWT, возвращаем null
    // Это может произойти если токен был создан с другим секретом
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Необходима авторизация');
  }
  return user;
}

export async function requireMaster() {
  const user = await requireAuth();
  if (user.role !== 'MASTER') {
    throw new Error('Доступно только для мастеров');
  }
  if (!user.master) {
    throw new Error('Профиль мастера не найден');
  }
  return { user, master: user.master };
}

