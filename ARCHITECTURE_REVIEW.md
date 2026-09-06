> Это исходный аудит до рефакторинга. Решение после обсуждения: UI → services → repository → БД; отдельный слой actions не используется. Текущая структура и команды описаны в README.md. Инвентаризация ниже отражает состояние до изменений.

# Разбор архитектуры ecommerce

Дата: 6 сентября 2026. Анализ текущего рабочего дерева; исходный код не изменён.

Проекту полезнее последовательные правила и удаление старых реализаций, чем новая архитектурная методология. Сохранить Next.js App Router, существующие сущности, Prisma и Zustand; уменьшить количество переходов между файлами для одного сценария.

## Объём и достоверность

Проверены исходники приложения, UI, тесты, конфигурация, скрипты, README, Prisma-контракт и связи импортов. В `src` — 138 файлов TS/TSX/CSS/Prisma без генерируемого `contract.d.ts`, 8067 строк. Сгенерированные контракты и снимки проверены как инфраструктурные артефакты: структура, назначения, ссылки. Lockfile проверен на соответствие прямым зависимостям. Бинарные изображения не являются кодом; проверены ссылки на них. Секреты `.env`, содержимое `node_modules`, `.next` и синхронизированных навыков не входят в построчный обзор собственного кода.

Next-devtools MCP: `nextjs_docs`, `nextjs_index`, `get_project_metadata`, `get_routes`, `get_errors`. Подтверждены этот каталог проекта, Next.js 16.1.6, сервер localhost:3000 и 13 маршрутов, включая manifest. `get_errors` сообщил об отсутствии подключённых браузерных сессий: это не подтверждение отсутствия runtime-ошибок. Полный браузерный и интеграционный прогон с БД не выполнялся. Production build не запускался; его работоспособность не утверждается.

Bundled docs отсутствуют в установленном Next.js. Использована официальная документация в интернете; она уже описывает более новую версию. Спорные детали сверены с установленными типами: в частности, error boundary 16.1.6 передаёт `reset`, а не новый `retry`.

Проверки:

- `tsc --noEmit --incremental false`: успешно.
- `npm run lint`: 0 ошибок, 4 предупреждения в `.agents/skills`, не в приложении.
- 35 существующих тестов: 33 успешно, 2 падают в `scripts/service-worker.test.mjs` из-за ожиданий `kontur-v2` при текущем кеше `kontur-v3`.
- Найдены два полностью неподключённых TSX-файла: `catalog-results.tsx`, `popover.tsx`. Дополнительно есть неиспользуемые экспорты и подключённый, но фактически бесполезный провайдер.

## Что уже устроено хорошо

- Страницы преимущественно серверные, интерактивность выделена в клиентские компоненты.
- `(site)` и `(panel)` разделяют оформление и маршруты магазина и панели.
- Zod проверяет входные данные на сервере. Заказ не принимает цену и итог от клиента.
- `createOrder` использует транзакцию, фиксирует название и цену в составе заказа, проверяет конкурентное изменение остатков. Порядок обработки товаров стабилен.
- Авторизация проверяется в серверных операциях и запросах панели, а не только в Proxy/layout.
- Корзина имеет явную гидратацию, проверяет сохранённый JSON, выдерживает недоступность localStorage и мигрирует старый формат.
- Общая `DataTable` действительно используется тремя разделами. Это оправданное применение DRY.
- UI skeletons, `loading.tsx`, error boundaries и ограничения кеширования PWA имеют реальные назначения.

## Главные проблемы

### 1. Документация противоречит поведению — высокий приоритет

`README.md` говорит об автоматическом идемпотентном seed при первом запросе и о панели только для чтения. Реальный `src/prisma/seed.ts:15` удаляет OrderItem, Order, Product, Category, затем создаёт демоданные; автоматического вызова seed в runtime нет. В панели уже есть создание, изменение и удаление.

`prisma-next.md` описывает модель User, которой в контракте нет, другую конфигурацию и автоматическую генерацию для Next.js, которой в этом проекте не настроено. Локальный справочник Prisma прямо указывает, что для Next.js нужен явный contract emit.

Исправить README: два режима запуска, переменные без значений секретов, схема данных, доступные действия, команды тестов, предупреждение о точном поведении seed. Разделить безопасное добавление demo-данных и явный сброс; существующий разрушительный сценарий назвать соответствующим образом. Устаревший стартовый документ заменить ссылками и короткими проектными инструкциями.

### 2. Одно действие приходится искать по разным архитектурным правилам

Сейчас чтение списка: `page → service → repository → db`. Изменение товара: `action → repository → db`. Создание товара и операции категорий: `action → db`. Заказы размещают Server Actions внутри `services`, авторизация делает так же. `adminOrderService.ts` только передаёт вызов дальше; product/category services преобразуют пару полей.

Выбрать простой договор:

- `queries.ts`: чтение данных, выборка полей, DTO для экрана; `server-only`.
- `actions.ts`: Server Actions, проверка входа и доступа, вызов операции, обновление страниц.
- `schema.ts` / `types.ts`: только если разделение реально помогает; не создавать пустые файлы ради шаблона.
- отдельный файл операции — когда есть значимый алгоритм, например `create-order.ts` с транзакцией.

Простые CRUD-запросы могут оставаться непосредственно в actions. Не нужен обязательный service/repository для каждого вызова Prisma. Альтернатива — сохранить репозитории, но тогда применять правило единообразно. Для размера этого проекта предпочтителен первый вариант.

`repositiry` у product и `reposytory` у order исправить сразу. `getAllCategory` переименовать в `getCategories`; `getAllProductsByCategory` возвращает страницу, поэтому лучше `getCatalogProducts`; `LIMIT` → `PRODUCTS_PER_PAGE`; `rows` для одного обновлённого заказа → `order`.

### 3. Shared содержит код конкретных сценариев

`shared/components` зависит от product/category/order/admin и cart store. Это фактически склад компонентов приложения, а не общий нижний слой.

UI корзины и его состояние перенести рядом с `/cart`; каталог — рядом с `/catalog`; административные общие компоненты — внутрь `/panel/_components`; меню магазина — в `(site)/_components`. Общую карточку товара и изображение, используемые на разных страницах, можно держать в `entities/product/ui`. В `shared` оставить действительно независимые UI-примитивы, форматирование и общие утилиты.

Next.js допускает размещать обычные файлы рядом с маршрутами; `_components` — полезное соглашение, не обязательное требование фреймворка. [Project structure](https://nextjs.org/docs/app/getting-started/project-structure).

### 4. Параметры каталога имеют несколько источников истины

`productService.ts:35` и `:91` независимо разбирают один searchParams. `product-pagination.tsx:22` ещё раз разбирает page и в строке 39 ограничивает его числом страниц. Запрос продуктов верхнюю границу не учитывает. При 24 товарах и `?page=999` запрос вернёт пустую выдачу, а пагинация подсветит страницу 2.

`catalog-filter.tsx:18` начинает поиск с пустой строки независимо от `?search=...`. При прямом открытии ссылки поле не отражает действующий фильтр; переходы назад/вперёд тоже требуют согласования состояния.

`catalog-view.tsx` показывает кнопку «Сбросить фильтры» без обработчика или ссылки.

Вынести чистый `parseCatalogParams`, нормализовать параметры один раз, передавать типизированный объект в запрос и пагинацию. Выбрать явное поведение для page за пределами: редирект на допустимый URL либо явно показанная запрошенная пустая страница. Не ограничивать только UI. Для сброса достаточно ссылки на `/catalog`. Отдельно тестировать массивы параметров, нечисловую page, выход за границы и историю поиска.

### 5. Граница серверного кода выражена неточно

`getProduct.ts` и `getCategory.ts` помечены `"use server"`, хотя используются как внутренние функции чтения серверных компонентов. Эта директива описывает Server Functions, а не просто «файл для сервера». Здесь понятнее `import "server-only"`. `productService.ts` также должен явно оставаться на сервере.

Для действий пользователя оставить `"use server"`; для внутренних запросов использовать `server-only`. Не добавлять его вслепую в общий `prisma/db.ts`: этот файл импортируют Node seed-скрипты, которые потребуют отдельной совместимой точки входа. [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Проверки `requireAdmin` на границах доступа сохранить. DRY не означает, что достаточно одной проверки в layout. [Authentication](https://nextjs.org/docs/app/guides/authentication).

### 6. Чтение данных можно упростить и сократить

В `getAllProductsByCategory` и `getActiveProductsCount` повторены условия активности, категории и поиска. Выделить построение одинакового фильтра, чтобы count и выдача не разошлись. Сортировке каталога добавить id как последний ключ: одинаковые цены/названия иначе не задают стабильный порядок страниц.

`getProductBySlug` вызывается из metadata и page, аналогично категория. Для ORM нет автоматической дедупликации Next.js fetch: обернуть конкретные read-функции в React `cache` для повторных обращений в рамках серверного рендера. Это не долгоживущий кеш каталога. [generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata).

`getRandomProducts` читает весь активный каталог, копирует и перемешивает его ради четырёх товаров из разных категорий. Если случайность не является требованием, проще стабильная небольшая подборка. Если требуется — сохранить смысл «разные категории» и ограничить кандидатов на уровне БД. Просто добавить limit перед текущим shuffle без обсуждения нельзя: распределение изменится.

`generateStaticParams` категорий обращается к БД при build, хотя выдача зависит от searchParams. Проверить, нужен ли build-time список категорий вообще; если нет — убрать эту зависимость сборки от БД. Это кандидат на упрощение, не установленная ошибка production build.

Админские `.all()` загружают целиком списки и состав заказов. Сейчас клиентская пагинация проста и допустима. Переходить к серверной выборке после измерения размера ответа и задержек; при переносе статистику считать отдельно по полному набору, не по текущей странице.

### 7. UI-компоненты требуют небольших, адресных улучшений

`cart-view.tsx` (225 строк) объединяет гидратацию, список товаров, форму, сумму и отправку. Выделить `CartItemRow` и `CheckoutForm` рядом со страницей; оркестрацию корзины оставить в CartView. Не вводить универсальный генератор форм. Состояния отправки, ref от повторного submit и этап перенаправления не удалять механически: они решают разные задачи.

`product-card.tsx` целиком клиентский из-за cart store и клика по контейнеру. Предпочтительнее серверная разметка карточки и маленькая клиентская кнопка добавления, обычная ссылка на товар. Не заменять вложенные интерактивные элементы одной большой ссылкой.

`LinkButton` в `shared/ui/button.tsx:70` использует React Aria Link без Next Link; RouterProvider в приложении не найден. Внутренние ссылки этого компонента, включая пагинацию, используют обычную браузерную навигацию. Согласовать один способ: адаптер `render` с Next Link внутри общей обёртки. В admin-sidebar подобная интеграция уже есть. [React Aria Link](https://react-aria.adobe.com/Link).

Меню desktop/mobile дублируют таблицу иконок и определение активной ссылки; вынести общие данные и проверку маршрута. Разметку оставить отдельной: она действительно отличается. Для `/catalog/category` текущая строгая проверка равенства не выделяет каталог.

Развернуть длинные однострочные JSX/columns, убрать вложенные тернарные выражения в обработчиках и таблицах там, где имя переменной яснее. Не делить маленькую таблицу на пять файлов ради числа строк.

### 8. Ошибки и форматирование повторяются

В read-функциях много `try { ... } catch (error) { console.error(error); throw error }`, а сервис повторно делает то же. Удалить бессодержательные обёртки; логировать один раз там, где есть контекст операции. Сохранить обработку ожидаемых ошибок ввода и ограничения транзакции.

После успешной записи сбой revalidation не должен выглядеть как несохранённая операция. Для checkout это уже учтено; правила product/category/order стоит согласовать. Начать с общего небольшого помощника обновления каталога, если сохраняется одинаковая политика, без универсального middleware для всех actions. Сужение `revalidatePath("/", "layout")` делать отдельно после составления списка затронутых страниц; не добавлять теги и новую стратегию кеша только ради рефакторинга.

`formatPrice` создаёт Intl.NumberFormat при каждом вызове и округляет до целого рубля, хотя цена допускает копейки. Вынести formatter на уровень модуля и отображать согласованную точность. Проверить 1499.50, дробные суммы и итоги заказа. Float в БД — отдельный вопрос модели денег; миграцию к целым копейкам/точному decimal не смешивать с перемещением файлов.

`cn` используется из двух мест: собственного utils и npm-пакета. Привести к одной точке импорта; затем выбрать одну реализацию после проверки конфликтов Tailwind-классов. Не удалять пакет до исправления потребителей.

## Неиспользуемый код: точный список и ограничения

| Объект | Что установлено | Действие |
|---|---|---|
| `shared/components/catalog-results.tsx` | Нет импортов; страницы строят выдачу самостоятельно | Удалить старую реализацию |
| `CatalogResultsTransition` | Единственный потребитель — неподключённый CatalogResults | Удалить вместе с ним |
| `CatalogTransitionProvider` | Подключён в catalog/layout, но в рабочем дереве нет живого потребителя контекста | Убрать обёртку и затем весь файл переходов |
| `shared/ui/popover.tsx` | Нет импортов | Удалить целиком; внутренние PopoverPrimitive в dropdown-menu сохраняются |
| `shared/lib/catalog.ts` | Из других файлов импортируется только formatPrice | Перенести formatPrice; удалить demo-массивы, getProduct, featuredProducts и обслуживающие их типы |
| `env.ts:getRequiredEnv` | Не вызывается | Удалить; getEnv нужен локально для DATABASE_URL, достаточно убрать его export |
| `ProductPage.generateMetadata` | После `if (!product) notFound()` отрицательная ветка тернарного выражения недостижима | Вернуть объект metadata без повторной проверки |
| `retry` в error wrappers | Установленный Next.js 16.1.6 его не передаёт, собственных callers с retry нет | Убрать, если не требуется явно поддерживать несколько версий Next.js |
| `next-themes` | Только useTheme в Toaster; RootLayout всегда задаёт theme="light" | Упростить Toaster и затем удалить прямую зависимость, если тёмная тема не запланирована как текущая задача |
| Прямой `alchemy` в package.json | Собственных импортов нет, но Composer использует его транзитивно | Проверить peer/версионные требования и убрать лишнюю прямую запись; пакет не обязательно исчезнет из lockfile |

Некоторые UI-экспорты не имеют внешних потребителей: `Toggle`, `BreadcrumbEllipsis`, `DropdownMenuShortcut`, `KbdGroup`, `FieldContent`, `FieldTitle`, `FieldSeparator`, `InputGroupButton`, `InputGroupText`, `InputGroupTextarea`, `TableFooter`, `TableCaption`, несколько sidebar подкомпонентов. Это менее срочно, чем мёртвые бизнес-сценарии. Удалять выборочно, если команда поддерживает UI как собственный код; если синхронизирует с shadcn, сокращение стандартного API может усложнить обновления.

Отсутствие внешнего импорта не доказывает отсутствие локального использования: `toggleVariants`, `SheetClose`, `DialogOverlay`, `badgeVariants`, `NavigationItem`, `CartItem` имеют локальное назначение. Не удалять их автоматически. `CartItem` и `NavigationItem` можно просто перестать экспортировать, если внешний API не нужен.

Не считать мусором: `page/layout/loading/error/manifest/proxy`, Prisma/Composer configs, `seed`, reset-скрипт, generated contracts, snapshots, public assets, миграцию формата localStorage. Они включаются фреймворком, CLI, URL или используют сохранённые пользовательские данные.

## Инфраструктура и воспроизводимость

- Добавить `test`, `test:server`, `typecheck`, `check`; разделить обычные тесты и тесты с `--conditions=react-server`, иначе React-клиентские модули могут получить неправильный entry point.
- Исправить PWA-тесты так, чтобы они получали актуальное имя кеша из поведения worker, а не повторяли номер версии. Отдельно покрыть install, пропуск `/auth` и `/panel`, запрет private/no-store, проверку текущего кеша для redirected/RSC ответов. Сейчас проверка старого кеша может давать ложноположительный результат.
- Исключить синхронизированные `.agents` и аналогичные каталоги из линтера и явно сузить TS include до собственного кода и Next types.
- Закрепить совместимые версии Prisma CLI/ORM/Composer. Сейчас CLI задан `latest`, установлен 8.0.0-rc.12, ORM 8.0.0-rc.8. Различие версий само по себе не доказывает несовместимость; обновлять согласованным набором по документации, не вслепую.
- `scripts/prisma-reset.mjs` импортирует `pg`, но пакет не объявлен прямой зависимостью проекта. Объявить его явно как инструментальную зависимость, если скрипт сохраняется.
- Добавить `.env.example` только с именами и безопасными заглушками; расширить `.gitignore` на `.env.*` с исключением example и `*.tsbuildinfo`. Не копировать действующие секреты.
- В tracked `migrations/` есть snapshots и ref, но нет исполняемых миграций. По локальному справочнику Composer деплой проигрывает миграции. Проверить и подготовить путь empty → current на отдельной пустой БД; не удалять снимки и не менять db ref наугад. Деплой в ходе аудита не проверялся.
- `loadComposerDatabase` ловит любое исключение и молча переключается на другой способ подключения. Различать отсутствие Composer runtime и настоящую ошибку конфигурации; сохранить оба режима, раз они документированы и используются.
- Добавить явный contract emit перед build/проверкой синхронности generated files. Не обещать автоматическую регенерацию, которой сейчас нет.

## Предлагаемая структура

```text
src/
  app/
    layout.tsx
    error.tsx
    global-error.tsx
    globals.css
    manifest.ts
    (site)/
      layout.tsx
      page.tsx
      _components/          # меню, секции главной
      catalog/
        layout.tsx
        page.tsx
        _components/        # фильтр, результаты, пагинация, skeleton
        [slug]/page.tsx
      cart/
        page.tsx
        _components/        # cart-view, cart-item-row, checkout-form
        _lib/cart-store.ts  # тест рядом; гидратация — здесь либо в _components
      product/[slug]/
      contacts/
      order/[publicId]/thanks/
    (panel)/
      auth/                 # форма и страница входа уже colocated
      panel/
        layout.tsx
        _components/        # sidebar, breadcrumb, data-table, общие actions UI
        orders/             # локальные таблицы, диалоги, статистика
        products/
        categories/
  entities/
    product/
      queries.ts
      actions.ts
      schema.ts
      types.ts              # только реально общие UI-типы
      catalog-params.ts
      ui/                   # общие product-card, visual, purchase
    category/
      queries.ts
      actions.ts
      schema.ts
    order/
      queries.ts
      actions.ts
      schema.ts
      create-order.ts       # транзакция и значимые правила
      status.ts
    admin/
      actions.ts
      session.ts
      session-token.ts
      config.ts
      login-throttle.ts
      schema.ts
  shared/
    ui/
    lib/
      utils.ts
      format-price.ts
    hooks/
  prisma/                   # сохранить пути контракта и runtime на первом этапе
  proxy.ts
migrations/
scripts/
module.ts
service.ts
prisma.config.ts
prisma-composer.config.ts
```

Это ориентир, не обязательная полная миграция. Корзина может остаться отдельным небольшим `features/cart`, если импорт её состояния из route-local `_lib` для меню неудобен команде. Выбрать один вариант и задокументировать; не создавать одновременно store, context и дополнительный service для одного состояния. Алиас `@/*` пока оставить: массовое изменение `@/src` не требуется для результата.

## Пошаговый план

1. **Зафиксировать исходную проверку.** Добавить команды проверок, исправить два PWA-теста, исключить инструменты из линтера. Готово, когда все существующие тесты проходят одной документированной последовательностью.
2. **Исправить инструкции для новичка.** Обновить README, seed/reset, `.env.example`, Prisma workflow. Готово, когда человек по README запускает магазин и панель без догадок о БД и без случайного удаления данных.
3. **Удалить подтверждённые остатки.** Старый CatalogResults, переходы вместе с провайдером, Popover, mock catalog, getRequiredEnv, недостижимая metadata-ветка. Отдельный небольшой commit; типы, lint, тесты, главная/каталог/товар/корзина проходят.
4. **Привести именование и расположение.** Исправить repository-опечатки, выбрать kebab-case, перенести page-specific UI. Не менять поведение в том же commit. Проверить импорты, types и маршрутную карту MCP.
5. **Сократить слои.** Начать с order: убрать pass-through service; затем собрать read/DTO в queries, actions назвать по назначению. Сохранить транзакцию и проверки доступа. Готово, когда чтение списка прослеживается через page → query, а изменение — через action → конкретная операция.
6. **Устранить расхождения каталога.** Единый парсер, общий фильтр count/list, стабильная сортировка, URL-состояние поиска, рабочий сброс. Добавить тесты по обнаруженным сценариям; сравнить `/catalog` и `/catalog/[slug]`.
7. **Упростить UI и навигацию.** Разделить корзину на 2–3 смысловых компонента, согласовать LinkButton с Next Link, вынести общие данные меню и формат цены. Проверить клавиатуру, ввод формы, добавление в корзину, историю браузера.
8. **Сократить повторную работу на сервере.** Дедупликация read-функций для metadata/page; решить необходимость generateStaticParams и случайной подборки. Долгоживущий кеш вводить лишь при измеренной необходимости и понятной инвалидации.
9. **Закрепить эксплуатацию.** Проверить зависимости, договор версий Prisma, emitted contract, миграции на пустой тестовой БД, затем production build в отдельной среде. Интеграционно проверить успешный заказ, откат при нехватке/конкуренции, недоступность admin mutations гостю.

Не смешивать перемещение файлов, изменение схемы денег, новую стратегию кеша и изменение пользовательского поведения в одном PR. После каждого шага должна оставаться рабочая версия.

## Правила команды: DRY / KISS / YAGNI

- **DRY:** единые бизнес-правила цены, фильтра, статуса и авторизации; не единый мегакомпонент для похожей разметки.
- **KISS:** маленькие именованные функции, ранние возвраты, понятные параметры-объекты вместо шести позиционных аргументов, прямой запрос вместо пустого service.
- **YAGNI:** удалить неподключённые сценарии, не строить BaseRepository, DI-контейнер, универсальную CRUD-фабрику, CQRS, event bus или микросервисы для четырёх сущностей.
- Повтор двух коротких JSX-фрагментов допустим, если абстракция потребует множества флагов.
- Комментарий объясняет причину: конкурентные остатки, транзакция, гидратация, приватный кеш. Не пересказывает строчку кода.
- Один форматтер, единый стиль имён, короткий README с картой «где менять каталог / заказ / авторизацию» важнее тотальной перестройки папок.

## Реестр файлов

Ниже — перечень собственных файлов с назначением проверки. «Сохранить» означает отсутствие необходимости в структурной переделке по результатам этого аудита, а не доказательство отсутствия всех возможных ошибок.

| Файл | Результат / рекомендация |
|---|---|
| [.gitattributes](</Users/mihhha/Documents/ecommerce/.gitattributes>) | Сохранить маркировку сгенерированных Prisma-файлов. |
| [.gitignore](</Users/mihhha/Documents/ecommerce/.gitignore>) | Расширить env-шаблоны, разрешить .env.example, исключить tsbuildinfo. |
| [README.md](</Users/mihhha/Documents/ecommerce/README.md>) | Обновить: seed, CRUD панели, режимы запуска и команды тестов. |
| [components.json](</Users/mihhha/Documents/ecommerce/components.json>) | Сохранить React Aria preset; при переносах обновить aliases при необходимости. |
| [env.ts](</Users/mihhha/Documents/ecommerce/env.ts>) | Удалить getRequiredEnv; getEnv сделать локальным; загрузка env нужна Prisma CLI. |
| [eslint.config.mjs](</Users/mihhha/Documents/ecommerce/eslint.config.mjs>) | Исключить синхронизированные навыки; общий lint сейчас даёт 4 посторонних warning. |
| [migrations/app/refs/db.json](</Users/mihhha/Documents/ecommerce/migrations/app/refs/db.json>) | Артефакт истории/refs; сохранить, проверить исполняемый путь миграций отдельно. |
| [migrations/snapshots/11eda8ca173dbfd33c7ceb40ff47d917eadcf724ab1ebc321e12d1a4c97cc290/contract.d.ts](</Users/mihhha/Documents/ecommerce/migrations/snapshots/11eda8ca173dbfd33c7ceb40ff47d917eadcf724ab1ebc321e12d1a4c97cc290/contract.d.ts>) | Артефакт истории/refs; сохранить, проверить исполняемый путь миграций отдельно. |
| [migrations/snapshots/11eda8ca173dbfd33c7ceb40ff47d917eadcf724ab1ebc321e12d1a4c97cc290/contract.json](</Users/mihhha/Documents/ecommerce/migrations/snapshots/11eda8ca173dbfd33c7ceb40ff47d917eadcf724ab1ebc321e12d1a4c97cc290/contract.json>) | Артефакт истории/refs; сохранить, проверить исполняемый путь миграций отдельно. |
| [migrations/snapshots/e8d9c8564ab41135f1e7035b6462f3c4d2e7901322991aa17be7519fe2d9e396/contract.d.ts](</Users/mihhha/Documents/ecommerce/migrations/snapshots/e8d9c8564ab41135f1e7035b6462f3c4d2e7901322991aa17be7519fe2d9e396/contract.d.ts>) | Артефакт истории/refs; сохранить, проверить исполняемый путь миграций отдельно. |
| [migrations/snapshots/e8d9c8564ab41135f1e7035b6462f3c4d2e7901322991aa17be7519fe2d9e396/contract.json](</Users/mihhha/Documents/ecommerce/migrations/snapshots/e8d9c8564ab41135f1e7035b6462f3c4d2e7901322991aa17be7519fe2d9e396/contract.json>) | Артефакт истории/refs; сохранить, проверить исполняемый путь миграций отдельно. |
| [module.ts](</Users/mihhha/Documents/ecommerce/module.ts>) | Composer entry point, ресурс БД и wiring; сохранить. |
| [next-env.d.ts](</Users/mihhha/Documents/ecommerce/next-env.d.ts>) | Генерируется Next.js; имел изменение до аудита; не редактировался. |
| [next.config.ts](</Users/mihhha/Documents/ecommerce/next.config.ts>) | Standalone нужен Composer; конфигурация небольшая, сохранить. |
| [package-lock.json](</Users/mihhha/Documents/ecommerce/package-lock.json>) | Прямые зависимости соответствуют package.json; обновлять менеджером пакетов. |
| [package.json](</Users/mihhha/Documents/ecommerce/package.json>) | Добавить команды проверок; проверить alchemy, pg, next-themes; закрепить CLI. |
| [postcss.config.mjs](</Users/mihhha/Documents/ecommerce/postcss.config.mjs>) | Рабочая точка подключения Tailwind; не удалять по отсутствию импортов. |
| [prisma-composer.config.ts](</Users/mihhha/Documents/ecommerce/prisma-composer.config.ts>) | Deployment configuration; сохранить. |
| [prisma-next.md](</Users/mihhha/Documents/ecommerce/prisma-next.md>) | Заменить устаревший starter-текст проектными инструкциями. |
| [prisma.config.ts](</Users/mihhha/Documents/ecommerce/prisma.config.ts>) | CLI entry point; сохранить, явно документировать contract emit. |
| [public/icon.svg](</Users/mihhha/Documents/ecommerce/public/icon.svg>) | Используется metadata, manifest и service worker. |
| [public/images/product-placeholder.png](</Users/mihhha/Documents/ecommerce/public/images/product-placeholder.png>) | Используется ProductVisual; бинарный asset, не исходный код. |
| [public/sw.js](</Users/mihhha/Documents/ecommerce/public/sw.js>) | Используется регистрацией по URL; сохранить правила RSC/private; проверить install отдельным тестом. |
| [scripts/prisma-reset.mjs](</Users/mihhha/Documents/ecommerce/scripts/prisma-reset.mjs>) | Явный сброс с подтверждением; объявить прямую зависимость pg; не запускался. |
| [scripts/service-worker.test.mjs](</Users/mihhha/Documents/ecommerce/scripts/service-worker.test.mjs>) | Исправить v2/v3 и проверки реального текущего кеша; добавить private/install cases. |
| [service.ts](</Users/mihhha/Documents/ecommerce/service.ts>) | Composer описание Next.js сервиса; сохранить. |
| [src/app/(panel)/auth/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/auth/layout.tsx>) | Автоматическая точка входа Next; сохранить оформление/metadata/доступ своего сегмента. |
| [src/app/(panel)/auth/login-form.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/auth/login-form.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/auth/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/auth/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/error.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/error.tsx>) | Автоматическая точка входа Next; сохранить нужную границу, использовать общий fallback; retry не нужен 16.1.6. |
| [src/app/(panel)/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/layout.tsx>) | Автоматическая точка входа Next; сохранить оформление/metadata/доступ своего сегмента. |
| [src/app/(panel)/panel/categories/categories-table.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/categories/categories-table.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/categories/category-edit-dialog.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/categories/category-edit-dialog.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/categories/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/categories/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(panel)/panel/categories/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/categories/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/error.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/error.tsx>) | Автоматическая точка входа Next; сохранить нужную границу, использовать общий fallback; retry не нужен 16.1.6. |
| [src/app/(panel)/panel/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/layout.tsx>) | Автоматическая точка входа Next; сохранить оформление/metadata/доступ своего сегмента. |
| [src/app/(panel)/panel/orders/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/orders/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(panel)/panel/orders/order-row-actions.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/orders/order-row-actions.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/orders/order-stats-cards.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/orders/order-stats-cards.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/orders/orders-table.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/orders/orders-table.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/orders/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/orders/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/products/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/products/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(panel)/panel/products/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/products/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/products/product-edit-dialog.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/products/product-edit-dialog.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(panel)/panel/products/products-table.tsx](</Users/mihhha/Documents/ecommerce/src/app/(panel)/panel/products/products-table.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(site)/cart/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/cart/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(site)/catalog/[slug]/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/catalog/[slug]/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(site)/catalog/[slug]/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/catalog/[slug]/page.tsx>) | Read cache metadata/page; проверить нужность generateStaticParams; единая выдача. |
| [src/app/(site)/catalog/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/catalog/layout.tsx>) | Убрать бесполезный CatalogTransitionProvider; фильтр/Suspense сохранить. |
| [src/app/(site)/catalog/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/catalog/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(site)/catalog/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/catalog/page.tsx>) | Единые параметры и общая секция выдачи с category page. |
| [src/app/(site)/contacts/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/contacts/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(site)/error.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/error.tsx>) | Автоматическая точка входа Next; сохранить нужную границу, использовать общий fallback; retry не нужен 16.1.6. |
| [src/app/(site)/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/layout.tsx>) | Автоматическая точка входа Next; сохранить оформление/metadata/доступ своего сегмента. |
| [src/app/(site)/order/[publicId]/thanks/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/order/[publicId]/thanks/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(site)/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/page.tsx>) | Используемая страница или colocated UI. Сохранить локальность; развернуть плотный JSX, понятные props. |
| [src/app/(site)/product/[slug]/loading.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/product/[slug]/loading.tsx>) | Автоматическая точка входа Next; короткая обёртка skeleton оправданна. |
| [src/app/(site)/product/[slug]/page.tsx](</Users/mihhha/Documents/ecommerce/src/app/(site)/product/[slug]/page.tsx>) | Убрать недостижимую metadata-ветку; дедупликация product lookup. |
| [src/app/error.tsx](</Users/mihhha/Documents/ecommerce/src/app/error.tsx>) | Автоматическая точка входа Next; сохранить нужную границу, использовать общий fallback; retry не нужен 16.1.6. |
| [src/app/global-error.tsx](</Users/mihhha/Documents/ecommerce/src/app/global-error.tsx>) | Автоматическая точка входа Next; сохранить нужную границу, использовать общий fallback; retry не нужен 16.1.6. |
| [src/app/globals.css](</Users/mihhha/Documents/ecommerce/src/app/globals.css>) | Сохранить токены UI; dark/chart tokens не первоочередная цель чистки. |
| [src/app/layout.tsx](</Users/mihhha/Documents/ecommerce/src/app/layout.tsx>) | Root entry, metadata/toaster/PWA; cart hydration можно опустить в site layout. |
| [src/app/manifest.ts](</Users/mihhha/Documents/ecommerce/src/app/manifest.ts>) | Metadata entry point PWA; сохранить. |
| [src/entities/admin/admin.test.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/admin.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/entities/admin/domain.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/domain.ts>) | Используемые доменные типы/схемы; сохранить; именовать по содержимому, не плодить слои. |
| [src/entities/admin/lib/loginThrottle.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/lib/loginThrottle.ts>) | Сохранить; процессный глобальный лимит документирован, распределённый нужен при нескольких инстансах. |
| [src/entities/admin/lib/sessionToken.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/lib/sessionToken.ts>) | JWT и смена версии сессии имеют назначение; сохранить. |
| [src/entities/admin/repository/adminRepository.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/repository/adminRepository.ts>) | Это конфигурация/credentials, а не DB repository; понятнее config.ts. |
| [src/entities/admin/services/authService.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/services/authService.ts>) | Это Server Actions входа/выхода; назвать actions.ts. |
| [src/entities/admin/services/sessionService.ts](</Users/mihhha/Documents/ecommerce/src/entities/admin/services/sessionService.ts>) | Сохранить проверки на границах доступа; имя session.ts проще. |
| [src/entities/category/actions/manageCategoryActions.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/actions/manageCategoryActions.ts>) | Используемая Server Action; сохранить валидацию/auth, согласовать слой DB и revalidation. |
| [src/entities/category/admin-domain.test.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/admin-domain.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/entities/category/admin-domain.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/admin-domain.ts>) | Используемые доменные типы/схемы; сохранить; именовать по содержимому, не плодить слои. |
| [src/entities/category/domain.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/domain.ts>) | Используемые доменные типы/схемы; сохранить; именовать по содержимому, не плодить слои. |
| [src/entities/category/repository/getAdminCategories.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/repository/getAdminCategories.ts>) | Используемый защищённый query; объединить с DTO mapping, не убирать requireAdmin. |
| [src/entities/category/repository/getCategory.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/repository/getCategory.ts>) | server-only, getCategories, убрать повторный лог, дедуплицировать lookup. |
| [src/entities/category/services/adminCategoryService.ts](</Users/mihhha/Documents/ecommerce/src/entities/category/services/adminCategoryService.ts>) | DTO mapping можно объединить с query. |
| [src/entities/order/domain.test.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/domain.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/entities/order/domain.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/domain.ts>) | Используемые доменные типы/схемы; сохранить; именовать по содержимому, не плодить слои. |
| [src/entities/order/reposytory/createOrder.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/reposytory/createOrder.ts>) | Сохранить транзакцию, compare-and-set, проверку суммы и стабильный порядок. |
| [src/entities/order/reposytory/getAdminOrders.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/reposytory/getAdminOrders.ts>) | Используемый защищённый query; объединить с DTO mapping, не убирать requireAdmin. |
| [src/entities/order/reposytory/getOrder.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/reposytory/getOrder.ts>) | Минимальный DTO подтверждения без контактов; сохранить. |
| [src/entities/order/services/adminOrderActions.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/services/adminOrderActions.ts>) | Перенести к actions; согласовать result/revalidation, сохранить requireAdmin. |
| [src/entities/order/services/adminOrderService.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/services/adminOrderService.ts>) | Pass-through wrapper; убрать слой, перенести тип к query. |
| [src/entities/order/services/order-status.test.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/services/order-status.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/entities/order/services/order-status.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/services/order-status.ts>) | Перенести к доменным правилам; назвать показатель confirmationRate вместо CTR. |
| [src/entities/order/services/orderService.ts](</Users/mihhha/Documents/ecommerce/src/entities/order/services/orderService.ts>) | Переименовать в actions; сохранить различение ошибки записи и revalidation. |
| [src/entities/product/actions/manageProductActions.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/actions/manageProductActions.ts>) | Используемая Server Action; сохранить валидацию/auth, согласовать слой DB и revalidation. |
| [src/entities/product/actions/updateProductAction.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/actions/updateProductAction.ts>) | Используемая Server Action; сохранить валидацию/auth, согласовать слой DB и revalidation. |
| [src/entities/product/domain.test.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/domain.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/entities/product/domain.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/domain.ts>) | Используемые доменные типы/схемы; сохранить; именовать по содержимому, не плодить слои. |
| [src/entities/product/repositiry/getAdminProducts.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/repositiry/getAdminProducts.ts>) | Используемый защищённый query; объединить с DTO mapping, не убирать requireAdmin. |
| [src/entities/product/repositiry/getProduct.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/repositiry/getProduct.ts>) | Исправить имя пути; server-only, общий фильтр, стабильная сортировка, read cache. |
| [src/entities/product/repositiry/updateProduct.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/repositiry/updateProduct.ts>) | Проверки и обновление; сохранить auth, обозначить значимую серверную операцию. |
| [src/entities/product/services/adminProductService.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/services/adminProductService.ts>) | DTO mapping можно объединить с query. |
| [src/entities/product/services/productService.ts](</Users/mihhha/Documents/ecommerce/src/entities/product/services/productService.ts>) | Разделить парсер и серверные queries; убрать debug log и catch/rethrow. |
| [src/prisma/composer.ts](</Users/mihhha/Documents/ecommerce/src/prisma/composer.ts>) | Общий контракт для module и service; сохранить. |
| [src/prisma/contract.d.ts](</Users/mihhha/Documents/ecommerce/src/prisma/contract.d.ts>) | Сгенерирован из contract.prisma; используется runtime/types; не редактировать вручную. |
| [src/prisma/contract.json](</Users/mihhha/Documents/ecommerce/src/prisma/contract.json>) | Сгенерирован из contract.prisma; используется runtime/types; не редактировать вручную. |
| [src/prisma/contract.prisma](</Users/mihhha/Documents/ecommerce/src/prisma/contract.prisma>) | Источник модели; не смешивать Float→money миграцию с структурным рефакторингом. |
| [src/prisma/db.ts](</Users/mihhha/Documents/ecommerce/src/prisma/db.ts>) | Два режима подключения; ограничить catch ожидаемым отсутствием Composer. |
| [src/prisma/seed.ts](</Users/mihhha/Documents/ecommerce/src/prisma/seed.ts>) | Разрушительное заполнение demo-БД; исправить описание и имя сценария. |
| [src/proxy.test.ts](</Users/mihhha/Documents/ecommerce/src/proxy.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/proxy.ts](</Users/mihhha/Documents/ecommerce/src/proxy.ts>) | Сохранить matcher, session check, no-store; не единственная защита admin. |
| [src/shared/components/admin/admin-breadcrumbs.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/admin/admin-breadcrumbs.tsx>) | Используется панелью; перенести в panel/_components. Общая таблица/действия оправданы реальными потребителями. |
| [src/shared/components/admin/admin-sidebar.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/admin/admin-sidebar.tsx>) | Используется панелью; перенести в panel/_components. Общая таблица/действия оправданы реальными потребителями. |
| [src/shared/components/admin/admin-table-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/admin/admin-table-skeleton.tsx>) | Используется панелью; перенести в panel/_components. Общая таблица/действия оправданы реальными потребителями. |
| [src/shared/components/admin/catalog-row-actions.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/admin/catalog-row-actions.tsx>) | Используется панелью; перенести в panel/_components. Общая таблица/действия оправданы реальными потребителями. |
| [src/shared/components/admin/data-table.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/admin/data-table.tsx>) | Используется панелью; перенести в panel/_components. Общая таблица/действия оправданы реальными потребителями. |
| [src/shared/components/cart-hydration.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/cart-hydration.tsx>) | Нужен persist skipHydration; сохранить и переместить вместе с корзиной. |
| [src/shared/components/cart-view.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/cart-view.tsx>) | Перенести к cart; выделить строку товара и checkout form. |
| [src/shared/components/catalog-filter.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/catalog-filter.tsx>) | Перенести к catalog; согласовать поле поиска с URL и историей. |
| [src/shared/components/catalog-results-transition.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/catalog-results-transition.tsx>) | Consumer недостижим; удалить также используемый, но бесполезный provider из layout. |
| [src/shared/components/catalog-results.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/catalog-results.tsx>) | Нет импортов; удалить старую реализацию. |
| [src/shared/components/catalog-view.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/catalog-view.tsx>) | Перенести к catalog; реализовать сброс фильтров ссылкой. |
| [src/shared/components/category-icon.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/category-icon.tsx>) | Реальная карта иконок с fallback; допустимо сохранить рядом с категориями. |
| [src/shared/components/error-fallback.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/error-fallback.tsx>) | Общий fallback сохранить; убрать ненужную совместимость retry для текущей версии. |
| [src/shared/components/main-category-list.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/main-category-list.tsx>) | Перенести к главной; простое чтение и отображение. |
| [src/shared/components/menu.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/menu.tsx>) | К layout магазина; общий конфиг иконок и route matcher. |
| [src/shared/components/mobile-menu.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/mobile-menu.tsx>) | К layout магазина; общий конфиг, отдельная мобильная разметка. |
| [src/shared/components/product-card.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/product-card.tsx>) | Общая product UI; серверная карточка и малая client-кнопка — кандидат. |
| [src/shared/components/product-pagination.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/product-pagination.tsx>) | Перенести к catalog; единый page parser; не clamp только отображение. |
| [src/shared/components/product-purchase.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/product-purchase.tsx>) | Реальная клиентская интерактивность; сохранить; форматирование и quantity UI согласовать. |
| [src/shared/components/product-visual.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/product-visual.tsx>) | Общее изображение; img выбран из-за произвольных доменов, не менять вслепую. |
| [src/shared/components/pwa-register.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/pwa-register.tsx>) | Регистрирует sw.js по URL; сохранить. |
| [src/shared/components/random-product-list.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/random-product-list.tsx>) | Перенести к главной; определить смысл случайной подборки. |
| [src/shared/components/skeleton/cart-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/skeleton/cart-skeleton.tsx>) | Используемый loading UI; держать рядом со сценарием, shared product skeleton можно оставить общим. |
| [src/shared/components/skeleton/catalog-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/skeleton/catalog-skeleton.tsx>) | Используемый loading UI; держать рядом со сценарием, shared product skeleton можно оставить общим. |
| [src/shared/components/skeleton/home-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/skeleton/home-skeleton.tsx>) | Используемый loading UI; держать рядом со сценарием, shared product skeleton можно оставить общим. |
| [src/shared/components/skeleton/product-card-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/skeleton/product-card-skeleton.tsx>) | Используемый loading UI; держать рядом со сценарием, shared product skeleton можно оставить общим. |
| [src/shared/components/skeleton/product-page-skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/skeleton/product-page-skeleton.tsx>) | Используемый loading UI; держать рядом со сценарием, shared product skeleton можно оставить общим. |
| [src/shared/components/transition-wrapper.tsx](</Users/mihhha/Documents/ecommerce/src/shared/components/transition-wrapper.tsx>) | Используется магазином; motion не мёртвая зависимость; preserve catalog layout осмыслен. |
| [src/shared/config/admin-navigation.ts](</Users/mihhha/Documents/ecommerce/src/shared/config/admin-navigation.ts>) | Используемые навигационные данные; объединить конфиг с иконками в соответствующем UI-сценарии. |
| [src/shared/config/navigation.ts](</Users/mihhha/Documents/ecommerce/src/shared/config/navigation.ts>) | Используемые навигационные данные; объединить конфиг с иконками в соответствующем UI-сценарии. |
| [src/shared/hooks/use-mobile.ts](</Users/mihhha/Documents/ecommerce/src/shared/hooks/use-mobile.ts>) | Используемый browser hook; useSyncExternalStore обеспечивает серверный snapshot. |
| [src/shared/lib/catalog.ts](</Users/mihhha/Documents/ecommerce/src/shared/lib/catalog.ts>) | Только formatPrice имеет внешних потребителей; убрать mock data и связанные типы. |
| [src/shared/lib/utils.ts](</Users/mihhha/Documents/ecommerce/src/shared/lib/utils.ts>) | Выбрать единую точку cn; сохранить полезную утилиту. |
| [src/shared/ui/accordion.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/accordion.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/badge.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/badge.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/breadcrumb.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/breadcrumb.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/button.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/button.tsx>) | Согласовать LinkButton с Next Link; Button использует API React Aria. |
| [src/shared/ui/card.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/card.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/dialog.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/dialog.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. Унифицировать импорт cn. |
| [src/shared/ui/dropdown-menu.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/dropdown-menu.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. Унифицировать импорт cn. |
| [src/shared/ui/empty.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/empty.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/field.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/field.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/input-group.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/input-group.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/input.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/input.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/kbd.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/kbd.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. Унифицировать импорт cn. |
| [src/shared/ui/label.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/label.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/pagination.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/pagination.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. Унифицировать импорт cn. |
| [src/shared/ui/popover.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/popover.tsx>) | Нет импортов; кандидат на удаление целиком. |
| [src/shared/ui/separator.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/separator.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/sheet.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/sheet.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/sidebar.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/sidebar.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/skeleton.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/skeleton.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/sonner.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/sonner.tsx>) | Toaster используется; theme всегда light, useTheme кандидат на удаление. |
| [src/shared/ui/table.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/table.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/textarea.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/textarea.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/toggle-group.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/toggle-group.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/toggle.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/toggle.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/shared/ui/tooltip.tsx](</Users/mihhha/Documents/ecommerce/src/shared/ui/tooltip.tsx>) | Используемый UI-модуль; сохранить базовый API. Неиспользуемые внешние экспорты — выборочная, низкоприоритетная чистка. |
| [src/store/cart-store.test.ts](</Users/mihhha/Documents/ecommerce/src/store/cart-store.test.ts>) | Тест используется runner; сохранить. Добавлять сценарии по выявленным изменениям, не переписывать под новую структуру. |
| [src/store/cart-store.ts](</Users/mihhha/Documents/ecommerce/src/store/cart-store.ts>) | Сохранить миграцию persisted-формата и storage fallback; перенести с корзиной. |
| [tsconfig.json](</Users/mihhha/Documents/ecommerce/tsconfig.json>) | Сузить include на собственный код; strict сохранить; alias менять необязательно. |
| [tsconfig.tsbuildinfo](</Users/mihhha/Documents/ecommerce/tsconfig.tsbuildinfo>) | Кеш TypeScript; исключить из контроля версий, если tracked. |
