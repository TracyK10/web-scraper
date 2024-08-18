import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface HistoryItem {
  _id: string;
  title: string;
  url: string;
  category: string;
  createdAt: string;
}

export interface HistoryResponse {
  data: HistoryItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const fetchHistory = async (page: number = 1, limit: number = 10): Promise<HistoryResponse> => {
  const response = await axios.get(`${API_URL}/api/history`, {
    params: { page, limit },
  });
  return response.data;
};

export const fetchHistoryItem = async (id: string): Promise<HistoryItem> => {
  const response = await axios.get(`${API_URL}/api/history/${id}`);
  return response.data;
};
