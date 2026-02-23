package com.example.mes.stock.domain;

import com.example.mes.common.BaseTimeEntity;
import com.example.mes.item.domain.Item;
import com.example.mes.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "stock_history")
public class StockHistory extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StockType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 200)
    private String memo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    protected StockHistory() {
    }

    public StockHistory(Item item, StockType type, Integer quantity, String memo, User createdBy) {
        this.item = item;
        this.type = type;
        this.quantity = quantity;
        this.memo = memo;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public Item getItem() {
        return item;
    }

    public StockType getType() {
        return type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public String getMemo() {
        return memo;
    }

    public User getCreatedBy() {
        return createdBy;
    }
}
