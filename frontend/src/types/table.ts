export type RowStatus = "Normal" | "Low" | "Out";

export type TableRow = {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  qty: number;
  status: RowStatus;
  updatedAt: string;
};

export type KpiItem = {
  title: string;
  value: string;
  delta: string;
};
