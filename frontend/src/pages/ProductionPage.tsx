import { Stack, Typography } from "@mui/material";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { productionRows } from "../data/mockData";

export default function ProductionPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Production Management
      </Typography>
      <InventoryDataGrid title="생산 지시/이력" rows={productionRows} />
    </Stack>
  );
}

