import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { getItems } from "../api/itemApi";
import type { TableRow } from "../types/table";
import { mapItemToTableRow } from "../utils/tableMapper";

export default function ItemPage() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const items = await getItems();
        setRows(items.map(mapItemToTableRow));
      } catch {
        setErrorMessage("품목 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Item Management
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="품목 리스트" rows={rows} />}
    </Stack>
  );
}

