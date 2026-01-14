import { Service, Order, OrderResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Получить список всех услуг (с пагинацией)
 */
export async function getServices(page: number = 1, limit: number = 12): Promise<{
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}> {
  try {
    // Используем внутренний API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/services?page=${page}&limit=${limit}`, {
      cache: 'no-store', // Для SSR
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    // Возвращаем пустую структуру при ошибке
    return {
      services: [],
      pagination: {
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

/**
 * Получить услугу по ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  try {
    // Используем внутренний API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/services/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch service');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

/**
 * Получить список всех категорий услуг
 */
export async function getCategories() {
  try {
    // Используем внутренний API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`, {
      cache: 'no-store', // Для SSR
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Возвращаем пустой массив вместо моковых данных
    return [];
  }
}

/**
 * Отправить заказ
 */
export async function createOrder(order: Order): Promise<OrderResponse> {
  try {
    // Используем внутренний API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to create order' }));
      const errorMessage = errorData.error || 'Failed to create order';
      
      // Если ошибка 401, добавляем флаг авторизации
      if (response.status === 401) {
        throw new Error(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error creating order:', error);
    // Пробрасываем ошибку дальше, чтобы компонент мог её обработать
    throw error;
  }
}

/**
 * Моковые данные для разработки
 */
function getMockServices(): Service[] {
  return [
    {
      id: '1',
      name: 'Сантехник',
      description: 'Профессиональный ремонт сантехники: протечки, засоры, установка и замена смесителей, унитазов, раковин. Работаем с любыми видами сантехнического оборудования. Гарантия на все виды работ.',
      shortDescription: 'Ремонт и установка сантехники, устранение протечек и засоров',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
      category: 'Ремонт',
      reviews: [
        {
          id: '1',
          author: 'Иван Петров',
          rating: 5,
          comment: 'Отличный мастер, быстро устранил протечку. Рекомендую!',
          date: '2024-01-15',
        },
        {
          id: '2',
          author: 'Мария Сидорова',
          rating: 5,
          comment: 'Профессионально установили новую раковину. Очень довольна.',
          date: '2024-01-10',
        },
      ],
    },
    {
      id: '2',
      name: 'Электрик',
      description: 'Электромонтажные работы любой сложности: замена проводки, установка розеток и выключателей, подключение люстр и светильников, ремонт электрощитов. Все работы выполняются с соблюдением техники безопасности.',
      shortDescription: 'Электромонтажные работы, замена проводки, установка розеток',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
      category: 'Ремонт',
      reviews: [
        {
          id: '3',
          author: 'Алексей Козлов',
          rating: 5,
          comment: 'Качественно заменили всю проводку в квартире. Спасибо!',
          date: '2024-01-12',
        },
      ],
    },
    {
      id: '3',
      name: 'Мастер по ремонту бытовой техники',
      description: 'Ремонт холодильников, стиральных машин, посудомоек, микроволновок и другой бытовой техники. Диагностика, замена деталей, профилактическое обслуживание. Работаем с любыми брендами.',
      shortDescription: 'Ремонт холодильников, стиральных машин и другой бытовой техники',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      category: 'Ремонт техники',
      reviews: [
        {
          id: '4',
          author: 'Елена Волкова',
          rating: 4,
          comment: 'Починили стиральную машину за один день. Хороший сервис.',
          date: '2024-01-08',
        },
      ],
    },
    {
      id: '4',
      name: 'Плотник',
      description: 'Изготовление и ремонт мебели, установка дверей и окон, сборка шкафов, ремонт полов. Работаем с деревом, ДСП, МДФ. Индивидуальный подход к каждому заказу.',
      shortDescription: 'Изготовление мебели, установка дверей, ремонт полов',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop',
      category: 'Ремонт',
      reviews: [
        {
          id: '5',
          author: 'Дмитрий Соколов',
          rating: 5,
          comment: 'Собрали кухню быстро и качественно. Мастер профессионал!',
          date: '2024-01-05',
        },
      ],
    },
    {
      id: '5',
      name: 'Маляр-штукатур',
      description: 'Покраска стен и потолков, штукатурные работы, поклейка обоев, декоративная отделка. Используем качественные материалы. Аккуратная работа без грязи.',
      shortDescription: 'Покраска, штукатурка, поклейка обоев',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop',
      category: 'Отделка',
      reviews: [
        {
          id: '6',
          author: 'Ольга Новикова',
          rating: 5,
          comment: 'Покрасили всю квартиру. Результат превзошел ожидания!',
          date: '2024-01-03',
        },
      ],
    },
    {
      id: '6',
      name: 'Установка кондиционеров',
      description: 'Установка и обслуживание кондиционеров, сплит-систем. Монтаж внутренних и наружных блоков, заправка фреоном, чистка и профилактика. Гарантия на установку.',
      shortDescription: 'Установка и обслуживание кондиционеров и сплит-систем',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1621905252472-8af5ffc6b4c0?w=800&h=600&fit=crop',
      category: 'Климат',
      reviews: [
        {
          id: '7',
          author: 'Сергей Морозов',
          rating: 5,
          comment: 'Установили кондиционер за один день. Все работает отлично.',
          date: '2024-01-01',
        },
      ],
    },
  ];
}

