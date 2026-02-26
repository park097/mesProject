import { api } from "./api";

export interface CurrentStockResponse {
  itemId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  safetyStock: number;
  currentStock: number;
}

export interface StockTransactionResponse {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  type: "IN" | "OUT";
  quantity: number;
  memo: string;
  createdBy: string;
  createdAt: string;
}

export interface StockRequest {
  itemId: number;
  quantity: number;
  memo?: string;
}

export interface StockTodaySummaryResponse {
  inQty: number;
  outQty: number;
  inCount: number;
  outCount: number;
}

export const getCurrentStockByItem = async (itemId: number): Promise<CurrentStockResponse> => {
  const { data } = await api.get<CurrentStockResponse>(`/stocks/${itemId}/current`);
  return data;
};

export const getStockHistoryByItem = async (itemId: number): Promise<StockTransactionResponse[]> => {
  const { data } = await api.get<StockTransactionResponse[]>(`/stocks/${itemId}/history`);
  return data;
};

export const stockIn = async (payload: StockRequest): Promise<StockTransactionResponse> => {
  const { data } = await api.post<StockTransactionResponse>("/stocks/in", payload);
  return data;
};

export const stockOut = async (payload: StockRequest): Promise<StockTransactionResponse> => {
  const { data } = await api.post<StockTransactionResponse>("/stocks/out", payload);
  return data;
};

export const getStockTodaySummary = async (): Promise<StockTodaySummaryResponse> => {
  const { data } = await api.get<StockTodaySummaryResponse>("/stocks/summary/today");
  return data;
};
