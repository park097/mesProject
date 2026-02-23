import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Card, CardContent, Stack, Typography } from "@mui/material";

type KpiCardProps = {
  title: string;
  value: string;
  delta: string;
};

export default function KpiCard({ title, value, delta }: KpiCardProps) {
  const isPositive = !delta.startsWith("-");
  return (
    <Card elevation={0} sx={{ border: "1px solid #e6e8ef" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
          {value}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
          {isPositive ? (
            <TrendingUpIcon fontSize="small" color="success" />
          ) : (
            <TrendingDownIcon fontSize="small" color="error" />
          )}
          <Typography variant="caption" color={isPositive ? "success.main" : "error.main"}>
            {delta} since last week
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

