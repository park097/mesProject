package com.example.mes.item.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ItemRequest {

    @NotBlank
    @Size(max = 50)
    private String itemCode;

    @NotBlank
    @Size(max = 100)
    private String itemName;

    @NotBlank
    @Size(max = 20)
    private String unit;

    @NotNull
    @Min(0)
    private Integer safetyStock;

    private Boolean active = true;

    public String getItemCode() {
        return itemCode;
    }

    public String getItemName() {
        return itemName;
    }

    public String getUnit() {
        return unit;
    }

    public Integer getSafetyStock() {
        return safetyStock;
    }

    public Boolean getActive() {
        return active;
    }
}
