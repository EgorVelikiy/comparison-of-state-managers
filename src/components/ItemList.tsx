import { DashboardItem } from '../types';
import { ChangeEvent, KeyboardEvent } from 'react';

interface ItemListProps {
  items: readonly DashboardItem[];
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
  onItemUpdate: (item: DashboardItem) => void;
}

export const ItemList = ({
  items,
  selectedItemId,
  onItemSelect,
  onItemUpdate,
}: ItemListProps) => {

  const handleValueChange = (item: DashboardItem, newValue: number) => {
    onItemUpdate({
      ...item,
      value: newValue,
    });
  };

  return (
    <div className="item-list">
      <div className="item-list-header">
        <h2>Список элементов ({items.length})</h2>
      </div>
      <div className="item-list-content">
        {items.map((item) => (
          <div
            key={item.id}
            className={`item-card ${selectedItemId === item.id ? 'selected' : ''}`}
            onClick={() => onItemSelect(item.id)}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onItemSelect(item.id);
              }
            }}
            tabIndex={0}
          >
            <div className="item-card-header">
              <span className="item-name">{item.name}</span>
              <span className={`item-status status-${item.status}`}>
                {item.status}
              </span>
            </div>
            <div className="item-card-body">
              <div className="item-info">
                <span>Категория: {item.category}</span>
                <span>Value: </span>
                <input
                  type="number"
                  value={item.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleValueChange(item, Number.parseInt(e.target.value) || 0)
                  }
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                  className="item-value-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
