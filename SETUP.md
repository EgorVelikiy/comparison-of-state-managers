# Инструкция по настройке и запуску проекта

## Быстрая установка

### 1. Установка всех зависимостей

```bash
# Установка зависимостей клиента
npm install

# Установка зависимостей сервера
cd server
npm install
cd ..
```

Или используйте скрипт для установки всего сразу:
```bash
npm run install:all
```

## Запуск приложения

### Важно: запуск в двух терминалах

Для работы приложения необходимо запустить **оба** сервиса одновременно:

#### Терминал 1: Express API сервер
```bash
npm run server:dev
```

Или:
```bash
cd server
npm run dev
```

Сервер будет доступен на: **http://localhost:3001**

#### Терминал 2: React клиентское приложение
```bash
npm run dev
```

Клиент будет доступен на: **http://localhost:5173**

## Проверка работы

1. **Проверка сервера:**
   ```bash
   curl http://localhost:3001/health
   ```
   Должен вернуть: `{"status":"ok","timestamp":"...","uptime":...}`

2. **Проверка API:**
   ```bash
   curl http://localhost:3001/api/items?count=10
   ```
   Должен вернуть массив из 10 элементов

3. **Проверка клиента:**
   - Откройте браузер: http://localhost:5173
   - Выберите любой state manager из выпадающего списка
   - Нажмите "Загрузить данные с сервера"
   - Данные должны загрузиться с сервера

## Настройка API URL

Если сервер запущен на другом порту или хосте, создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:3001/api
```

Или используйте переменную окружения:
```bash
VITE_API_URL=http://localhost:4000/api npm run dev
```

## Структура проекта

```
.
├── src/                    # React клиентское приложение
│   ├── components/         # Компоненты
│   ├── state/             # State management логика
│   ├── utils/             # Утилиты (включая api.ts)
│   └── ...
├── server/                 # Express API сервер
│   ├── src/
│   │   ├── routes/        # API маршруты
│   │   ├── data/          # Mock данные
│   │   └── index.ts       # Точка входа сервера
│   └── package.json
└── package.json           # Клиентское приложение
```

## Скрипты

### Клиентское приложение (корень проекта)
- `npm run dev` - Запуск dev сервера
- `npm run build` - Сборка для production
- `npm run preview` - Предпросмотр production сборки
- `npm run lint` - Линтинг кода

### Сервер (папка server/)
- `npm run dev` - Запуск dev сервера с hot reload
- `npm run build` - Сборка TypeScript
- `npm start` - Запуск production сервера
- `npm run lint` - Линтинг кода

### Удобные скрипты из корня
- `npm run server:dev` - Запуск dev сервера
- `npm run server:build` - Сборка сервера
- `npm run server:start` - Запуск production сервера
- `npm run server:install` - Установка зависимостей сервера
- `npm run install:all` - Установка всех зависимостей

## Troubleshooting

### Ошибка "Cannot connect to API"
- Убедитесь, что сервер запущен на порту 3001
- Проверьте CORS настройки в `server/src/index.ts`
- Проверьте URL API в `.env` файле

### Ошибка "Port already in use"
- Измените порт сервера через переменную окружения: `PORT=4000 npm run server:dev`
- Обновите `VITE_API_URL` в `.env` соответственно

### Проблемы с TypeScript
- Убедитесь, что установлены все типы: `npm install --save-dev @types/node @types/express`
- В папке server: `npm install --save-dev @types/node @types/express`

## Production сборка

### Сервер
```bash
cd server
npm run build
npm start
```

### Клиент
```bash
npm run build
npm run preview
```

В production режиме сервер нужно запускать отдельно перед клиентом.
