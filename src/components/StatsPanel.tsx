import { DerivedState } from "../types";

interface StatsPanelProps {
  stats: DerivedState;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
}

export const StatsPanel = ({ stats, loadingState }: StatsPanelProps) => {

  return (
    <div className="stats-panel">
      <h2>Статистика (Derived State)</h2>
      <div className="stats-content">
        <div className="stat-item">
          <span className="stat-label">Всего элементов:</span>
          <span className="stat-value">{stats.totalCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Отфильтровано:</span>
          <span className="stat-value">{stats.filteredCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Среднее значение:</span>
          <span className="stat-value">{stats.averageValue.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.activeCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value">{stats.inactiveCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Статус загрузки:</span>
          <span className={`stat-value status-${loadingState}`}>
            {loadingState}
          </span>
        </div>
      </div>
    </div>
  );
};
