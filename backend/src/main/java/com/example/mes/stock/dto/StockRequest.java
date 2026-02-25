package com.example.mes.stock.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class StockRequest {

    @NotNull
    private Long itemId;

    @NotNull
    @Positive
    private Integer quantity;

    @Size(max = 200)
    private String memo;

    public Long getItemId() {
        return itemId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getMemo() {
        return memo;
    }
}
