import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  selectFilteredItems,
  selectSelectedItem,
  selectDerivedState,
  selectFilters,
  selectLoadingState,
} from '../state/selectors'
import {
  setFilters,
  selectItem,
  updateItem,
  loadItemsAsync,
  bulkUpdateItemsAsync,
} from '../state/itemsSlice';
import { FilterBar } from '../../components/FilterBar';
import { ItemList } from '../../components/ItemList';
import { ItemDetail } from '../../components/ItemDetail';
import { StatsPanel } from '../../components/StatsPanel';
import { ActionBar } from '../../components/ActionBar';
import { DashboardItem } from '../../types';

export const ReduxDashboard = () => {

  const dispatch = useAppDispatch();

  // Селекторы для получения данных из Redux store
  const filteredItems = useAppSelector(selectFilteredItems);
  const selectedItem = useAppSelector(selectSelectedItem);
  const filters = useAppSelector(selectFilters);
  const derivedState = useAppSelector(selectDerivedState);
  const loadingState = useAppSelector(selectLoadingState);

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    if (filteredItems.length === 0) {
      dispatch(loadItemsAsync(1000));
    }
  }, [dispatch, filteredItems.length]);

  // Обработчики действий
  const handleSearchChange = (value: string) => {
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setFilters({ category: value }));
  };

  const handleStatusChange = (value: string) => {
    dispatch(setFilters({ status: value }));
  };

  const handleItemSelect = (id: string) => {
    dispatch(selectItem(id));
  };

  const handleItemUpdate = (item: DashboardItem) => {
    dispatch(updateItem(item));
  };

  const handleBulkUpdate = () => {
    // Массовое обновление: увеличиваем значение на 10
    dispatch(bulkUpdateItemsAsync(
      filteredItems.map(item => ({ ...item, value: item.value + 10 }))
    ));
  };

  const handleLoadData = () => {
    dispatch(loadItemsAsync(1000));
  };

  return (
    <div className="dashboard-container">
      <FilterBar
        search={filters.search}
        category={filters.category}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      <ActionBar
        onBulkUpdate={handleBulkUpdate}
        onLoadData={handleLoadData}
        loadingState={loadingState}
      />

      <div className="dashboard-layout">
        <div>
          <ItemList
            items={filteredItems}
            selectedItemId={selectedItem?.id || null}
            onItemSelect={handleItemSelect}
            onItemUpdate={handleItemUpdate}
          />
          <ItemDetail item={selectedItem} />
        </div>

        <StatsPanel stats={derivedState} loadingState={loadingState} />
      </div>
    </div>
  );
};
