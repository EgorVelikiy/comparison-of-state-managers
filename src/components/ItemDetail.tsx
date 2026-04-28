import { DashboardItem } from "../types";

interface ItemDetailProps {
  item: DashboardItem | null;
}

export const ItemDetail = ({ item }: ItemDetailProps) => {

  if (!item) {
    return (
      <div className="item-detail">
        <p>Выберите элемент для просмотра деталей</p>
      </div>
    );
  }

  return (
    <div className="item-detail">
      <h2>Детали элемента</h2>
      <div className="detail-content">
        <div className="detail-row">
          <strong>ID:</strong>
          <span>{item.id}</span>
        </div>
        <div className="detail-row">
          <strong>Название:</strong>
          <span>{item.name}</span>
        </div>
        <div className="detail-row">
          <strong>Значение:</strong>
          <span>{item.value}</span>
        </div>
        <div className="detail-row">
          <strong>Категория:</strong>
          <span>{item.category}</span>
        </div>
        <div className="detail-row">
          <strong>Статус:</strong>
          <span className={`status-${item.status}`}>{item.status}</span>
        </div>
        <div className="detail-row">
          <strong>Timestamp:</strong>
          <span>{new Date(item.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
