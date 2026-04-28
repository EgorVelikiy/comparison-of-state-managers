/**
 * Redux Selectors для derived state
 * Вычисляемые значения на основе состояния
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { DerivedState } from '../../types';

// Базовые селекторы
const selectItems = (state: RootState) => state.items.items;
const selectFilteredItems = (state: RootState) => state.items.filteredItems;
const selectSelectedItemId = (state: RootState) => state.items.selectedItemId;
const selectFilters = (state: RootState) => state.items.filters;
const selectLoadingState = (state: RootState) => state.items.loadingState;

// Derived State: общее количество элементов
export const selectTotalCount = createSelector(
  [selectItems],
  (items) => items.length
);

// Derived State: количество отфильтрованных элементов
export const selectFilteredCount = createSelector(
  [selectFilteredItems],
  (filteredItems) => filteredItems.length
);

// Derived State: среднее значение всех элементов
export const selectAverageValue = createSelector(
  [selectFilteredItems],
  (items) => {
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item.value, 0);
    return sum / items.length;
  }
);

// Derived State: количество активных элементов
export const selectActiveCount = createSelector(
  [selectItems],
  (items) => items.filter(item => item.status === 'active').length
);

// Derived State: количество неактивных элементов
export const selectInactiveCount = createSelector(
  [selectItems],
  (items) => items.filter(item => item.status === 'inactive').length
);

// Derived State: все вычисляемые значения в одном объекте
export const selectDerivedState = createSelector(
  [
    selectTotalCount,
    selectFilteredCount,
    selectAverageValue,
    selectActiveCount,
    selectInactiveCount,
  ],
  (totalCount, filteredCount, averageValue, activeCount, inactiveCount): DerivedState => ({
    totalCount,
    filteredCount,
    averageValue,
    activeCount,
    inactiveCount,
  })
);

// Селектор для выбранного элемента
export const selectSelectedItem = createSelector(
  [selectItems, selectSelectedItemId],
  (items, selectedId) => {
    if (!selectedId) return null;
    return items.find(item => item.id === selectedId) || null;
  }
);

// Экспорт всех селекторов
export {
  selectItems,
  selectFilteredItems,
  selectSelectedItemId,
  selectFilters,
  selectLoadingState,
};
