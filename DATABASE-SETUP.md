# Настройка базы данных для продакшена (Vercel)

## Проблема с подключением к базе данных

Если вы видите ошибки подключения к базе данных в продакшене, выполните следующие шаги:

## 1. Настройка переменных окружения в Vercel

1. Перейдите в настройки вашего проекта в Vercel
2. Откройте раздел **Environment Variables**
3. Убедитесь, что установлена переменная `DATABASE_URL`

### Для Vercel Postgres:

Если вы используете Vercel Postgres, URL базы данных должен выглядеть так:
```
postgres://default:password@host:5432/verceldb?pgbouncer=true&connection_limit=1
```

**Важно:** 
- URL должен содержать `?pgbouncer=true&connection_limit=1` для правильной работы connection pooling
- Vercel автоматически добавляет эти параметры, если вы используете интеграцию Vercel Postgres

### Для внешней базы данных (например, Supabase, Neon, Railway):

1. Получите connection string от вашего провайдера
2. Добавьте параметры для connection pooling:
   ```
   postgres://user:password@host:5432/database?connection_limit=1&pool_timeout=20
   ```

## 2. Проверка подключения

После настройки переменных окружения:

1. Перезапустите деплой в Vercel
2. Проверьте логи в Vercel Dashboard
3. Если ошибка сохраняется, проверьте:
   - Правильность URL базы данных
   - Доступность базы данных из интернета (для внешних БД)
   - Настройки firewall/whitelist IP адресов

## 3. Выполнение миграций Prisma

Убедитесь, что миграции Prisma выполнены:

```bash
# Локально
npx prisma migrate deploy

# Или через Vercel Build Command
# Добавьте в package.json:
"postinstall": "prisma generate && prisma migrate deploy"
```

## 4. Настройка Build Command в Vercel

В настройках проекта Vercel, раздел **Build & Development Settings**:

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

**Root Directory:**
```
./
```

## 5. Проверка схемы Prisma

Убедитесь, что в `prisma/schema.prisma` указан правильный провайдер:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 6. Отладка

Если проблема сохраняется:

1. Проверьте логи в Vercel Dashboard → Functions → Logs
2. Убедитесь, что переменная `DATABASE_URL` установлена для всех окружений (Production, Preview, Development)
3. Проверьте, что база данных доступна из интернета
4. Для Vercel Postgres убедитесь, что интеграция подключена правильно

## 7. Альтернативные решения

Если проблема с connection pooling:

1. Используйте Prisma Data Proxy (рекомендуется для продакшена)
2. Настройте connection pooling на уровне базы данных
3. Используйте внешний connection pooler (например, PgBouncer)

## Полезные ссылки

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
