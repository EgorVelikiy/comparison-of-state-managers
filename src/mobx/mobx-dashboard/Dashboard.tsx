import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { itemsStore } from '../state/ItemsStore';
import { FilterBar } from '../../components/FilterBar';
import { ItemList } from '../../components/ItemList';
import { ItemDetail } from '../../components/ItemDetail';
import { StatsPanel } from '../../components/StatsPanel';
import { ActionBar } from '../../components/ActionBar';
import { DashboardItem } from '../../types';

// Observer HOC для реактивности MobX
export const MobXDashboard = observer(() => {

  // Загрузка начальных данных при монтировании компонента
  useEffect(() => {
    if (itemsStore.items.length === 0) {
      itemsStore.loadItems(1000);
    }
  }, []);

  // Обработчики действий
  const handleSearchChange = (value: string) => {
    itemsStore.setFilters({ search: value });
  };

  const handleCategoryChange = (value: string) => {
    itemsStore.setFilters({ category: value });
  };

  const handleStatusChange = (value: string) => {
    itemsStore.setFilters({ status: value });
  };

  const handleItemSelect = (id: string) => {
    itemsStore.selectItem(id);
  };

  const handleItemUpdate = (item: DashboardItem) => {
    itemsStore.updateItem(item);
  };

  const handleBulkUpdate = () => {
    // Массовое обновление: увеличиваем значение на 10
    const updatedItems = itemsStore.filteredItems.map(item => ({
      ...item,
      value: item.value + 10,
    }));
    itemsStore.bulkUpdateItemsAction(updatedItems);
  };

  const handleLoadData = () => {
    itemsStore.loadItems(1000);
  };

  return (
    <div className="dashboard-container">
      <FilterBar
        search={itemsStore.filters.search}
        category={itemsStore.filters.category}
        status={itemsStore.filters.status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
      />

      <ActionBar
        onBulkUpdate={handleBulkUpdate}
        onLoadData={handleLoadData}
        loadingState={itemsStore.loadingState}
      />

      <div className="dashboard-layout">
        <div>
          <ItemList
            items={itemsStore.filteredItems}
            selectedItemId={itemsStore.selectedItemId}
            onItemSelect={handleItemSelect}
            onItemUpdate={handleItemUpdate}
          />
          <ItemDetail item={itemsStore.selectedItem} />
        </div>

        <StatsPanel
          stats={itemsStore.derivedState}
          loadingState={itemsStore.loadingState}
        />
      </div>
    </div>
  );
});
