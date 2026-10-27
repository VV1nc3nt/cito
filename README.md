# Сайт ФГБУ ЦИТО

Сайт [digitalobr.ru](https://digitalobr.ru): Next.js (App Router) + Payload CMS 3 + PostgreSQL в одном приложении.

## Требования

- Node.js `^22.23.4` или `>=24.22.1`
- pnpm 12 (версия закреплена в `packageManager`, удобно через `corepack enable`)
- Docker с Compose v2

## Локальная разработка

```sh
cp .env.example .env          # заменить плейсхолдеры, PAYLOAD_SECRET — `openssl rand -hex 32`
docker compose up -d postgres # только база, порт 127.0.0.1:5432
pnpm install
pnpm dev                      # http://localhost:3000
```

Если порт 5432 занят, задайте `POSTGRES_PORT` в `.env` и поправьте порт в `DATABASE_URL`.

В dev-режиме Payload синхронизирует схему БД сам (push), миграции не нужны.

## Запуск через Docker Compose

```sh
cp .env.example .env   # заменить плейсхолдеры
docker compose up -d --build
```

Поднимаются `postgres` (17) и `app`. `app` стартует после того, как postgres пройдёт healthcheck,
применяет миграции и слушает `127.0.0.1:3000` (порт меняется через `APP_PORT`). Снаружи сайт
отдаётся через nginx. Внутри compose `DATABASE_URL` указывает на сервис `postgres`
автоматически. Пароль БД подставляется в URL как есть — используйте символы, допустимые в URL,
или экранируйте их.

Данные хранятся в именованных томах: `pgdata` (база) и `media` (загруженные файлы).
`docker compose down` их не удаляет, `docker compose down -v` — удаляет.

## Первый администратор

Откройте `/admin`: на пустой базе Payload покажет форму создания первого пользователя.
Он автоматически получает роль «Администратор». Остальных пользователей создаёт администратор
в разделе «Пользователи».

Роли:

- **Администратор** — полный доступ, управляет пользователями.
- **Редактор** — работает с контентом и медиа; раздел «Пользователи» ему не виден и недоступен.

## Миграции

- В dev схема обновляется push-режимом.
- После изменения коллекций создайте миграцию (нужна запущенная БД):

  ```sh
  pnpm payload migrate:create <name>
  ```

  Файлы появятся в `src/migrations/` — их нужно закоммитить.

- В production миграции применяются автоматически при старте сервера
  (`prodMigrations` + `src/instrumentation.ts`). Если инициализация или миграция падает,
  процесс завершается с ненулевым кодом.

## Медиа

Коллекция `media`: JPG, PNG, WebP и PDF до 20 МБ. Для изображений обязателен альтернативный текст.
Файлы лежат на диске: локально в `./media`, в контейнере — `/app/media` (том `media`).
Каталог задаётся переменной `MEDIA_DIR`. При отдаче через nginx не забудьте `client_max_body_size`
не меньше 20 МБ.

## Дизайн-токены, шрифты, стили

- `src/styles/tokens.css` — все токены (цвета, радиусы, тени, сетка, размеры шрифтов по брейкпоинтам).
  Единственный источник значений для компонентов.
- `src/styles/base.css` — базовые стили, типографика, фокус, reduced-motion, утилиты (`.nowrap` и др.).
- `src/components/layout/` — `Container` и `Grid`.
- `src/fonts/` — Onest и JetBrains Mono (woff2, self-host, OFL); источники и пересборка — в
  `src/fonts/README.md`. Подключение — `src/app/(frontend)/fonts.ts`.
- `/dev/tokens` — демо-страница токенов (только в dev, в production — 404).

Брейкпоинты: десктоп ≥1200px, планшет 768–1199px, мобильный <768px.

## Скрипты

| Команда                     | Что делает                             |
| --------------------------- | -------------------------------------- |
| `pnpm dev`                  | dev-сервер                             |
| `pnpm build` / `pnpm start` | production-сборка и запуск             |
| `pnpm lint`                 | ESLint                                 |
| `pnpm typecheck`            | `tsc --noEmit`                         |
| `pnpm generate:types`       | типы Payload в `src/payload-types.ts`  |
| `pnpm generate:importmap`   | import map админки                     |
| `pnpm test:e2e`             | Playwright (нужен запущенный postgres) |

## CI

GitHub Actions (`.github/workflows/ci.yml`) на каждый push и pull request: установка
зависимостей, `lint`, `typecheck`, `build` с фиктивными переменными окружения.
