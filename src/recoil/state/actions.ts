/**
 * Recoil Actions для выполнения операций со состоянием
 * Функции-действия для обновления состояния через set (RecoilSet)
 */

import { SetterOrUpdater } from 'recoil';
import { DashboardItem, Filters } from '../../types';
import { fetchItems, bulkUpdateItems } from '../../utils/api';

// Загрузка элементов с сервера
export const loadItemsAction = async (
  setItems: SetterOrUpdater<DashboardItem[]>,
  setLoadingState: SetterOrUpdater<'idle' | 'loading' | 'success' | 'error'>,
  setError: SetterOrUpdater<string | null>,
  count: number = 1000
) => {
  setLoadingState('loading');
  setError(null);

  try {
    const items = await fetchItems(count);
    setItems(items);
    setLoadingState('success');
    setError(null);
  } catch (error) {
    setLoadingState('error');
    setError(error instanceof Error ? error.message : 'Ошибка загрузки данных');
  }
};

// Массовое обновление элементов
export const bulkUpdateItemsAction = async (
  getFilteredItems: () => DashboardItem[],
  setItems: SetterOrUpdater<DashboardItem[]>,
  setLoadingState: SetterOrUpdater<'idle' | 'loading' | 'success' | 'error'>,
  setError: SetterOrUpdater<string | null>,
  updateFn: (item: DashboardItem) => DashboardItem
) => {
  setLoadingState('loading');
  setError(null);

  try {
    const filteredItems = getFilteredItems();
    const updatedItems = filteredItems.map(updateFn);
    const result = await bulkUpdateItems(updatedItems);
    
    // Обновляем только измененные элементы в основном списке
    setItems((prevItems) => {
      const itemMap = new Map(result.map(item => [item.id, item]));
      return prevItems.map(item => itemMap.get(item.id) || item);
    });
    
    setLoadingState('success');
    setError(null);
  } catch (error) {
    setLoadingState('error');
    setError(error instanceof Error ? error.message : 'Ошибка обновления данных');
  }
};

// Обновление фильтров
export const setFiltersAction = (
  setFilters: SetterOrUpdater<Filters>,
  updates: Partial<Filters>
) => {
  setFilters((prev) => ({ ...prev, ...updates }));
};

// Выбор элемента
export const selectItemAction = (
  setSelectedItemId: SetterOrUpdater<string | null>,
  id: string | null
) => {
  setSelectedItemId(id);
};

// Локальное обновление одного элемента
export const updateItemAction = (
  setItems: SetterOrUpdater<DashboardItem[]>,
  item: DashboardItem
) => {
  setItems((prevItems) =>
    prevItems.map((prevItem) =>
      prevItem.id === item.id ? item : prevItem
    )
  );
};

// Массовое локальное обновление (без API)
export const bulkUpdateLocalAction = (
  setItems: SetterOrUpdater<DashboardItem[]>,
  updates: Partial<DashboardItem>
) => {
  setItems((prevItems) =>
    prevItems.map((item) => ({ ...item, ...updates }))
  );
};
