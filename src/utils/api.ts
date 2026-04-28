import axios from 'axios';
import { DashboardItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Интерфейсы для ответов API
interface ItemsResponse {
  success: boolean;
  items: DashboardItem[];
  count: number;
}

interface ItemResponse {
  success: boolean;
  item: DashboardItem;
}

interface BulkUpdateRequest {
  items: DashboardItem[];
}

interface BulkUpdateResponse {
  success: boolean;
  items: DashboardItem[];
  count: number;
}

/**
 * Загрузка списка элементов с сервера
 * @param count - количество элементов для генерации (опционально)
 * @returns Promise с массивом элементов
 */
export const fetchItems = async (count: number = 1000): Promise<DashboardItem[]> => {
  try {
    const response = await apiClient.get<ItemsResponse>('/items', {
      params: count ? { count } : undefined,
    });

    if (response.data.success && response.data.items) {
      return response.data.items;
    }

    throw new Error('Неверный формат ответа от сервера');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Ошибка загрузки данных с сервера'
      );
    }
    throw error;
  }
};

/**
 * Обновление одного элемента через API
 * @param item - элемент для обновления
 * @returns Promise с обновленным элементом
 */
export const updateItem = async (item: DashboardItem): Promise<DashboardItem> => {
  try {
    const response = await apiClient.put<ItemResponse>(`/items/${item.id}`, item);

    if (response.data.success && response.data.item) {
      return response.data.item;
    }

    throw new Error('Неверный формат ответа от сервера');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Элемент не найден');
      }
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Ошибка обновления элемента'
      );
    }
    throw error;
  }
};

/**
 * Массовое обновление элементов через API
 * @param items - массив элементов для обновления
 * @returns Promise с массивом обновленных элементов
 */
export const bulkUpdateItems = async (
  items: DashboardItem[]
): Promise<DashboardItem[]> => {
  try {
    const requestBody: BulkUpdateRequest = { items };
    const response = await apiClient.post<BulkUpdateResponse>('/items/bulk', requestBody);

    if (response.data.success && response.data.items) {
      return response.data.items;
    }

    throw new Error('Неверный формат ответа от сервера');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Ошибка массового обновления элементов'
      );
    }
    throw error;
  }
};

/**
 * Получение одного элемента по ID
 * @param id - ID элемента
 * @returns Promise с элементом
 */
export const fetchItemById = async (id: string): Promise<DashboardItem> => {
  try {
    const response = await apiClient.get<ItemResponse>(`/items/${id}`);

    if (response.data.success && response.data.item) {
      return response.data.item;
    }

    throw new Error('Неверный формат ответа от сервера');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Элемент не найден');
      }
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Ошибка загрузки элемента'
      );
    }
    throw error;
  }
};
