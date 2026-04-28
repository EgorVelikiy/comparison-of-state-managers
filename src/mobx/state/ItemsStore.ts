import { makeAutoObservable, runInAction } from 'mobx';
import { DashboardItem, Filters, LoadingState, DerivedState } from '../../types';
import { fetchItems, bulkUpdateItems } from '../../utils/api';

class ItemsStore {
  // Observable состояние
  items: DashboardItem[] = [];
  filters: Filters = {
    search: '',
    category: '',
    status: '',
  };
  selectedItemId: string | null = null;
  loadingState: LoadingState = 'idle';
  error: string | null = null;

  constructor() {
    // Автоматическое превращение всех полей в observable и методов в actions
    makeAutoObservable(this);
  }

  // Computed: отфильтрованный список элементов
  get filteredItems(): DashboardItem[] {
    let filtered = [...this.items];

    if (this.filters.search) {
      const searchLower = this.filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower)
      );
    }

    if (this.filters.category) {
      filtered = filtered.filter(item => item.category === this.filters.category);
    }

    if (this.filters.status) {
      filtered = filtered.filter(item => item.status === this.filters.status);
    }

    return filtered;
  }

  // Computed: Derived State - общее количество элементов
  get totalCount(): number {
    return this.items.length;
  }

  // Computed: Derived State - количество отфильтрованных элементов
  get filteredCount(): number {
    return this.filteredItems.length;
  }

  // Computed: Derived State - среднее значение всех элементов
  get averageValue(): number {
    if (this.items.length === 0) return 0;
    const sum = this.filteredItems.reduce((acc, item) => acc + item.value, 0);
    return sum / this.filteredItems.length;
  }

  // Computed: Derived State - количество активных элементов
  get activeCount(): number {
    return this.items.filter(item => item.status === 'active').length;
  }

  // Computed: Derived State - количество неактивных элементов
  get inactiveCount(): number {
    return this.items.filter(item => item.status === 'inactive').length;
  }

  // Computed: все вычисляемые значения в одном объекте
  get derivedState(): DerivedState {
    return {
      totalCount: this.totalCount,
      filteredCount: this.filteredCount,
      averageValue: this.averageValue,
      activeCount: this.activeCount,
      inactiveCount: this.inactiveCount,
    };
  }

  // Computed: выбранный элемент
  get selectedItem(): DashboardItem | null {
    if (!this.selectedItemId) return null;
    return this.items.find(item => item.id === this.selectedItemId) || null;
  }

  // Actions

  // Установка фильтров
  setFilters(filters: Partial<Filters>) {
    this.filters = { ...this.filters, ...filters };
  }

  // Выбор элемента
  selectItem(id: string | null) {
    this.selectedItemId = id;
  }

  // Локальное обновление одного элемента
  updateItem(item: DashboardItem) {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    }
  }

  // Массовое обновление всех элементов (локальное, без API)
  bulkUpdateLocal(updates: Partial<DashboardItem>) {
    this.items = this.items.map(item => ({
      ...item,
      ...updates,
    }));
  }

  // Асинхронная загрузка данных
  async loadItems(count: number = 1000) {
    this.loadingState = 'loading';
    this.error = null;

    try {
      const items = await fetchItems(count);
      runInAction(() => {
        this.items = items;
        this.loadingState = 'success';
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingState = 'error';
        this.error = error instanceof Error ? error.message : 'Ошибка загрузки данных';
      });
    }
  }

  // Асинхронное массовое обновление
  async bulkUpdateItemsAction(items: DashboardItem[]) {
    this.loadingState = 'loading';
    this.error = null;

    try {
      const updatedItems = await bulkUpdateItems(items);
      runInAction(() => {
        this.items = updatedItems;
        this.loadingState = 'success';
        this.error = null;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingState = 'error';
        this.error = error instanceof Error ? error.message : 'Ошибка обновления данных';
      });
    }
  }
}

// Создание единственного экземпляра store (Singleton)
export const itemsStore = new ItemsStore();
