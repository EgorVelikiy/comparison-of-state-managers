import { proxy } from "valtio";
import { derive } from "valtio/utils";
import { DashboardItem, Filters, LoadingState } from "../../types";
import { fetchItems, bulkUpdateItems } from "../../utils/api";

function applyFilters(items: DashboardItem[], filters: Filters): DashboardItem[] {
  let filtered = [...items];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((item: DashboardItem) =>
      item.name.toLowerCase().includes(searchLower),
    );
  }

  if (filters.category) {
    filtered = filtered.filter(
      (item: DashboardItem) => item.category === filters.category,
    );
  }

  if (filters.status) {
    filtered = filtered.filter(
      (item: DashboardItem) => item.status === filters.status,
    );
  }

  return filtered;
}

//тип состояния
export interface InitialState {
  items: DashboardItem[];
  filters: Filters;
  selectedItemId: string | null;
  loadingState: LoadingState;
  error: string | null;
}

// Базовое состояние через proxy для реактивности
export const itemsState = proxy<InitialState>({
  items: [],
  filters: {
    search: "",
    category: "",
    status: "",
  },
  selectedItemId: null,
  loadingState: "idle",
  error: null,
});

export const derivedState = derive({
  // Отфильтрованный список элементов
  filteredItems(get) {
    const state = get(itemsState);
    return applyFilters(state.items, state.filters);
  },

  // Общее количество элементов
  totalCount: (get) => {
    const state = get(itemsState);
    return state.items.length;
  },

  // Количество отфильтрованных элементов
  filteredCount: (get) => {
    const state = get(itemsState);
    return applyFilters(state.items, state.filters).length;
  },

  // Среднее значение отфильтрованных элементов
  averageValue: (get) => {
    const state = get(itemsState);
    const filtered = applyFilters(state.items, state.filters);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce(
      (acc: number, item: DashboardItem) => acc + item.value,
      0,
    );
    return sum / filtered.length;
  },

  // Количество активных элементов
  activeCount: (get) => {
    const state = get(itemsState);
    return state.items.filter((item: DashboardItem) => item.status === "active")
      .length;
  },

  // Количество неактивных элементов
  inactiveCount: (get) => {
    const state = get(itemsState);
    return state.items.filter(
      (item: DashboardItem) => item.status === "inactive",
    ).length;
  },

  // Выбранный элемент
  selectedItem: (get) => {
    const state = get(itemsState);
    if (!state.selectedItemId) return null;
    return (
      state.items.find(
        (item: DashboardItem) => item.id === state.selectedItemId,
      ) || null
    );
  },
});

// Actions: функции для обновления состояния

// Установка фильтров
export const setFilters = (filters: Partial<Filters>) => {
  itemsState.filters = { ...itemsState.filters, ...filters };
};

// Выбор элемента
export const selectItem = (id: string | null) => {
  itemsState.selectedItemId = id;
};

// Локальное обновление одного элемента
export const updateItem = (item: DashboardItem) => {
  const index = itemsState.items.findIndex(
    (i: DashboardItem) => i.id === item.id,
  );
  if (index !== -1) {
    itemsState.items[index] = item;
  }
};

// Массовое локальное обновление (без API)
export const bulkUpdateLocal = (updates: Partial<DashboardItem>) => {
  itemsState.items = itemsState.items.map((item: DashboardItem) => ({
    ...item,
    ...updates,
  }));
};

// Асинхронная загрузка данных
export const loadItems = async (count: number = 1000) => {
  itemsState.loadingState = "loading";
  itemsState.error = null;

  try {
    const items = await fetchItems(count);
    itemsState.items = items;
    itemsState.loadingState = "success";
    itemsState.error = null;
  } catch (error) {
    itemsState.loadingState = "error";
    itemsState.error =
      error instanceof Error ? error.message : "Ошибка загрузки данных";
  }
};

// Асинхронное массовое обновление
export const bulkUpdateItemsAction = async (items: DashboardItem[]) => {
  itemsState.loadingState = "loading";
  itemsState.error = null;

  try {
    const updatedItems = await bulkUpdateItems(items);
    // Обновляем только измененные элементы в основном списке
    const itemMap = new Map(
      updatedItems.map((item: DashboardItem) => [item.id, item]),
    );
    itemsState.items = itemsState.items.map(
      (item: DashboardItem) => itemMap.get(item.id) || item,
    );
    itemsState.loadingState = "success";
    itemsState.error = null;
  } catch (error) {
    itemsState.loadingState = "error";
    itemsState.error =
      error instanceof Error ? error.message : "Ошибка обновления данных";
  }
};
