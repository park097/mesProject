package com.example.mes.production.repository;

import com.example.mes.production.domain.ProductionOrder;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, Long> {
    Optional<ProductionOrder> findByOrderNo(String orderNo);
}
