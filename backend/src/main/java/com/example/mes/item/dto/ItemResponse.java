package com.example.mes.item.dto;

import com.example.mes.item.domain.Item;
import java.time.LocalDateTime;

public record ItemResponse(
        Long id,
        String itemCode,
        String itemName,
        String unit,
        Integer safetyStock,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ItemResponse from(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getItemCode(),
                item.getItemName(),
                item.getUnit(),
                item.getSafetyStock(),
                item.getActive(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}
