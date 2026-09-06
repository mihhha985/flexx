# ecommerce

A minimal next app with Prisma 8 and Prisma Composer.

## Run locally

```bash
npm run dev:composer
```

This builds the app and starts it with Composer. PostgreSQL projects get a local Prisma Postgres database and apply the contract automatically.

## Deploy

```bash
npm run deploy
```

The deploy script builds the framework output, provisions Prisma Postgres when selected, applies migrations, and deploys the app to Prisma Compute.

The starter users are inserted idempotently from `src/prisma/seed.ts` on the first database query through the Composer service binding.


## Prisma

- Contract: `src/prisma/contract.prisma`
- Prisma and Composer config: `prisma.config.ts`
- Composer app: `module.ts` and `service.ts`

After changing the contract, run:

```bash
npm run contract:emit
```

To use the framework's development server directly, run `npm run dev`. This direct mode requires `DATABASE_URL`.

## Авторизация администратора

Страница входа — `/auth`, панель управления — `/panel`.
Настройте в `.env` (для хостинга — в серверных переменных окружения):

- `ADMIN_LOGIN` — логин администратора.
- `ADMIN_PASSWORD` — непустой пароль длиной до 1024 символов. Пробелы в пароле учитываются.
- `ADMIN_SESSION_SECRET` — случайный секрет от 32 символов; генерация: `openssl rand -hex 32`.

Файл `.env` исключён из Git. Не используйте префикс `NEXT_PUBLIC_` для этих настроек.
После изменения настроек перезапустите приложение. Изменение логина, пароля или секрета
делает ранее выданные сессии недействительными. Без корректной конфигурации вход закрыт.

Реализация повторяет разделение сущностей проекта:
`src/entities/admin/repository` читает учётные данные,
`services` обрабатывает вход, выход и проверку доступа,
`lib` содержит проверку подписанной сессии и ограничение попыток входа.
JWT-сессия действует 8 часов и хранится в HttpOnly cookie с SameSite=Lax;
в production cookie передаётся только по HTTPS. Выход удаляет cookie текущего браузера.

`src/proxy.ts` расположен рядом с `src/app`, как требует Next.js 16.
Он проверяет сессию для `/panel/:path*` и `/auth/:path*`.
В каждой будущей серверной операции или функции чтения данных панели вызывайте
`requireAdmin()` из `services/sessionService.ts`: одной проверки в Proxy или layout недостаточно.
Страницы авторизации и панели исключены из офлайн-кеша PWA.

Ограничение входа: 10 попыток за 5 минут на процесс, сбрасывается после успешного входа.
Для нескольких экземпляров приложения требуется общий лимитер на стороне хостинга или хранилища.

Документация: [Authentication](https://nextjs.org/docs/app/guides/authentication),
[Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).

Проверка авторизации:

```bash
node --conditions=react-server --import tsx --test src/entities/admin/admin.test.ts src/proxy.test.ts
```

## Разделы админ-панели

`/panel` перенаправляет на `/panel/orders`. Боковое меню shadcn/ui Sidebar
содержит три раздела:

- `/panel/orders` — заявки, контакты покупателей, доставка, сумма и статус.
- `/panel/products` — все продукты, включая скрытые, их категории, цены и остатки.
- `/panel/categories` — категории, порядок отображения и количество продуктов.

Breadcrumb в общей шапке отражает текущий раздел. Sidebar сворачивается на компьютере
и открывается как выдвижное меню на мобильном экране.

Таблицы построены на shadcn/ui Table (React Aria) и TanStack Table v8.
Общий компонент находится в `src/shared/components/admin/data-table.tsx`,
настройки колонок — рядом с соответствующими страницами. Поиск, сортировка и
пагинация по 10 строк выполняются в браузере по загруженному списку.
При росте объёма данных их можно перенести на сервер.

Чтение данных разделено между репозиториями и сервисами сущностей
`order`, `product` и `category`. Каждый запрос админского списка проверяет
`requireAdmin()` перед обращением к БД. Эти страницы предоставляют просмотр списков;
создание, изменение и удаление записей пока не добавлены.
