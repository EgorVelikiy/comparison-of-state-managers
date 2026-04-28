/**
 * Recoil Atoms для управления состоянием элементов
 * Определение атомарного состояния приложения
 */

import { atom, selector } from 'recoil';
import { DashboardItem, Filters, LoadingState, DerivedState } from '../../types';

// Atoms: базовое состояние
export const itemsAtom = atom<DashboardItem[]>({
  key: 'itemsAtom',
  default: [],
});

export const filtersAtom = atom<Filters>({
  key: 'filtersAtom',
  default: {
    search: '',
    category: '',
    status: '',
  },
});

export const selectedItemIdAtom = atom<string | null>({
  key: 'selectedItemIdAtom',
  default: null,
});

export const loadingStateAtom = atom<LoadingState>({
  key: 'loadingStateAtom',
  default: 'idle',
});

export const errorAtom = atom<string | null>({
  key: 'errorAtom',
  default: null,
});

// Selectors: вычисляемые значения

// Отфильтрованный список элементов
export const filteredItemsSelector = selector<DashboardItem[]>({
  key: 'filteredItemsSelector',
  get: ({ get }) => {
    const items = get(itemsAtom);
    const filters = get(filtersAtom);

    let filtered = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    return filtered;
  },
});

// Выбранный элемент
export const selectedItemSelector = selector<DashboardItem | null>({
  key: 'selectedItemSelector',
  get: ({ get }) => {
    const items = get(itemsAtom);
    const selectedId = get(selectedItemIdAtom);

    if (!selectedId) return null;
    return items.find(item => item.id === selectedId) || null;
  },
});

// Derived State: общее количество элементов
export const totalCountSelector = selector<number>({
  key: 'totalCountSelector',
  get: ({ get }) => {
    const items = get(itemsAtom);
    return items.length;
  },
});

// Derived State: количество отфильтрованных элементов
export const filteredCountSelector = selector<number>({
  key: 'filteredCountSelector',
  get: ({ get }) => {
    const filteredItems = get(filteredItemsSelector);
    return filteredItems.length;
  },
});

// Derived State: среднее значение всех элементов
export const averageValueSelector = selector<number>({
  key: 'averageValueSelector',
  get: ({ get }) => {
    const items = get(filteredItemsSelector);
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item.value, 0);
    return sum / items.length;
  },
});

// Derived State: количество активных элементов
export const activeCountSelector = selector<number>({
  key: 'activeCountSelector',
  get: ({ get }) => {
    const items = get(itemsAtom);
    return items.filter(item => item.status === 'active').length;
  },
});

// Derived State: количество неактивных элементов
export const inactiveCountSelector = selector<number>({
  key: 'inactiveCountSelector',
  get: ({ get }) => {
    const items = get(itemsAtom);
    return items.filter(item => item.status === 'inactive').length;
  },
});

// Derived State: все вычисляемые значения в одном объекте
export const derivedStateSelector = selector<DerivedState>({
  key: 'derivedStateSelector',
  get: ({ get }) => {
    return {
      totalCount: get(totalCountSelector),
      filteredCount: get(filteredCountSelector),
      averageValue: get(averageValueSelector),
      activeCount: get(activeCountSelector),
      inactiveCount: get(inactiveCountSelector),
    };
  },
});
