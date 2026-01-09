import { prisma } from '@/lib/prisma'
import { UserRole, OrderStatus } from '@prisma/client'

// Утилиты для работы с пользователями
export const userUtils = {
  // Получить пользователя по email
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        master: {
          include: {
            categories: true,
            services: true,
          },
        },
      },
    })
  },

  // Создать нового пользователя
  async create(data: {
    email: string
    name: string
    password: string
    phone?: string
    role?: UserRole
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: data.role || UserRole.CLIENT,
      },
    })
  },

  // Получить всех мастеров
  async getMasters() {
    return prisma.user.findMany({
      where: { role: UserRole.MASTER },
      include: {
        master: {
          include: {
            categories: true,
            services: true,
            reviews: {
              include: {
                client: true,
              },
            },
          },
        },
      },
    })
  },
}

// Утилиты для работы с мастерами
export const masterUtils = {
  // Получить мастеров по категории
  async getByCategory(categoryId: string) {
    return prisma.master.findMany({
      where: {
        categories: {
          some: { id: categoryId },
        },
        isAvailable: true,
      },
      include: {
        user: true,
        categories: true,
        services: true,
        reviews: {
          include: {
            client: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    })
  },

  // Получить мастера по ID
  async getById(id: string) {
    return prisma.master.findUnique({
      where: { id },
      include: {
        user: true,
        categories: true,
        services: true,
        reviews: {
          include: {
            client: true,
          },
        },
        portfolio: true,
      },
    })
  },

  // Обновить рейтинг мастера
  async updateRating(masterId: string) {
    const reviews = await prisma.review.findMany({
      where: { masterId },
    })

    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      
      await prisma.master.update({
        where: { id: masterId },
        data: {
          rating: Math.round(avgRating * 10) / 10, // Округляем до 1 знака после запятой
          reviewsCount: reviews.length,
        },
      })
    }
  },
}

// Утилиты для работы с услугами
export const serviceUtils = {
  // Получить все активные услуги
  async getActive() {
    return prisma.service.findMany({
      where: { isActive: true },
      include: {
        category: true,
        master: {
          include: {
            user: true,
          },
        },
        reviews: {
          include: {
            client: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  },

  // Получить услугу по ID
  async getById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        master: {
          include: {
            user: true,
          },
        },
        reviews: {
          include: {
            client: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  },

  // Получить услуги мастера
  async getByMaster(masterId: string) {
    return prisma.service.findMany({
      where: { 
        masterId,
        isActive: true,
      },
      include: {
        category: true,
        reviews: {
          include: {
            client: true,
          },
        },
      },
    })
  },
}

// Утилиты для работы с заказами
export const orderUtils = {
  // Создать новый заказ
  async create(data: {
    problemDescription: string
    address: string
    city?: string
    preferredTime?: Date
    clientId: string
    serviceId: string
    masterId: string
  }) {
    // Генерируем уникальный номер заказа
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`

    return prisma.order.create({
      data: {
        ...data,
        orderNumber,
        status: OrderStatus.PENDING,
      },
      include: {
        client: true,
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
    })
  },

  // Получить заказы клиента
  async getByClient(clientId: string) {
    return prisma.order.findMany({
      where: { clientId },
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
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  // Получить заказы мастера
  async getByMaster(masterId: string) {
    return prisma.order.findMany({
      where: { masterId },
      include: {
        client: true,
        service: {
          include: {
            category: true,
          },
        },
        review: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  // Обновить статус заказа
  async updateStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        ...(status === OrderStatus.COMPLETED && { completedAt: new Date() }),
      },
    })
  },
}

// Утилиты для работы с отзывами
export const reviewUtils = {
  // Создать отзыв
  async create(data: {
    rating: number
    comment: string
    orderId: string
    clientId: string
    serviceId: string
    masterId: string
  }) {
    const review = await prisma.review.create({
      data,
      include: {
        client: true,
        service: true,
        master: true,
      },
    })

    // Обновляем рейтинг мастера
    await masterUtils.updateRating(data.masterId)

    return review
  },

  // Получить отзывы мастера
  async getByMaster(masterId: string) {
    return prisma.review.findMany({
      where: { masterId },
      include: {
        client: true,
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
}

// Утилиты для работы с категориями
export const categoryUtils = {
  // Получить все активные категории
  async getActive() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            services: {
              where: { isActive: true },
            },
            masters: {
              where: { isAvailable: true },
            },
          },
        },
      },
    })
  },

  // Получить категорию по slug
  async getBySlug(slug: string) {
    return prisma.serviceCategory.findUnique({
      where: { slug },
    })
  },
}




