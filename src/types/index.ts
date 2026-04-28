/**
 * Базовые типы данных для всех реализаций state managers
 */

// Элемент списка в dashboard
export interface DashboardItem {
  id: string;
  name: string;
  value: number;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  timestamp: number;
}

// Фильтры для списка
export interface Filters {
  search: string;
  category: string;
  status: string;
}

// Статус загрузки данных
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Глобальное состояние приложения
export interface AppState {
  items: DashboardItem[];
  filters: Filters;
  selectedItemId: string | null;
  loadingState: LoadingState;
  error: string | null;
}

// Derived state - вычисляемые значения
export interface DerivedState {
  totalCount: number;
  averageValue: number;
  filteredCount: number;
  activeCount: number;
  inactiveCount: number;
}

// Утилита для создания mock данных
export const createMockItem = (id: string, index: number): DashboardItem => {
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'inactive', 'pending'];
  
  return {
    id,
    name: `Item ${index + 1}`,
    value: Math.floor(Math.random() * 1000) + 1,
    category: categories[Math.floor(Math.random() * categories.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: Date.now() + index * 1000,
  };
};

// Генерация начального списка элементов
export const generateInitialItems = (count: number = 1000): DashboardItem[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockItem(`item-${index}`, index)
  );
};


export type StateManagerType = "redux" | "mobx" | "recoil" | "valtio";