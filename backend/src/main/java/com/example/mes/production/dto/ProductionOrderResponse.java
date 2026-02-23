package com.example.mes.production.dto;

import com.example.mes.production.domain.ProductionOrder;
import com.example.mes.production.domain.ProductionStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProductionOrderResponse(
        Long id,
        String orderNo,
        Long itemId,
        String itemCode,
        String itemName,
        Integer plannedQty,
        Integer producedQty,
        ProductionStatus status,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductionOrderResponse from(ProductionOrder order) {
        return new ProductionOrderResponse(
                order.getId(),
                order.getOrderNo(),
                order.getItem().getId(),
                order.getItem().getItemCode(),
                order.getItem().getItemName(),
                order.getPlannedQty(),
                order.getProducedQty(),
                order.getStatus(),
                order.getDueDate(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
