import { Chip, Paper, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TableRow } from "../../types/table";

type InventoryDataGridProps = {
  title: string;
  rows: TableRow[];
  columns?: GridColDef<TableRow>[];
  pageSize?: number;
};

const columns: GridColDef<TableRow>[] = [
  { field: "itemCode", headerName: "Code", flex: 1, minWidth: 120 },
  { field: "itemName", headerName: "Name", flex: 1.4, minWidth: 160 },
  { field: "category", headerName: "Category", flex: 1, minWidth: 120 },
  { field: "qty", headerName: "Qty", type: "number", flex: 0.8, minWidth: 90 },
  {
    field: "status",
    headerName: "Status",
    flex: 0.9,
    minWidth: 120,
    renderCell: (params) => {
      const value = params.row.status;
      const color = value === "Normal" ? "success" : value === "Low" ? "warning" : "error";
      return <Chip size="small" label={value} color={color} variant="outlined" />;
    },
  },
  { field: "updatedAt", headerName: "Updated At", flex: 1.2, minWidth: 160 },
];

export default function InventoryDataGrid({
  title,
  rows,
  columns: customColumns,
  pageSize = 5,
}: InventoryDataGridProps) {
  return (
    <Paper elevation={0} sx={{ border: "1px solid #e6e8ef", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <DataGrid
        rows={rows}
        columns={customColumns ?? columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: {
            paginationModel: { pageSize, page: 0 },
          },
        }}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f8f9fc" },
        }}
      />
    </Paper>
  );
}

