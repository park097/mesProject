import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getProductionOrders } from "../api/productionApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";
import { mapProductionToTableRow } from "../utils/tableMapper";

export default function ProductionPage() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const orders = await getProductionOrders();
        setRows(orders.map(mapProductionToTableRow));
      } catch {
        setErrorMessage("생산 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Production Management
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="생산 지시/이력" rows={rows} />}
    </Stack>
  );
}

