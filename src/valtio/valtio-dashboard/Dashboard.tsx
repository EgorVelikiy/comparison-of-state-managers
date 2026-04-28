import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import {
  itemsState,
  derivedState,
  setFilters,
  selectItem,
  updateItem,
  loadItems,
  bulkUpdateItemsAction,
} from '../state/store';
import { FilterBar } from '../../components/FilterBar';
import { ItemList } from '../../components/ItemList';
import { ItemDetail } from '../../components/ItemDetail';
import { StatsPanel } from '../../components/StatsPanel';
import { ActionBar } from '../../components/ActionBar';
import { DashboardItem, DerivedState } from '../../types';

export const ValtioDashboard = () => {

  // useSnapshot создает реактивную подписку на изменения состояния
  const state = useSnapshot(itemsState);
  const derived = useSnapshot(derivedState);

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    if (state.items.length === 0) {
      loadItems(1000);
    }
  }, [state.items.length]);

  // Обработчики действий
  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleCategoryChange = (value: string) => {
    setFilters({ category: value });
  };

  const handleStatusChange = (value: string) => {
    setFilters({ status: value });
  };

  const handleItemSelect = (id: string) => {
    selectItem(id);
  };

  const handleItemUpdate = (item: DashboardItem) => {
    updateItem(item);
  };

  const handleBulkUpdate = () => {
    // Массовое обновление: увеличиваем значение на 10
    const updatedItems = derived.filteredItems.map((item: DashboardItem) => ({
      ...item,
      value: item.value + 10,
    }));
    bulkUpdateItemsAction(updatedItems);
  };

  const handleLoadData = () => {
    loadItems(1000);
  };

  // Формируем объект derived state для StatsPanel
  const stats: DerivedState = {
    totalCount: derived.totalCount,
    filteredCount: derived.filteredCount,
    averageValue: derived.averageValue,
    activeCount: derived.activeCount,
    inactiveCount: derived.inactiveCount,
  };

  return (
    <div className="dashboard-container">
      <FilterBar
        search={state.filters.search}
        category={state.filters.category}
        status={state.filters.status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      <ActionBar
        onBulkUpdate={handleBulkUpdate}
        onLoadData={handleLoadData}
        loadingState={state.loadingState}
      />

      <div className="dashboard-layout">
        <div>
          <ItemList
            items={derived.filteredItems}
            selectedItemId={state.selectedItemId}
            onItemSelect={handleItemSelect}
            onItemUpdate={handleItemUpdate}
          />
          <ItemDetail item={derived.selectedItem} />
        </div>

        <StatsPanel stats={stats} loadingState={state.loadingState} />
      </div>
    </div>
  );
};
