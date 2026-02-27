import { Alert, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { getItems } from "../api/itemApi";
import { type ProductionOrderResponse, getProductionOrders } from "../api/productionApi";
import { getCurrentStockByItem, getStockTodaySummary } from "../api/stockApi";
import KpiCard from "../components/cards/KpiCard";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { KpiItem, TableRow } from "../types/table";
import { toStockStatus } from "../utils/tableMapper";

const formatDday = (dueDate: string | null): string => {
  if (!dueDate) {
    return "-";
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) {
    return `D+${Math.abs(diff)} delayed`;
  }
  if (diff === 0) {
    return "D-Day";
  }
  return `D-${diff}`;
};

const stockColumns: GridColDef<TableRow>[] = [
  { field: "itemCode", headerName: "Part Code", minWidth: 130, flex: 1 },
  { field: "itemName", headerName: "Part Name", minWidth: 180, flex: 1.4 },
  { field: "category", headerName: "Unit", minWidth: 80, flex: 0.7 },
  { field: "qty", headerName: "Current", type: "number", minWidth: 90, flex: 0.8 },
  { field: "safetyStock", headerName: "Safety", type: "number", minWidth: 90, flex: 0.8 },
  { field: "gap", headerName: "Gap", type: "number", minWidth: 90, flex: 0.7 },
  { field: "status", headerName: "Stock Risk", minWidth: 120, flex: 0.9 },
];

const dueOrderColumns: GridColDef<TableRow>[] = [
  { field: "itemCode", headerName: "Order No", minWidth: 130, flex: 1 },
  { field: "itemName", headerName: "Model / Part", minWidth: 180, flex: 1.4 },
  { field: "line", headerName: "Line", minWidth: 110, flex: 0.9 },
  { field: "qty", headerName: "Plan Qty", type: "number", minWidth: 90, flex: 0.7 },
  { field: "producedQty", headerName: "Done Qty", type: "number", minWidth: 90, flex: 0.7 },
  { field: "progress", headerName: "Progress", minWidth: 100, flex: 0.8 },
  { field: "dueDate", headerName: "Due Date", minWidth: 110, flex: 0.9 },
  { field: "dDay", headerName: "D-Day", minWidth: 110, flex: 0.9 },
  { field: "processStatus", headerName: "Status", minWidth: 110, flex: 0.9 },
];

export default function Dashboard() {
  const [stockRows, setStockRows] = useState<TableRow[]>([]);
  const [dueRows, setDueRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [kpis, setKpis] = useState<KpiItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [items, orders, todaySummary] = await Promise.all([
          getItems(),
          getProductionOrders(),
          getStockTodaySummary().catch(() => ({ inQty: 0, outQty: 0, inCount: 0, outCount: 0 })),
        ]);
        const currentStocks = await Promise.all(items.map((item) => getCurrentStockByItem(item.id)));

        const stockData = currentStocks
          .map((stock) => {
            const gap = stock.currentStock - stock.safetyStock;
            return {
              id: stock.itemId,
              itemCode: stock.itemCode,
              itemName: stock.itemName,
              category: stock.unit,
              qty: stock.currentStock,
              safetyStock: stock.safetyStock,
              gap,
              status: toStockStatus(stock.currentStock, stock.safetyStock),
              updatedAt: "-",
            };
          })
          .sort((a, b) => a.gap - b.gap)
          .slice(0, 10);

        const dueData = [...orders]
          .filter((order) => order.status !== "DONE")
          .sort((a, b) => (a.dueDate ?? "9999-12-31").localeCompare(b.dueDate ?? "9999-12-31"))
          .slice(0, 8)
          .map((order) => toOrderRow(order));

        const vehicleCount = items.filter((item) => item.itemCode.startsWith("CAR-")).length;
        const componentCount = items.length - vehicleCount;
        const inProgressCount = orders.filter((order) => order.status === "IN_PROGRESS").length;
        const delayedCount = orders.filter((order) => isDelayedOrder(order)).length;
        const stockRiskCount = currentStocks.filter((stock) => stock.currentStock <= stock.safetyStock).length;

        setStockRows(stockData);
        setDueRows(dueData);
        setKpis([
          { title: "Vehicle Items", value: vehicleCount.toString(), hint: "finished goods master" },
          { title: "Part Items", value: componentCount.toString(), hint: "components + raw materials" },
          { title: "In-Progress Orders", value: inProgressCount.toString(), hint: "orders on shopfloor" },
          { title: "Delayed Orders", value: delayedCount.toString(), hint: "delayed delivery risk" },
          { title: "Low/Out Stock", value: stockRiskCount.toString(), hint: "low stock risk items" },
          {
            title: "Today In/Out",
            value: `${todaySummary.inQty.toLocaleString()} / ${todaySummary.outQty.toLocaleString()}`,
            hint: `${todaySummary.inCount} IN tx / ${todaySummary.outCount} OUT tx`,
          },
        ]);
      } catch {
        setErrorMessage("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const summaryText = useMemo(() => {
    const delayed = dueRows.filter((row) => String(row.dDay).includes("delayed")).length;
    const dDay = dueRows.filter((row) => row.dDay === "D-Day").length;
    return `Due soon: ${dueRows.length} / D-Day: ${dDay} / Delayed: ${delayed}`;
  }, [dueRows]);

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Automotive MES Dashboard
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Grid container spacing={2}>
        {kpis.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, md: 6, xl: 4 }}>
            <KpiCard title={kpi.title} value={kpi.value} hint={kpi.hint} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <InventoryDataGrid title="Critical Parts Stock (Top 10)" rows={stockRows} columns={stockColumns} pageSize={10} />
          )}
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <InventoryDataGrid title="Open Orders By Due Date" rows={dueRows} columns={dueOrderColumns} pageSize={8} />
          )}
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ border: "1px solid #e6e8ef", p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Shopfloor Signal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {summaryText}
        </Typography>
      </Paper>
    </Stack>
  );
}

const isDelayedOrder = (order: ProductionOrderResponse): boolean => {
  if (order.status === "DONE" || !order.dueDate) {
    return false;
  }
  const today = new Date().toISOString().slice(0, 10);
  return order.dueDate < today;
};

const toOrderRow = (order: ProductionOrderResponse): TableRow => {
  const progress = order.plannedQty > 0 ? `${Math.round((order.producedQty / order.plannedQty) * 100)}%` : "-";
  const line = order.itemCode.startsWith("CAR-") ? "Final Assy" : "Part Line";
  return {
    id: order.id,
    itemCode: order.orderNo,
    itemName: `${order.itemCode} / ${order.itemName}`,
    category: order.status,
    qty: order.plannedQty,
    producedQty: order.producedQty,
    progress,
    dueDate: order.dueDate ?? "-",
    dDay: formatDday(order.dueDate),
    line,
    processStatus: order.status,
    status: order.status === "DONE" ? "Normal" : order.status === "IN_PROGRESS" ? "Low" : "Out",
    updatedAt: order.updatedAt,
  };
};
