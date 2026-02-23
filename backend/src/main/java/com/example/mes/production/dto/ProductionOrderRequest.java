package com.example.mes.production.dto;

import com.example.mes.production.domain.ProductionStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ProductionOrderRequest {

    @NotBlank
    @Size(max = 50)
    private String orderNo;

    @NotNull
    private Long itemId;

    @NotNull
    @Min(1)
    private Integer plannedQty;

    @Min(0)
    private Integer producedQty = 0;

    private ProductionStatus status = ProductionStatus.CREATED;

    private LocalDate dueDate;

    public String getOrderNo() {
        return orderNo;
    }

    public Long getItemId() {
        return itemId;
    }

    public Integer getPlannedQty() {
        return plannedQty;
    }

    public Integer getProducedQty() {
        return producedQty;
    }

    public ProductionStatus getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
}
