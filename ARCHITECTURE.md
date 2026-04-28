# Архитектура проекта

## Общая структура

Проект разработан для сравнительного анализа различных state managers. Все реализации используют идентичную структуру компонентов и одинаковые сценарии обновления состояния.

## Компонентная архитектура

### Общие компоненты (`src/components/shared/`)

Все UI компоненты вынесены в папку `shared/`, чтобы обеспечить идентичность для всех реализаций:

- **FilterBar.tsx** - Компонент фильтрации списка
- **ItemList.tsx** - Компонент списка элементов (1000 элементов)
- **ItemDetail.tsx** - Компонент детальной информации об элементе
- **StatsPanel.tsx** - Компонент панели статистики (Derived State)
- **ActionBar.tsx** - Компонент панели действий для массовых операций

### Реализации для каждого State Manager

Каждый state manager имеет свой Dashboard компонент, который использует общие UI компоненты:

- **Redux Toolkit** (`src/components/redux/Dashboard.tsx`)
- **MobX** (`src/components/mobx/Dashboard.tsx`)
- **Recoil** (`src/components/recoil/Dashboard.tsx`)
- **Valtio** (`src/components/valtio/Dashboard.tsx`)

## State Management

### Redux Toolkit (`src/state/redux/`)

- **store.ts** - Конфигурация Redux store
- **itemsSlice.ts** - Slice с reducer, actions и async thunks
- **selectors.ts** - Memoized selectors для derived state (createSelector)
- **hooks.ts** - Типизированные хуки useAppDispatch и useAppSelector

**Особенности:**
- Использует `createSlice` для создания reducer и actions
- `createAsyncThunk` для асинхронных операций
- `createSelector` для мемоизации derived state
- Централизованное хранилище через configureStore

### MobX (`src/state/mobx/`)

- **ItemsStore.ts** - Класс-based store с makeAutoObservable

**Особенности:**
- Класс-based подход с observable и computed свойствами
- `makeAutoObservable` для автоматической реактивности
- `observer` HOC для реактивных компонентов
- `runInAction` для обновления состояния в async функциях
- Computed values для derived state

### Recoil (`src/state/recoil/`)

- **atoms.ts** - Atoms для базового состояния и selectors для derived state
- **actions.ts** - Функции-действия для обновления состояния

**Особенности:**
- Atoms для атомарного состояния
- Selectors для вычисляемых значений и derived state
- Отдельные функции-actions для обновления состояния
- Использует RecoilRoot для провайдера

### Valtio (`src/state/valtio/`)

- **store.ts** - Proxy-based состояние и derived state

**Особенности:**
- Proxy-based состояние через `proxy()`
- `derive` для вычисляемых значений
- `useSnapshot` для реактивной подписки в компонентах
- Прямое мутирование состояния (через proxy)

## Типы данных (`src/types/`)

- **DashboardItem** - Интерфейс элемента списка
- **Filters** - Интерфейс фильтров
- **AppState** - Глобальное состояние приложения
- **DerivedState** - Вычисляемые значения
- **LoadingState** - Статус загрузки данных

## Утилиты (`src/utils/`)

### api.ts

Функции для асинхронной загрузки данных:
- `fetchItems()` - Загрузка списка элементов
- `updateItem()` - Обновление одного элемента
- `bulkUpdateItems()` - Массовое обновление элементов

**Примечание:** Для реального API раскомментируйте импорт axios и используйте реальные endpoints.

### renderLogger.tsx

Утилита для логирования ререндеров компонентов:
- `useRenderLogger()` - Хук для отслеживания ререндеров
- `getRenderCounts()` - Получить счетчики ререндеров
- `resetRenderCounts()` - Сбросить счетчики

## Особенности реализации

### Отсутствие оптимизаций

Для чистоты сравнения **не используются** оптимизации:
- Нет `React.memo()`
- Нет `useCallback()`
- Нет `useMemo()`
- Нет виртуализации списков

Это позволяет видеть реальное влияние каждого state manager на производительность без искажений от оптимизаций.

### Идентичные сценарии

Все реализации используют одинаковые:
- Структуру данных
- Сценарии обновления состояния
- Компоненты UI
- Логику фильтрации
- Логику вычисления derived state

### Derived State

Все state managers реализуют одинаковый derived state:
- Общее количество элементов
- Количество отфильтрованных элементов
- Среднее значение всех элементов
- Количество активных элементов
- Количество неактивных элементов

Каждый state manager использует свои средства:
- **Redux Toolkit:** `createSelector`
- **MobX:** `computed` свойства
- **Recoil:** `selector`
- **Valtio:** `derive`

## Анализ производительности

### React Profiler

Приложение готово для анализа через React Profiler:
1. Откройте DevTools → Profiler
2. Запишите профиль при выполнении операций
3. Сравните результаты для разных state managers

### Логирование ререндеров

- Счетчики ререндеров отображаются в правом нижнем углу экрана
- Логирование в консоль (в dev режиме)
- Возможность сброса счетчиков

### Lighthouse

Приложение готово для анализа производительности через Lighthouse:
- Performance метрики
- Время загрузки
- Время интерактивности

## Главный компонент (App.tsx)

`App.tsx` обеспечивает:
- Переключение между реализациями state managers
- Провайдеры для Redux (ReduxProvider) и Recoil (RecoilRoot)
- Отображение счетчиков ререндеров
- Сброс счетчиков при переключении state manager

## Стили (src/styles/)

Минимальные стили без использования UI-библиотек:
- Базовые стили для компонентов
- Адаптивная верстка
- Стилизация списка элементов
- Стили для фильтров и панелей

## Запуск и разработка

См. файлы `README.md` и `INSTALL.md` для подробных инструкций по установке и запуску.
