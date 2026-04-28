interface ActionBarProps {
  onBulkUpdate: () => void;
  onLoadData: () => void;
  loadingState: 'idle' | 'loading' | 'success' | 'error';
}

export const ActionBar = ({
  onBulkUpdate,
  onLoadData,
  loadingState,
}: ActionBarProps) => {

  const isLoading = loadingState === 'loading';

  return (
    <div className="action-bar">
      <button
        onClick={onBulkUpdate}
        disabled={isLoading}
        className="action-button"
      >
        Массовое обновление всех элементов
      </button>
      <button
        onClick={onLoadData}
        disabled={isLoading}
        className="action-button"
      >
        {isLoading ? 'Загрузка...' : 'Загрузить данные с сервера'}
      </button>
    </div>
  );
};
