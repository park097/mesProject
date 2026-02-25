import { api } from "./api";

export type ProductionStatus = "CREATED" | "IN_PROGRESS" | "DONE";

export interface ProductionOrderResponse {
  id: number;
  orderNo: string;
  itemId: number;
  itemCode: string;
  itemName: string;
  plannedQty: number;
  producedQty: number;
  status: ProductionStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getProductionOrders = async (): Promise<ProductionOrderResponse[]> => {
  const { data } = await api.get<ProductionOrderResponse[]>("/productions");
  return data;
};
