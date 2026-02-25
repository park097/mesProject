import { Alert, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getItems } from "../api/itemApi";
import { getProductionOrders } from "../api/productionApi";
import { getCurrentStockByItem } from "../api/stockApi";
import KpiCard from "../components/cards/KpiCard";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { KpiItem, TableRow } from "../types/table";
import { mapItemToTableRow, toStockStatus } from "../utils/tableMapper";

export default function Dashboard() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [stockOutCount, setStockOutCount] = useState(0);
  const [stockLowCount, setStockLowCount] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const [delayCount, setDelayCount] = useState(0);
  const [totalStockQty, setTotalStockQty] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [items, orders] = await Promise.all([getItems(), getProductionOrders()]);
        const recentItems = [...items]
          .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
          .slice(0, 8)
          .map(mapItemToTableRow);

        const currentStocks = await Promise.all(items.map((item) => getCurrentStockByItem(item.id)));

        const lowCount = currentStocks.filter(
          (stock) => toStockStatus(stock.currentStock, stock.safetyStock) === "Low"
        ).length;
        const outCount = currentStocks.filter(
          (stock) => toStockStatus(stock.currentStock, stock.safetyStock) === "Out"
        ).length;
        const totalQty = currentStocks.reduce((sum, stock) => sum + stock.currentStock, 0);

        const today = new Date().toISOString().slice(0, 10);
        const delayed = orders.filter((order) => order.status !== "DONE" && !!order.dueDate && order.dueDate < today);
        const done = orders.filter((order) => order.status === "DONE");

        setRows(recentItems);
        setTotalItemCount(items.length);
        setStockLowCount(lowCount);
        setStockOutCount(outCount);
        setTotalStockQty(totalQty);
        setDoneCount(done.length);
        setDelayCount(delayed.length);
      } catch {
        setErrorMessage("대시보드 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const dashboardKpis: KpiItem[] = useMemo(
    () => [
      { title: "총 품목 수", value: totalItemCount.toString(), delta: "+0.0%" },
      { title: "총 재고 수량", value: totalStockQty.toLocaleString(), delta: "+0.0%" },
      { title: "안전재고 미만", value: stockLowCount.toString(), delta: "+0.0%" },
      { title: "재고 소진 품목", value: stockOutCount.toString(), delta: "+0.0%" },
    ],
    [stockLowCount, stockOutCount, totalItemCount, totalStockQty]
  );

  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Grid container spacing={2}>
        {dashboardKpis.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, md: 6, xl: 3 }}>
            <KpiCard title={kpi.title} value={kpi.value} delta={kpi.delta} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {isLoading ? <CircularProgress /> : <InventoryDataGrid title="최근 품목 현황" rows={rows} />}
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ border: "1px solid #e6e8ef", p: 2, minHeight: 420 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              작업 요약
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                생산 완료: {doneCount}건
              </Typography>
              <Typography variant="body2" color="text.secondary">
                지연 작업지시: {delayCount}건
              </Typography>
              <Typography variant="body2" color="text.secondary">
                안전재고 미만 품목: {stockLowCount}건
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
