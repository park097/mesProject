import { isAxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { type ItemResponse, getItems } from "../api/itemApi";
import {
  getCurrentStockByItem,
  getStockHistoryByItem,
  stockIn,
  stockOut,
  type StockTransactionResponse,
} from "../api/stockApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";
import { formatDateTime } from "../utils/date";
import { toStockStatus } from "../utils/tableMapper";

const columns: GridColDef<TableRow>[] = [
  { field: "itemCode", headerName: "Part Code", minWidth: 120, flex: 1 },
  { field: "itemName", headerName: "Part Name", minWidth: 170, flex: 1.3 },
  { field: "category", headerName: "Unit", minWidth: 80, flex: 0.6 },
  { field: "qty", headerName: "Current", type: "number", minWidth: 90, flex: 0.8 },
  { field: "safetyStock", headerName: "Safety", type: "number", minWidth: 90, flex: 0.8 },
  { field: "gap", headerName: "Gap", type: "number", minWidth: 90, flex: 0.7 },
  { field: "status", headerName: "Risk", minWidth: 110, flex: 0.8 },
];

const defaultMemo = "LOT:LOT-2026A-001 / PROC:AS01 / SHIFT:A";

export default function StockPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [memo, setMemo] = useState(defaultMemo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<StockTransactionResponse[]>([]);

  const loadHistory = async (itemId: number) => {
    const historyRows = await getStockHistoryByItem(itemId);
    setHistory(historyRows);
  };

  const loadStocks = async () => {
    const itemList = await getItems();
    const currentStocks = await Promise.all(itemList.map((item) => getCurrentStockByItem(item.id)));
    const stockRows = currentStocks
      .map((stock) => ({
        id: stock.itemId,
        itemCode: stock.itemCode,
        itemName: stock.itemName,
        category: stock.unit,
        qty: stock.currentStock,
        safetyStock: stock.safetyStock,
        gap: stock.currentStock - stock.safetyStock,
        status: toStockStatus(stock.currentStock, stock.safetyStock),
        updatedAt: "-",
      }))
      .sort((a, b) => a.gap - b.gap);

    setItems(itemList);
    setRows(stockRows);
    if (itemList.length === 0) {
      setSelectedItemId("");
      setHistory([]);
      return;
    }

    const hasSelected = itemList.some((item) => String(item.id) === selectedItemId);
    const nextSelectedId = hasSelected ? selectedItemId : String(itemList[0].id);
    setSelectedItemId(nextSelectedId);
    if (nextSelectedId) {
      await loadHistory(Number(nextSelectedId));
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadStocks();
      } catch {
        setErrorMessage("Failed to load stock data.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitTransaction = async (type: "IN" | "OUT") => {
    setErrorMessage("");
    setSuccessMessage("");

    const itemId = Number(selectedItemId);
    const parsedQuantity = Number(quantity);

    if (!itemId) {
      setErrorMessage("Select item.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage("Quantity must be 1 or more.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { itemId, quantity: parsedQuantity, memo: memo.trim() || undefined };
      if (type === "IN") {
        await stockIn(payload);
      } else {
        await stockOut(payload);
      }
      await loadStocks();
      await loadHistory(itemId);
      setSuccessMessage(type === "IN" ? "Stock-in created." : "Stock-out created.");
      setMemo(defaultMemo);
      setQuantity("1");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage(type === "IN" ? "Failed to create stock-in." : "Failed to create stock-out.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const lotEntries = useMemo(() => {
    return history
      .filter((row) => row.memo && row.memo.includes("LOT:"))
      .slice(0, 8);
  }, [history]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Inventory + LOT Tracking
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Register Inventory Transaction
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="Item"
              value={selectedItemId}
              onChange={(event) => {
                const id = event.target.value;
                setSelectedItemId(id);
                if (id) {
                  void loadHistory(Number(id));
                }
              }}
              sx={{ minWidth: 260 }}
              size="small"
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.itemCode} - {item.itemName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Qty"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <TextField label="Memo (LOT/PROC/SHIFT)" value={memo} onChange={(event) => setMemo(event.target.value)} size="small" fullWidth />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSubmitting} onClick={() => void submitTransaction("IN")}>
                Stock-In
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={isSubmitting}
                onClick={() => void submitTransaction("OUT")}
              >
                Stock-Out
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="Current Stock Risk Board" rows={rows} columns={columns} pageSize={10} />}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Recent Transactions
          </Typography>
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No transaction history for selected item.
            </Typography>
          ) : (
            <Stack divider={<Divider flexItem />}>
              {history.map((row) => (
                <Box key={row.id} sx={{ py: 1.2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.type === "IN" ? "IN" : "OUT"} {row.quantity} {row.itemName} ({row.itemCode})
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(row.createdAt)} / {row.createdBy} / {row.memo || "-"}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            LOT Tagged History
          </Typography>
          {lotEntries.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No LOT-tagged records. Use memo pattern like `LOT:... / PROC:... / SHIFT:...`.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {lotEntries.map((entry) => (
                <Typography key={entry.id} variant="body2" color="text.secondary">
                  [{entry.type}] {entry.itemCode} {entry.quantity} - {entry.memo}
                </Typography>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
