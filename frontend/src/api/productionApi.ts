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

export interface ProductionOrderRequest {
  orderNo: string;
  itemId: number;
  plannedQty: number;
  producedQty?: number;
  status?: ProductionStatus;
  dueDate?: string | null;
}

export const getProductionOrders = async (): Promise<ProductionOrderResponse[]> => {
  const { data } = await api.get<ProductionOrderResponse[]>("/productions");
  return data;
};

export const createProductionOrder = async (
  payload: ProductionOrderRequest
): Promise<ProductionOrderResponse> => {
  const { data } = await api.post<ProductionOrderResponse>("/productions", payload);
  return data;
};

export const updateProductionOrder = async (
  id: number,
  payload: ProductionOrderRequest
): Promise<ProductionOrderResponse> => {
  const { data } = await api.put<ProductionOrderResponse>(`/productions/${id}`, payload);
  return data;
};
