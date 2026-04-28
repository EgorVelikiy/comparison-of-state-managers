import { ChangeEvent } from 'react';

interface FilterBarProps {
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const FilterBar = ({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: FilterBarProps) => {

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="search">Поиск:</label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Введите название..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Категория:</label>
        <select
          id="category"
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        >
          <option value="">Все категории</option>
          <option value="Category A">Category A</option>
          <option value="Category B">Category B</option>
          <option value="Category C">Category C</option>
          <option value="Category D">Category D</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status">Статус:</label>
        <select
          id="status"
          value={status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>
  );
};
