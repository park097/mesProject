import { Stack, Typography } from "@mui/material";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { itemRows } from "../data/mockData";

export default function ItemPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Item Management
      </Typography>
      <InventoryDataGrid title="품목 리스트" rows={itemRows} />
    </Stack>
  );
}

