/**
 * Redux Toolkit Slice для управления состоянием элементов
 * Реализует все операции: загрузка, обновление, фильтрация, выбор элемента
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardItem, Filters, LoadingState } from '../../types';
import { fetchItems, bulkUpdateItems } from '../../utils/api';

// Начальное состояние
interface ItemsState {
  items: DashboardItem[];
  filteredItems: DashboardItem[];
  filters: Filters;
  selectedItemId: string | null;
  loadingState: LoadingState;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  filteredItems: [],
  filters: {
    search: '',
    category: '',
    status: '',
  },
  selectedItemId: null,
  loadingState: 'idle',
  error: null,
};

// Асинхронная загрузка данных
export const loadItemsAsync = createAsyncThunk(
  'items/loadItems',
  async (count: number = 1000) => {
    const items = await fetchItems(count);
    return items;
  }
);

// Асинхронное массовое обновление
export const bulkUpdateItemsAsync = createAsyncThunk(
  'items/bulkUpdate',
  async (items: DashboardItem[]) => {
    const updatedItems = await bulkUpdateItems(items);
    return updatedItems;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Обновление фильтров
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Применение фильтров к списку
      applyFilters(state);
    },

    // Выбор элемента
    selectItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },

    // Локальное обновление одного элемента
    updateItem: (state, action: PayloadAction<DashboardItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        // Пересчет отфильтрованного списка
        applyFilters(state);
      }
    },

    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.id !== action.payload
      );

      if (state.selectedItemId === action.payload) {
        state.selectedItemId = null;
      }
      applyFilters(state);
    },

    // Массовое обновление всех элементов (локальное, без API)
    bulkUpdateLocal: (state, action: PayloadAction<Partial<DashboardItem>>) => {
      state.items = state.items.map(item => ({
        ...item,
        ...action.payload,
      }));
      // Пересчет отфильтрованного списка
      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    // Обработка загрузки данных
    builder
      .addCase(loadItemsAsync.pending, (state) => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(loadItemsAsync.fulfilled, (state, action) => {
        state.loadingState = 'success';
        state.items = action.payload;
        applyFilters(state);
      })
      .addCase(loadItemsAsync.rejected, (state, action) => {
        state.loadingState = 'error';
        state.error = action.error.message || 'Ошибка загрузки данных';
      });

    // Обработка массового обновления
    builder
      .addCase(bulkUpdateItemsAsync.pending, (state) => {
        state.loadingState = 'loading';
        state.error = null;
      })
      .addCase(bulkUpdateItemsAsync.fulfilled, (state, action) => {
        state.loadingState = 'success';
        state.items = action.payload;
        applyFilters(state);
      })
      .addCase(bulkUpdateItemsAsync.rejected, (state, action) => {
        state.loadingState = 'error';
        state.error = action.error.message || 'Ошибка обновления данных';
      });
  },
});

// Функция применения фильтров (локальная логика фильтрации)
function applyFilters(state: ItemsState) {
  let filtered = [...state.items];

  // Фильтр по поисковому запросу
  if (state.filters.search) {
    const searchLower = state.filters.search.toLowerCase();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    );
  }

  // Фильтр по категории
  if (state.filters.category) {
    filtered = filtered.filter(item => item.category === state.filters.category);
  }

  // Фильтр по статусу
  if (state.filters.status) {
    filtered = filtered.filter(item => item.status === state.filters.status);
  }

  state.filteredItems = filtered;
}

export const { setFilters, selectItem, updateItem, bulkUpdateLocal } = itemsSlice.actions;
export default itemsSlice.reducer;
