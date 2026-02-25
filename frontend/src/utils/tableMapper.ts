import type { ItemResponse } from "../api/itemApi";
import type { CurrentStockResponse } from "../api/stockApi";
import type { ProductionOrderResponse } from "../api/productionApi";
import type { RowStatus, TableRow } from "../types/table";
import { formatDateTime } from "./date";

export const toStockStatus = (qty: number, safetyStock: number): RowStatus => {
  if (qty <= 0) {
    return "Out";
  }
  if (qty <= safetyStock) {
    return "Low";
  }
  return "Normal";
};

export const mapItemToTableRow = (item: ItemResponse): TableRow => ({
  id: item.id,
  itemCode: item.itemCode,
  itemName: item.itemName,
  category: item.unit,
  qty: item.safetyStock,
  status: "Normal",
  updatedAt: formatDateTime(item.updatedAt),
});

export const mapCurrentStockToTableRow = (stock: CurrentStockResponse): TableRow => ({
  id: stock.itemId,
  itemCode: stock.itemCode,
  itemName: stock.itemName,
  category: stock.unit,
  qty: stock.currentStock,
  status: toStockStatus(stock.currentStock, stock.safetyStock),
  updatedAt: "-",
});

export const mapProductionToTableRow = (order: ProductionOrderResponse): TableRow => ({
  id: order.id,
  itemCode: order.orderNo,
  itemName: order.itemName,
  category: order.status,
  qty: order.plannedQty,
  status: order.status === "DONE" ? "Normal" : order.status === "IN_PROGRESS" ? "Low" : "Out",
  updatedAt: formatDateTime(order.updatedAt),
});
