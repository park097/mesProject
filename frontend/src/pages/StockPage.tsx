import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getItems } from "../api/itemApi";
import { getCurrentStockByItem } from "../api/stockApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";
import { mapCurrentStockToTableRow } from "../utils/tableMapper";

export default function StockPage() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const items = await getItems();
        const currentStocks = await Promise.all(items.map((item) => getCurrentStockByItem(item.id)));
        setRows(currentStocks.map(mapCurrentStockToTableRow));
      } catch {
        setErrorMessage("재고 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Stock Management
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="재고 현황" rows={rows} />}
    </Stack>
  );
}

