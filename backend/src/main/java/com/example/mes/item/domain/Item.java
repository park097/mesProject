package com.example.mes.item.domain;

import com.example.mes.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "items")
public class Item extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_code", nullable = false, unique = true, length = 50)
    private String itemCode;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "safety_stock", nullable = false)
    private Integer safetyStock;

    @Column(nullable = false)
    private Boolean active;

    protected Item() {
    }

    public Item(String itemCode, String itemName, String unit, Integer safetyStock) {
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.unit = unit;
        this.safetyStock = safetyStock;
        this.active = true;
    }

    public void update(String itemName, String unit, Integer safetyStock, Boolean active) {
        this.itemName = itemName;
        this.unit = unit;
        this.safetyStock = safetyStock;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

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
