package com.example.mes.stock.dto;

import com.example.mes.stock.domain.StockHistory;
import com.example.mes.stock.domain.StockType;
import java.time.LocalDateTime;

public record StockTransactionResponse(
        Long id,
        Long itemId,
        String itemCode,
        String itemName,
        StockType type,
        Integer quantity,
        String memo,
        String createdBy,
        LocalDateTime createdAt
) {
    public static StockTransactionResponse from(StockHistory history) {
        return new StockTransactionResponse(
                history.getId(),
                history.getItem().getId(),
                history.getItem().getItemCode(),
                history.getItem().getItemName(),
                history.getType(),
                history.getQuantity(),
                history.getMemo(),
                history.getCreatedBy().getUsername(),
                history.getCreatedAt()
        );
    }
}
