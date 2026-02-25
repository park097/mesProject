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

export const getItems = async (): Promise<ItemResponse[]> => {
  const { data } = await api.get<ItemResponse[]>("/items");
  return data;
};
