import { PrismaClient, UserRole, PriceType, OrderStatus, Urgency } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создаем категории услуг
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { slug: 'plumbing' },
      update: {},
      create: {
        name: 'Сантехник',
        slug: 'plumbing',
        description: 'Ремонт и установка сантехники',
        icon: '🔧',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'electrician' },
      update: {},
      create: {
        name: 'Электрик',
        slug: 'electrician',
        description: 'Электромонтажные работы',
        icon: '⚡',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'appliance' },
      update: {},
      create: {
        name: 'Ремонт техники',
        slug: 'appliance',
        description: 'Ремонт бытовой техники',
        icon: '🔨',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'carpenter' },
      update: {},
      create: {
        name: 'Плотник',
        slug: 'carpenter',
        description: 'Изготовление мебели и ремонт',
        icon: '🪵',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'painter' },
      update: {},
      create: {
        name: 'Маляр-штукатур',
        slug: 'painter',
        description: 'Покраска и отделка',
        icon: '🎨',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
      },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'ac' },
      update: {
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop&auto=format',
      },
      create: {
        name: 'Кондиционеры',
        slug: 'ac',
        description: 'Установка кондиционеров',
        icon: '❄️',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop&auto=format',
      },
    }),
  ])

  console.log('✅ Категории услуг созданы')

  // Создаем пользователей
  const hashedPassword = await bcrypt.hash('123456', 12)

  // Администратор
  const admin = await prisma.user.upsert({
    where: { email: 'admin@masterservice.kg' },
    update: {},
    create: {
      email: 'admin@masterservice.kg',
      name: 'Администратор',
      password: hashedPassword,
      role: UserRole.ADMIN,
      phone: '+996700123456',
    },
  })

  // Клиенты
  const client1 = await prisma.user.upsert({
    where: { email: 'client1@example.com' },
    update: {},
    create: {
      email: 'client1@example.com',
      name: 'Айгуль Токтосунова',
      password: hashedPassword,
      role: UserRole.CLIENT,
      phone: '+996555123456',
    },
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'client2@example.com' },
    update: {},
    create: {
      email: 'client2@example.com',
      name: 'Бекзат Мамбетов',
      password: hashedPassword,
      role: UserRole.CLIENT,
      phone: '+996777987654',
    },
  })

  // Мастера
  const masterUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'master1@example.com' },
      update: {},
      create: {
        email: 'master1@example.com',
        name: 'Алмаз Исаков',
        password: hashedPassword,
        role: UserRole.MASTER,
        phone: '+996555111222',
      },
    }),
    prisma.user.upsert({
      where: { email: 'master2@example.com' },
      update: {},
      create: {
        email: 'master2@example.com',
        name: 'Нурлан Жумабеков',
        password: hashedPassword,
        role: UserRole.MASTER,
        phone: '+996777333444',
      },
    }),
    prisma.user.upsert({
      where: { email: 'master3@example.com' },
      update: {},
      create: {
        email: 'master3@example.com',
        name: 'Эркин Токтогулов',
        password: hashedPassword,
        role: UserRole.MASTER,
        phone: '+996555555666',
      },
    }),
    prisma.user.upsert({
      where: { email: 'master4@example.com' },
      update: {},
      create: {
        email: 'master4@example.com',
        name: 'Жаныбек Сулайманов',
        password: hashedPassword,
        role: UserRole.MASTER,
        phone: '+996777777888',
      },
    }),
  ])

  console.log('✅ Пользователи созданы')

  // Создаем профили мастеров
  const masters = await Promise.all([
    prisma.master.upsert({
      where: { userId: masterUsers[0].id },
      update: {},
      create: {
        userId: masterUsers[0].id,
        bio: 'Опытный сантехник с 8-летним стажем. Специализируюсь на ремонте и установке сантехники.',
        experience: 8,
        hourlyRate: 1500,
        isVerified: true,
        rating: 4.8,
        reviewsCount: 45,
        workRadius: 15,
        address: 'мкр. Джал, 23',
        city: 'Бишкек',
        categories: {
          connect: [{ id: categories[0].id }], // Сантехник
        },
      },
    }),
    prisma.master.upsert({
      where: { userId: masterUsers[1].id },
      update: {},
      create: {
        userId: masterUsers[1].id,
        bio: 'Электрик высшей категории. Выполняю любые электромонтажные работы.',
        experience: 12,
        hourlyRate: 1800,
        isVerified: true,
        rating: 4.9,
        reviewsCount: 67,
        workRadius: 20,
        address: 'ул. Токтогула, 145',
        city: 'Бишкек',
        categories: {
          connect: [{ id: categories[1].id }], // Электрик
        },
      },
    }),
    prisma.master.upsert({
      where: { userId: masterUsers[2].id },
      update: {},
      create: {
        userId: masterUsers[2].id,
        bio: 'Ремонт бытовой техники любой сложности. Работаю с гарантией.',
        experience: 6,
        hourlyRate: 1200,
        isVerified: true,
        rating: 4.7,
        reviewsCount: 32,
        workRadius: 10,
        address: 'мкр. Асанбай, 12/1',
        city: 'Бишкек',
        categories: {
          connect: [{ id: categories[2].id }], // Ремонт техники
        },
      },
    }),
    prisma.master.upsert({
      where: { userId: masterUsers[3].id },
      update: {},
      create: {
        userId: masterUsers[3].id,
        bio: 'Плотник-краснодеревщик. Изготавливаю мебель на заказ.',
        experience: 15,
        hourlyRate: 2000,
        isVerified: true,
        rating: 4.9,
        reviewsCount: 28,
        workRadius: 25,
        address: 'ул. Ибраимова, 67',
        city: 'Бишкек',
        categories: {
          connect: [{ id: categories[3].id }], // Плотник
        },
      },
    }),
  ])

  console.log('✅ Мастера созданы')

  // Создаем услуги
  const services = await Promise.all([
    // Сантехник
    prisma.service.create({
      data: {
        name: 'Замена смесителя',
        description: 'Профессиональная замена смесителя в ванной или на кухне. Включает демонтаж старого смесителя, установку нового, проверку герметичности соединений.',
        shortDescription: 'Замена смесителя в ванной или на кухне',
        price: 2500,
        priceType: PriceType.FIXED,
        duration: 120,
        images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'],
        categoryId: categories[0].id,
        masterId: masters[0].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Устранение засора',
        description: 'Прочистка канализационных труб современным оборудованием. Устранение засоров любой сложности в раковинах, ваннах, унитазах.',
        shortDescription: 'Прочистка канализации и устранение засоров',
        price: 1500,
        priceType: PriceType.FROM,
        duration: 60,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
        categoryId: categories[0].id,
        masterId: masters[0].id,
      },
    }),
    // Электрик
    prisma.service.create({
      data: {
        name: 'Замена проводки',
        description: 'Полная замена электропроводки в квартире или доме. Современные материалы, соблюдение всех норм безопасности.',
        shortDescription: 'Замена электропроводки в квартире',
        price: 15000,
        priceType: PriceType.FROM,
        duration: 480,
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80'],
        categoryId: categories[1].id,
        masterId: masters[1].id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Установка розеток',
        description: 'Установка дополнительных розеток и выключателей. Штробление стен, прокладка кабеля, подключение.',
        shortDescription: 'Установка розеток и выключателей',
        price: 800,
        priceType: PriceType.FIXED,
        duration: 90,
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'],
        categoryId: categories[1].id,
        masterId: masters[1].id,
      },
    }),
    // Ремонт техники
    prisma.service.create({
      data: {
        name: 'Ремонт стиральной машины',
        description: 'Диагностика и ремонт стиральных машин всех марок. Замена подшипников, ремней, насосов, электроники.',
        shortDescription: 'Ремонт стиральных машин на дому',
        price: 2000,
        priceType: PriceType.FROM,
        duration: 180,
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80'],
        categoryId: categories[2].id,
        masterId: masters[2].id,
      },
    }),
    // Плотник
    prisma.service.create({
      data: {
        name: 'Изготовление кухни',
        description: 'Изготовление кухонной мебели по индивидуальным размерам. Качественные материалы, современная фурнитура.',
        shortDescription: 'Кухонная мебель на заказ',
        price: 50000,
        priceType: PriceType.FROM,
        duration: 2400,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
        categoryId: categories[3].id,
        masterId: masters[3].id,
      },
    }),
  ])

  console.log('✅ Услуги созданы')

  // Создаем заказы
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        status: OrderStatus.COMPLETED,
        problemDescription: 'Протекает смеситель на кухне, нужна срочная замена',
        address: 'мкр. Восток-5, д. 12, кв. 45',
        city: 'Бишкек',
        preferredTime: new Date('2024-01-15T10:00:00Z'),
        urgency: Urgency.HIGH,
        estimatedPrice: 2500,
        finalPrice: 2500,
        scheduledAt: new Date('2024-01-15T10:00:00Z'),
        completedAt: new Date('2024-01-15T12:30:00Z'),
        clientId: client1.id,
        serviceId: services[0].id,
        masterId: masters[0].id,
      },
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-002',
        status: OrderStatus.IN_PROGRESS,
        problemDescription: 'Нужно установить дополнительные розетки в гостиной',
        address: 'ул. Манаса, д. 89, кв. 12',
        city: 'Бишкек',
        preferredTime: new Date('2024-01-20T14:00:00Z'),
        urgency: Urgency.NORMAL,
        estimatedPrice: 3200,
        scheduledAt: new Date('2024-01-20T14:00:00Z'),
        clientId: client2.id,
        serviceId: services[3].id,
        masterId: masters[1].id,
      },
    }),
  ])

  console.log('✅ Заказы созданы')

  // Создаем отзывы
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Отличная работа! Мастер приехал вовремя, быстро заменил смеситель. Все аккуратно, чисто. Рекомендую!',
      orderId: orders[0].id,
      clientId: client1.id,
      serviceId: services[0].id,
      masterId: masters[0].id,
    },
  })

  console.log('✅ Отзывы созданы')

  // Создаем портфолио
  await Promise.all([
    prisma.portfolio.create({
      data: {
        title: 'Замена сантехники в ванной',
        description: 'Полная замена сантехники: ванна, унитаз, раковина, смесители',
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
          'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&q=80',
        ],
        masterId: masters[0].id,
      },
    }),
    prisma.portfolio.create({
      data: {
        title: 'Электромонтаж в новой квартире',
        description: 'Полный электромонтаж в 3-комнатной квартире',
        images: [
          'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80',
        ],
        masterId: masters[1].id,
      },
    }),
  ])

  console.log('✅ Портфолио создано')
  console.log('🎉 База данных успешно заполнена!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })




