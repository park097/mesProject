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
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { getItems, type ItemResponse } from "../api/itemApi";
import {
  createProductionOrder,
  getProductionOrders,
  type ProductionOrderResponse,
  updateProductionOrder,
} from "../api/productionApi";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import type { TableRow } from "../types/table";

const processRouteMap: Record<string, string> = {
  "CAR-SEDAN-A": "OP10 Body > OP20 Paint > OP30 Final Assembly > OP40 EOL Test",
  "CAR-SUV-B": "OP10 Body > OP20 Paint > OP30 Trim > OP40 Final Inspection",
  "ENG-20T": "OP10 Machining > OP20 Heat-Treat > OP30 Assembly > OP40 Bench Test",
  "TRN-8AT": "OP10 Case Machining > OP20 Gear Assembly > OP30 Leak Test",
  "TIRE-18": "OP10 Molding > OP20 Curing > OP30 Balance Inspection",
};

const columns: GridColDef<TableRow>[] = [
  { field: "itemCode", headerName: "Order No", minWidth: 120, flex: 1 },
  { field: "itemName", headerName: "Model / Part", minWidth: 170, flex: 1.3 },
  { field: "line", headerName: "Line", minWidth: 110, flex: 0.8 },
  { field: "route", headerName: "Routing", minWidth: 280, flex: 2.1 },
  { field: "qty", headerName: "Plan", type: "number", minWidth: 70, flex: 0.6 },
  { field: "producedQty", headerName: "Done", type: "number", minWidth: 70, flex: 0.6 },
  { field: "progress", headerName: "Progress", minWidth: 95, flex: 0.7 },
  { field: "dueDate", headerName: "Due Date", minWidth: 110, flex: 0.8 },
  { field: "dDay", headerName: "D-Day", minWidth: 95, flex: 0.8 },
  { field: "processStatus", headerName: "Status", minWidth: 110, flex: 0.8 },
];

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
  const [selectedStatus, setSelectedStatus] = useState<"CREATED" | "IN_PROGRESS">("CREATED");

  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [doneQty, setDoneQty] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    const [itemList, orderList] = await Promise.all([getItems(), getProductionOrders()]);
    setItems(itemList);
    setOrders(orderList);
    setRows(orderList.map(toProductionRow));
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
        setErrorMessage("Failed to load production data.");
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
      setErrorMessage("Enter order number.");
      return;
    }
    if (!itemId) {
      setErrorMessage("Select item.");
      return;
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      setErrorMessage("Planned qty must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProductionOrder({
        orderNo: orderNo.trim(),
        itemId,
        plannedQty: qty,
        producedQty: 0,
        status: selectedStatus,
        dueDate: dueDate || null,
      });
      await loadData();
      setSuccessMessage("Production order created.");
      setOrderNo("");
      setPlannedQty("1");
      setDueDate("");
      setSelectedStatus("CREATED");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("Failed to create production order.");
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
      setErrorMessage("Select order to complete.");
      return;
    }
    if (!Number.isFinite(qty) || qty < 0) {
      setErrorMessage("Done qty must be 0 or higher.");
      return;
    }
    const target = orders.find((order) => order.id === id);
    if (!target) {
      setErrorMessage("Selected order not found.");
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
      setSuccessMessage("Order completed.");
      setSelectedOrderId("");
      setDoneQty("1");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("Failed to complete order.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatableOrders = useMemo(() => orders.filter((order) => order.status !== "DONE"), [orders]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Production Control (Automotive Process)
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Create Production Order
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label="Order No"
              value={orderNo}
              onChange={(event) => setOrderNo(event.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              select
              label="Item"
              value={selectedItemId}
              onChange={(event) => setSelectedItemId(event.target.value)}
              size="small"
              sx={{ minWidth: 260 }}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.itemCode} - {item.itemName}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Planned Qty"
              type="number"
              value={plannedQty}
              onChange={(event) => setPlannedQty(event.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <TextField
              select
              label="Start Status"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as "CREATED" | "IN_PROGRESS")}
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="CREATED">CREATED</MenuItem>
              <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            </TextField>
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <Button variant="contained" disabled={isSubmitting} onClick={() => void onCreateOrder()}>
              Create
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Complete Order
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="Order"
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
              sx={{ minWidth: 300 }}
            >
              {updatableOrders.map((order) => (
                <MenuItem key={order.id} value={String(order.id)}>
                  {order.orderNo} - {order.itemCode} ({order.status})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Done Qty"
              type="number"
              value={doneQty}
              onChange={(event) => setDoneQty(event.target.value)}
              size="small"
              inputProps={{ min: 0 }}
              sx={{ width: 120 }}
            />
            <Box>
              <Button variant="outlined" color="success" disabled={isSubmitting} onClick={() => void onCompleteOrder()}>
                Complete
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {isLoading ? (
        <CircularProgress />
      ) : (
        <InventoryDataGrid title="Production Orders With Routing View" rows={rows} columns={columns} pageSize={10} />
      )}
    </Stack>
  );
}

const toProductionRow = (order: ProductionOrderResponse): TableRow => {
  const progress = order.plannedQty > 0 ? `${Math.round((order.producedQty / order.plannedQty) * 100)}%` : "-";
  const route = processRouteMap[order.itemCode] ?? "OP10 Cutting > OP20 Forming > OP30 Inspection";
  const line = order.itemCode.startsWith("CAR-") ? "Final Assy Line" : "Component Line";

  return {
    id: order.id,
    itemCode: order.orderNo,
    itemName: `${order.itemCode} / ${order.itemName}`,
    category: order.status,
    qty: order.plannedQty,
    producedQty: order.producedQty,
    progress,
    processStatus: order.status,
    dueDate: order.dueDate ?? "-",
    dDay: formatDday(order.dueDate),
    line,
    route,
    status: order.status === "DONE" ? "Normal" : order.status === "IN_PROGRESS" ? "Low" : "Out",
    updatedAt: order.updatedAt,
  };
};

const formatDday = (dueDate: string | null): string => {
  if (!dueDate) {
    return "-";
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return `D+${Math.abs(diff)}`;
  }
  if (diff === 0) {
    return "D-Day";
  }
  return `D-${diff}`;
};
