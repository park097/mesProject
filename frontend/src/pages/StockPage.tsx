import { Stack, Typography } from "@mui/material";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { stockRows } from "../data/mockData";

export default function StockPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Stock Management
      </Typography>
      <InventoryDataGrid title="재고 현황" rows={stockRows} />
    </Stack>
  );
}

