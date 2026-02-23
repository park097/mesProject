import { Grid, Paper, Stack, Typography } from "@mui/material";
import KpiCard from "../components/cards/KpiCard";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { dashboardKpis, itemRows } from "../data/mockData";

export default function Dashboard() {
  return (
    <Stack spacing={2.5}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        {dashboardKpis.map((kpi) => (
          <Grid key={kpi.title} size={{ xs: 12, md: 6, xl: 3 }}>
            <KpiCard title={kpi.title} value={kpi.value} delta={kpi.delta} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <InventoryDataGrid title="최근 품목 현황" rows={itemRows} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ border: "1px solid #e6e8ef", p: 2, minHeight: 420 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              작업 요약
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                오늘 생산 완료: 6건
              </Typography>
              <Typography variant="body2" color="text.secondary">
                지연 작업지시: 2건
              </Typography>
              <Typography variant="body2" color="text.secondary">
                안전재고 미만 품목: 4건
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
