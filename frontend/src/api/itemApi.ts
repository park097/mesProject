import { api } from "./api";

export interface ItemResponse {
  id: number;
  itemCode: string;
  itemName: string;
  unit: string;
  safetyStock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ItemRequest {
  itemCode: string;
  itemName: string;
  unit: string;
  safetyStock: number;
  active?: boolean;
}

export const getItems = async (): Promise<ItemResponse[]> => {
  const { data } = await api.get<ItemResponse[]>("/items");
  return data;
};

export const createItem = async (payload: ItemRequest): Promise<ItemResponse> => {
  const { data } = await api.post<ItemResponse>("/items", payload);
  return data;
};

export const updateItem = async (id: number, payload: ItemRequest): Promise<ItemResponse> => {
  const { data } = await api.put<ItemResponse>(`/items/${id}`, payload);
  return data;
};

export const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};
