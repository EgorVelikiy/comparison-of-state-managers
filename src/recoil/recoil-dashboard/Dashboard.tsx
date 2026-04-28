import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  itemsAtom,
  filtersAtom,
  selectedItemIdAtom,
  loadingStateAtom,
  filteredItemsSelector,
  selectedItemSelector,
  derivedStateSelector,
  errorAtom,
} from '../state/atoms';
import {
  loadItemsAction,
  bulkUpdateItemsAction,
  setFiltersAction,
  selectItemAction,
  updateItemAction,
} from '../state/actions';
import { FilterBar } from '../../components/FilterBar';
import { ItemList } from '../../components/ItemList';
import { ItemDetail } from '../../components/ItemDetail';
import { StatsPanel } from '../../components/StatsPanel';
import { ActionBar } from '../../components/ActionBar';
import { DashboardItem } from '../../types';

export const RecoilDashboard = () => {

  // Recoil hooks для работы со состоянием
  const [items, setItems] = useRecoilState(itemsAtom);
  const [filters, setFilters] = useRecoilState(filtersAtom);
  const [selectedItemId, setSelectedItemId] = useRecoilState(selectedItemIdAtom);
  const [loadingState, setLoadingState] = useRecoilState(loadingStateAtom);
  const setError = useSetRecoilState(errorAtom);

  // Recoil selectors для вычисляемых значений
  const filteredItems = useRecoilValue(filteredItemsSelector);
  const selectedItem = useRecoilValue(selectedItemSelector);
  const derivedState = useRecoilValue(derivedStateSelector);

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    if (items.length === 0) {
      loadItemsAction(setItems, setLoadingState, setError, 1000);
    }
  }, [items.length, setItems, setLoadingState, setError]);

  // Обработчики действий
  const handleSearchChange = (value: string) => {
    setFiltersAction(setFilters, { search: value });
  };

  const handleCategoryChange = (value: string) => {
    setFiltersAction(setFilters, { category: value });
  };

  const handleStatusChange = (value: string) => {
    setFiltersAction(setFilters, { status: value });
  };

  const handleItemSelect = (id: string) => {
    selectItemAction(setSelectedItemId, id);
  };

  const handleItemUpdate = (item: DashboardItem) => {
    updateItemAction(setItems, item);
  };

  const handleBulkUpdate = () => {
    // Массовое обновление: увеличиваем значение на 10
    const getFilteredItems = () => filteredItems;
    bulkUpdateItemsAction(
      getFilteredItems,
      setItems,
      setLoadingState,
      setError,
      (item) => ({ ...item, value: item.value + 10 })
    );
  };

  const handleLoadData = () => {
    loadItemsAction(setItems, setLoadingState, setError, 1000);
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
            selectedItemId={selectedItemId}
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
