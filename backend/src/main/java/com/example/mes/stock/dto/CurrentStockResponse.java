package com.example.mes.stock.dto;

import com.example.mes.item.domain.Item;

public record CurrentStockResponse(
        Long itemId,
        String itemCode,
        String itemName,
        String unit,
        Integer safetyStock,
        Integer currentStock
) {
    public static CurrentStockResponse of(Item item, Integer currentStock) {
        return new CurrentStockResponse(
                item.getId(),
                item.getItemCode(),
                item.getItemName(),
                item.getUnit(),
                item.getSafetyStock(),
                currentStock
        );
    }
}
