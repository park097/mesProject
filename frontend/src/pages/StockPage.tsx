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
import { useEffect, useState } from "react";
import { type ItemResponse, getItems } from "../api/itemApi";
import { getCurrentStockByItem, getStockHistoryByItem, stockIn, stockOut, type StockTransactionResponse } from "../api/stockApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";
import { mapCurrentStockToTableRow } from "../utils/tableMapper";
import { formatDateTime } from "../utils/date";

export default function StockPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [memo, setMemo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<StockTransactionResponse[]>([]);

  const loadHistory = async (itemId: number) => {
    const rows = await getStockHistoryByItem(itemId);
    setHistory(rows);
  };

  const loadStocks = async () => {
    const itemList = await getItems();
    const currentStocks = await Promise.all(itemList.map((item) => getCurrentStockByItem(item.id)));
    setItems(itemList);
    setRows(currentStocks.map(mapCurrentStockToTableRow));
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
        setErrorMessage("재고 데이터를 불러오지 못했습니다.");
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
      setErrorMessage("품목을 선택해 주세요.");
      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage("수량은 1 이상 숫자로 입력해 주세요.");
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
      setSuccessMessage(type === "IN" ? "입고가 등록되었습니다." : "출고가 등록되었습니다.");
      setMemo("");
      setQuantity("1");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage(type === "IN" ? "입고 등록에 실패했습니다." : "출고 등록에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Stock Management
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            입출고 등록
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="품목"
              value={selectedItemId}
              onChange={(event) => {
                const id = event.target.value;
                setSelectedItemId(id);
                if (id) {
                  void loadHistory(Number(id));
                }
              }}
              sx={{ minWidth: 220 }}
              size="small"
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.itemCode} - {item.itemName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="수량"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <TextField
              label="메모"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              size="small"
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" disabled={isSubmitting} onClick={() => void submitTransaction("IN")}>
                입고
              </Button>
              <Button
                variant="outlined"
                color="warning"
                disabled={isSubmitting}
                onClick={() => void submitTransaction("OUT")}
              >
                출고
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="재고 현황" rows={rows} />}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            최근 입출고 이력
          </Typography>
          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              선택한 품목의 입출고 이력이 없습니다.
            </Typography>
          ) : (
            <Stack divider={<Divider flexItem />}>
              {history.map((row) => (
                <Box key={row.id} sx={{ py: 1.2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.type === "IN" ? "입고" : "출고"} {row.quantity} {row.itemName} ({row.itemCode})
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
    </Stack>
  );
}

