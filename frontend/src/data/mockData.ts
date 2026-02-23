export type KpiItem = {
  title: string;
  value: string;
  delta: string;
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
  { title: "총 품목 수", value: "128", delta: "+8.2%" },
  { title: "총 재고 수량", value: "24,930", delta: "+3.1%" },
  { title: "오늘 입고", value: "1,420", delta: "+12.4%" },
  { title: "오늘 출고", value: "1,050", delta: "-2.3%" },
];

export const itemRows: TableRow[] = [
  { id: 1, itemCode: "RM-1001", itemName: "원자재 A", category: "원자재", qty: 1200, status: "Normal", updatedAt: "2026-02-23 09:10" },
  { id: 2, itemCode: "RM-1002", itemName: "원자재 B", category: "원자재", qty: 220, status: "Low", updatedAt: "2026-02-23 09:21" },
  { id: 3, itemCode: "SF-2001", itemName: "반제품 C", category: "반제품", qty: 0, status: "Out", updatedAt: "2026-02-23 09:30" },
  { id: 4, itemCode: "FG-3001", itemName: "완제품 D", category: "완제품", qty: 440, status: "Normal", updatedAt: "2026-02-23 10:05" },
  { id: 5, itemCode: "FG-3002", itemName: "완제품 E", category: "완제품", qty: 88, status: "Low", updatedAt: "2026-02-23 11:34" },
  { id: 6, itemCode: "FG-3003", itemName: "완제품 F", category: "완제품", qty: 510, status: "Normal", updatedAt: "2026-02-23 13:13" },
];

export const stockRows: TableRow[] = itemRows.map((row, idx) => ({
  ...row,
  id: idx + 101,
  qty: row.qty + 40,
}));

export const productionRows: TableRow[] = [
  { id: 201, itemCode: "PO-202602-01", itemName: "완제품 D", category: "작업지시", qty: 300, status: "Normal", updatedAt: "2026-02-23 08:40" },
  { id: 202, itemCode: "PO-202602-02", itemName: "완제품 E", category: "작업지시", qty: 120, status: "Low", updatedAt: "2026-02-23 10:12" },
  { id: 203, itemCode: "PO-202602-03", itemName: "완제품 F", category: "작업지시", qty: 500, status: "Normal", updatedAt: "2026-02-23 13:44" },
];
