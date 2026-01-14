# МастерСервис

Современное веб-приложение для онлайн-заказа услуг по вызову мастера на дом.

## Технологии

- **Frontend**: React 18 + Next.js 14 (App Router)
- **Язык**: TypeScript
- **Стили**: Tailwind CSS
- **Архитектура**: Frontend и Backend разделены, данные через REST API

## Установка

```bash
npm install
```

## Настройка

1. Создайте файл `.env.local` в корне проекта:
```env
# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# SMTP Configuration (для отправки email уведомлений)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="your-email@gmail.com"
```

2. Для настройки SMTP (Gmail):
   - Включите двухфакторную аутентификацию в Google аккаунте
   - Создайте пароль приложения: https://myaccount.google.com/apppasswords
   - Используйте этот пароль в `SMTP_PASSWORD`
   - Для других провайдеров укажите соответствующие `SMTP_HOST` и `SMTP_PORT`

## Запуск

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная страница
│   ├── layout.tsx         # Корневой layout с SEO
│   ├── globals.css        # Глобальные стили
│   ├── services/[id]/     # Страница деталей услуги
│   └── order/             # Страница оформления заказа
├── components/            # React компоненты
│   ├── Layout.tsx         # Компонент layout (header/footer)
│   ├── ServiceCard.tsx    # Карточка услуги
│   ├── OrderForm.tsx      # Форма заказа с валидацией
│   └── ReviewCard.tsx     # Карточка отзыва
├── lib/                   # Утилиты и API слой
│   └── api.ts            # API функции для работы с REST API
├── types/                 # TypeScript типы
│   └── index.ts          # Интерфейсы Service, Order, Review
└── public/                # Статические файлы
```

## Функционал

### Главная страница
- Список всех доступных услуг в виде карточек
- Название, описание, цена и кнопка "Заказать"
- Адаптивная сетка (1 колонка на мобильных, 2 на планшетах, 3 на десктопе)

### Страница услуги
- Подробное описание услуги
- Изображение услуги
- Цена и категория
- Отзывы клиентов
- Кнопка оформления заказа

### Форма заказа
- Валидация всех полей
- Поля: имя, телефон, адрес, описание проблемы, удобное время
- Сообщение об успешной отправке
- Автоматическое перенаправление на главную

## SEO-оптимизация

- Мета-теги для всех страниц
- Open Graph теги для социальных сетей
- Структурированные данные (JSON-LD) для поисковых систем
- SSR/SSG для лучшей индексации
- Оптимизированные изображения через Next.js Image

## Адаптивный дизайн

- Mobile-first подход
- Адаптивная сетка для карточек услуг
- Оптимизированные формы для мобильных устройств
- Responsive навигация

## API

Приложение использует REST API. По умолчанию используется моковый API с тестовыми данными.

Для подключения реального API:
1. Создайте файл `.env.local`
2. Укажите `NEXT_PUBLIC_API_URL=http://your-api-url/api`

API endpoints:
- `GET /api/services` - получить список услуг
- `GET /api/services/:id` - получить услугу по ID
- `POST /api/orders` - создать заказ
# WebMaster
