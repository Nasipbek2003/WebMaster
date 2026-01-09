# База данных МастерСервис

## Обзор

База данных построена на PostgreSQL с использованием Prisma ORM и размещена в Neon Database.

## Структура базы данных

### Основные модели

#### User (Пользователи)
- **id**: Уникальный идентификатор
- **email**: Email (уникальный)
- **name**: Имя пользователя
- **phone**: Телефон
- **password**: Хешированный пароль
- **role**: Роль (CLIENT, MASTER, ADMIN)
- **avatar**: URL аватара

#### Master (Мастера)
- **id**: Уникальный идентификатор
- **userId**: Связь с пользователем
- **bio**: Описание мастера
- **experience**: Опыт работы (годы)
- **hourlyRate**: Почасовая ставка
- **isVerified**: Статус верификации
- **isAvailable**: Доступность
- **rating**: Рейтинг (0-5)
- **reviewsCount**: Количество отзывов
- **workRadius**: Радиус работы (км)
- **address**: Адрес
- **city**: Город

#### ServiceCategory (Категории услуг)
- **id**: Уникальный идентификатор
- **name**: Название категории
- **slug**: URL-slug
- **description**: Описание
- **icon**: Иконка
- **isActive**: Активность

#### Service (Услуги)
- **id**: Уникальный идентификатор
- **name**: Название услуги
- **description**: Полное описание
- **shortDescription**: Краткое описание
- **price**: Цена
- **priceType**: Тип цены (FIXED, FROM, HOURLY)
- **duration**: Продолжительность (минуты)
- **images**: Массив изображений
- **categoryId**: Категория
- **masterId**: Мастер

#### Order (Заказы)
- **id**: Уникальный идентификатор
- **orderNumber**: Номер заказа
- **status**: Статус (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
- **problemDescription**: Описание проблемы
- **address**: Адрес
- **city**: Город
- **preferredTime**: Предпочтительное время
- **urgency**: Срочность (LOW, NORMAL, HIGH, URGENT)
- **estimatedPrice**: Предварительная цена
- **finalPrice**: Итоговая цена
- **scheduledAt**: Запланированное время
- **completedAt**: Время завершения
- **clientId**: Клиент
- **serviceId**: Услуга
- **masterId**: Мастер

#### Review (Отзывы)
- **id**: Уникальный идентификатор
- **rating**: Оценка (1-5)
- **comment**: Комментарий
- **orderId**: Заказ
- **clientId**: Клиент
- **serviceId**: Услуга
- **masterId**: Мастер

#### Portfolio (Портфолио)
- **id**: Уникальный идентификатор
- **title**: Название работы
- **description**: Описание
- **images**: Массив изображений
- **masterId**: Мастер

### Модели для NextAuth

#### Account, Session, VerificationToken
Стандартные модели для NextAuth.js авторизации.

## Команды

### Миграции
```bash
# Создать и применить миграцию
npx prisma migrate dev --name migration_name

# Применить схему без миграции (для разработки)
npx prisma db push

# Сбросить базу данных
npx prisma migrate reset
```

### Seed данные
```bash
# Заполнить базу тестовыми данными
npm run db:seed

# Сбросить и заполнить заново
npm run db:reset
```

### Prisma Studio
```bash
# Открыть веб-интерфейс для просмотра данных
npx prisma studio
```

## Тестовые данные

После выполнения `npm run db:seed` в базе будут созданы:

### Пользователи
- **Администратор**: admin@masterservice.kg / 123456
- **Клиенты**: 
  - client1@example.com / 123456 (Айгуль Токтосунова)
  - client2@example.com / 123456 (Бекзат Мамбетов)
- **Мастера**:
  - master1@example.com / 123456 (Алмаз Исаков - Сантехник)
  - master2@example.com / 123456 (Нурлан Жумабеков - Электрик)
  - master3@example.com / 123456 (Эркин Токтогулов - Ремонт техники)
  - master4@example.com / 123456 (Жаныбек Сулайманов - Плотник)

### Категории услуг
- Сантехник
- Электрик
- Ремонт техники
- Плотник
- Маляр-штукатур
- Кондиционеры

### Услуги
- Замена смесителя (2500 сом)
- Устранение засора (от 1500 сом)
- Замена проводки (от 15000 сом)
- Установка розеток (800 сом)
- Ремонт стиральной машины (от 2000 сом)
- Изготовление кухни (от 50000 сом)

### Заказы и отзывы
Созданы тестовые заказы с различными статусами и отзывы клиентов.

## Подключение

База данных размещена в Neon Database:
```
postgresql://neondb_owner:npg_Y0uvDljaNdI3@ep-small-silence-a46wh66v-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Утилиты

В файле `lib/db-utils.ts` содержатся готовые функции для работы с данными:
- `userUtils` - работа с пользователями
- `masterUtils` - работа с мастерами
- `serviceUtils` - работа с услугами
- `orderUtils` - работа с заказами
- `reviewUtils` - работа с отзывами
- `categoryUtils` - работа с категориями




