export type KpiItem = {
  title: string;
  value: string;
  hint: string;
};

export type TableRow = {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  qty: number;
  status: "Normal" | "Low" | "Out";
  updatedAt: string;
};

export const dashboardKpis: KpiItem[] = [
  { title: "Vehicle Items", value: "2", hint: "finished goods master" },
  { title: "Part Items", value: "10", hint: "components + raw materials" },
  { title: "In-Progress Orders", value: "2", hint: "orders on shopfloor" },
  { title: "Low/Out Stock", value: "3", hint: "low stock risk items" },
];

export const itemRows: TableRow[] = [
  { id: 1, itemCode: "ENG-20T", itemName: "Engine 2.0 Turbo", category: "EA", qty: 90, status: "Normal", updatedAt: "2026-02-27 08:20" },
  { id: 2, itemCode: "TRN-8AT", itemName: "Transmission 8AT", category: "EA", qty: 66, status: "Low", updatedAt: "2026-02-27 08:23" },
  { id: 3, itemCode: "PAINT-BLK", itemName: "Black Paint", category: "L", qty: 0, status: "Out", updatedAt: "2026-02-27 08:25" },
];
