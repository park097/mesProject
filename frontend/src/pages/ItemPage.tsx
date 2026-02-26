import { isAxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import InventoryDataGrid from "../components/tables/InventoryDataGrid";
import { createItem, deleteItem, getItems, type ItemResponse, updateItem } from "../api/itemApi";
import type { TableRow } from "../types/table";
import { mapItemToTableRow } from "../utils/tableMapper";

export default function ItemPage() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [rows, setRows] = useState<TableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("EA");
  const [safetyStock, setSafetyStock] = useState("0");
  const [active, setActive] = useState(true);

  const [selectedItemId, setSelectedItemId] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editUnit, setEditUnit] = useState("EA");
  const [editSafetyStock, setEditSafetyStock] = useState("0");
  const [editActive, setEditActive] = useState(true);

  const syncEditForm = (target: ItemResponse) => {
    setEditItemName(target.itemName);
    setEditUnit(target.unit);
    setEditSafetyStock(String(target.safetyStock));
    setEditActive(target.active);
  };

  const loadItems = async () => {
    const itemList = await getItems();
    setItems(itemList);
    setRows(itemList.map(mapItemToTableRow));

    if (itemList.length === 0) {
      setSelectedItemId("");
      return;
    }

    const hasSelected = itemList.some((item) => String(item.id) === selectedItemId);
    const nextId = hasSelected ? selectedItemId : String(itemList[0].id);
    setSelectedItemId(nextId);
    const selectedItem = itemList.find((item) => String(item.id) === nextId);
    if (selectedItem) {
      syncEditForm(selectedItem);
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await loadItems();
      } catch {
        setErrorMessage("품목 데이터를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateItem = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const parsedSafetyStock = Number(safetyStock);
    if (!itemCode.trim()) {
      setErrorMessage("품목코드를 입력해 주세요.");
      return;
    }
    if (!itemName.trim()) {
      setErrorMessage("품목명을 입력해 주세요.");
      return;
    }
    if (!unit.trim()) {
      setErrorMessage("단위를 입력해 주세요.");
      return;
    }
    if (!Number.isFinite(parsedSafetyStock) || parsedSafetyStock < 0) {
      setErrorMessage("안전재고는 0 이상이어야 합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createItem({
        itemCode: itemCode.trim(),
        itemName: itemName.trim(),
        unit: unit.trim(),
        safetyStock: parsedSafetyStock,
        active,
      });
      await loadItems();
      setSuccessMessage("품목이 등록되었습니다.");
      setItemCode("");
      setItemName("");
      setUnit("EA");
      setSafetyStock("0");
      setActive(true);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("품목 등록에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateItem = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const id = Number(selectedItemId);
    const parsedSafetyStock = Number(editSafetyStock);
    if (!id) {
      setErrorMessage("수정할 품목을 선택해 주세요.");
      return;
    }
    if (!editItemName.trim()) {
      setErrorMessage("품목명을 입력해 주세요.");
      return;
    }
    if (!editUnit.trim()) {
      setErrorMessage("단위를 입력해 주세요.");
      return;
    }
    if (!Number.isFinite(parsedSafetyStock) || parsedSafetyStock < 0) {
      setErrorMessage("안전재고는 0 이상이어야 합니다.");
      return;
    }

    const target = items.find((item) => item.id === id);
    if (!target) {
      setErrorMessage("선택한 품목을 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateItem(id, {
        itemCode: target.itemCode,
        itemName: editItemName.trim(),
        unit: editUnit.trim(),
        safetyStock: parsedSafetyStock,
        active: editActive,
      });
      await loadItems();
      setSuccessMessage("품목이 수정되었습니다.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("품목 수정에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteItem = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const id = Number(selectedItemId);
    if (!id) {
      setErrorMessage("삭제할 품목을 선택해 주세요.");
      return;
    }

    const target = items.find((item) => item.id === id);
    if (!target) {
      setErrorMessage("선택한 품목을 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm(`품목 ${target.itemCode}를 삭제하시겠습니까?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteItem(id);
      await loadItems();
      setSuccessMessage("품목이 삭제되었습니다.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.data?.message) {
        setErrorMessage(String(error.response.data.message));
      } else {
        setErrorMessage("품목 삭제에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Item Management
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            품목 등록
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              label="품목코드"
              value={itemCode}
              onChange={(event) => setItemCode(event.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            />
            <TextField
              label="품목명"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="단위"
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              size="small"
              sx={{ width: 100 }}
            />
            <TextField
              label="안전재고"
              type="number"
              value={safetyStock}
              onChange={(event) => setSafetyStock(event.target.value)}
              size="small"
              inputProps={{ min: 0 }}
              sx={{ width: 120 }}
            />
            <FormControlLabel
              label="활성"
              control={<Switch checked={active} onChange={(event) => setActive(event.target.checked)} />}
            />
            <Button variant="contained" disabled={isSubmitting} onClick={() => void onCreateItem()}>
              등록
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            품목 수정/삭제
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            <TextField
              select
              label="품목 선택"
              value={selectedItemId}
              onChange={(event) => {
                const id = event.target.value;
                setSelectedItemId(id);
                const target = items.find((item) => String(item.id) === id);
                if (target) {
                  syncEditForm(target);
                }
              }}
              size="small"
              sx={{ minWidth: 240 }}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.itemCode} - {item.itemName}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="품목명" value={editItemName} onChange={(event) => setEditItemName(event.target.value)} size="small" />
            <TextField label="단위" value={editUnit} onChange={(event) => setEditUnit(event.target.value)} size="small" sx={{ width: 100 }} />
            <TextField
              label="안전재고"
              type="number"
              value={editSafetyStock}
              onChange={(event) => setEditSafetyStock(event.target.value)}
              size="small"
              inputProps={{ min: 0 }}
              sx={{ width: 120 }}
            />
            <FormControlLabel
              label="활성"
              control={<Switch checked={editActive} onChange={(event) => setEditActive(event.target.checked)} />}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" disabled={isSubmitting} onClick={() => void onUpdateItem()}>
                수정
              </Button>
              <Button variant="outlined" color="error" disabled={isSubmitting} onClick={() => void onDeleteItem()}>
                삭제
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {isLoading ? <CircularProgress /> : <InventoryDataGrid title="품목 리스트" rows={rows} />}
    </Stack>
  );
}

