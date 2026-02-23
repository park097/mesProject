package com.example.mes.production.domain;

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
import java.time.LocalDate;

@Entity
@Table(name = "production_orders")
public class ProductionOrder extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_no", nullable = false, unique = true, length = 50)
    private String orderNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(name = "planned_qty", nullable = false)
    private Integer plannedQty;

    @Column(name = "produced_qty", nullable = false)
    private Integer producedQty;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductionStatus status;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    protected ProductionOrder() {
    }

    public ProductionOrder(String orderNo, Item item, Integer plannedQty, LocalDate dueDate, User createdBy) {
        this.orderNo = orderNo;
        this.item = item;
        this.plannedQty = plannedQty;
        this.producedQty = 0;
        this.status = ProductionStatus.CREATED;
        this.dueDate = dueDate;
        this.createdBy = createdBy;
    }

    public void update(Integer plannedQty, Integer producedQty, ProductionStatus status, LocalDate dueDate) {
        this.plannedQty = plannedQty;
        this.producedQty = producedQty;
        this.status = status;
        this.dueDate = dueDate;
    }

    public Long getId() {
        return id;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public Item getItem() {
        return item;
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

    public User getCreatedBy() {
        return createdBy;
    }
}
