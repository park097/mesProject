package com.example.mes.stock.repository;

import com.example.mes.stock.domain.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
}
