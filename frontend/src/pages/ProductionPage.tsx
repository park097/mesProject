import { isAxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getItems, type ItemResponse } from "../api/itemApi";
import {
  createProductionOrder,
  getProductionOrders,
  type ProductionOrderResponse,
  updateProductionOrder,
} from "../api/productionApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";
import { mapProductionToTableRow } from "../utils/tableMapper";

export default function ProductionPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [orders, setOrders] = useState<ProductionOrderResponse[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [orderNo, setOrderNo] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [plannedQty, setPlannedQty] = useState("1");
  const [dueDate, setDueDate] = useState("");

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [doneQty, setDoneQty] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const [itemList, orderList] = await Promise.all([getItems(), getProductionOrders()]);
    setItems(itemList);
    setOrders(orderList);
    setRows(orderList.map(mapProductionToTableRow));
    if (!selectedItemId && itemList.length > 0) {
      setSelectedItemId(String(itemList[0].id));
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await loadData();
      } catch {
        setErrorMessage("생산 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateOrder = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const itemId = Number(selectedItemId);
    const qty = Number(plannedQty);
    if (!orderNo.trim()) {
      setErrorMessage("작업지시번호를 입력해 주세요.");
      return;
    }
    if (!itemId) {
      setErrorMessage("품목을 선택해 주세요.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setErrorMessage("계획수량은 1 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductionOrder({
        orderNo: orderNo.trim(),
        itemId,
        plannedQty: qty,
        producedQty: 0,
        status: "CREATED",
        dueDate: dueDate || null,
      });
      await loadData();
      setSuccessMessage("작업지시가 등록되었습니다.");
      setOrderNo("");
      setPlannedQty("1");
      setDueDate("");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("작업지시 등록에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCompleteOrder = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    const id = Number(selectedOrderId);
    const qty = Number(doneQty);
    if (!id) {
      setErrorMessage("완료 처리할 작업지시를 선택해 주세요.");
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      setErrorMessage("실적수량은 0 이상이어야 합니다.");
      return;
    }
    const target = orders.find((order) => order.id === id);
    if (!target) {
      setErrorMessage("선택한 작업지시를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProductionOrder(id, {
        orderNo: target.orderNo,
        itemId: target.itemId,
        plannedQty: target.plannedQty,
        producedQty: qty,
        status: "DONE",
        dueDate: target.dueDate,
      });
      await loadData();
      setSuccessMessage("작업지시를 완료 처리했습니다.");
      setSelectedOrderId("");
      setDoneQty("1");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("완료 처리에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatableOrders = orders.filter((order) => order.status !== "DONE");

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Production Management
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            작업지시 등록
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label="작업지시번호"
              value={orderNo}
              onChange={(event) => setOrderNo(event.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              select
              label="품목"
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
              size="small"
              sx={{ minWidth: 220 }}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.itemCode} - {item.itemName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="계획수량"
              type="number"
              value={plannedQty}
              onChange={(event) => setPlannedQty(event.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <TextField
              label="납기일"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <Button variant="contained" disabled={isSubmitting} onClick={() => void onCreateOrder()}>
              등록
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            작업 완료 처리
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="작업지시"
              value={selectedOrderId}
              onChange={(event) => {
                const id = event.target.value;
                setSelectedOrderId(id);
                const target = updatableOrders.find((order) => String(order.id) === id);
                if (target) {
                  setDoneQty(String(target.plannedQty));
                }
              }}
              size="small"
              sx={{ minWidth: 260 }}
            >
              {updatableOrders.map((order) => (
                <MenuItem key={order.id} value={String(order.id)}>
                  {order.orderNo} - {order.itemCode} ({order.status})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="실적수량"
              type="number"
              value={doneQty}
              onChange={(event) => setDoneQty(event.target.value)}
              size="small"
              inputProps={{ min: 0 }}
              sx={{ width: 120 }}
            />
            <Box>
              <Button variant="outlined" color="success" disabled={isSubmitting} onClick={() => void onCompleteOrder()}>
                완료처리
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="생산 지시/이력" rows={rows} />}
    </Stack>
  );
}

