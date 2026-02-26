package com.example.mes.stock.repository;

import com.example.mes.stock.domain.StockHistory;
import com.example.mes.stock.domain.StockType;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {

    List<StockHistory> findTop20ByItemIdOrderByCreatedAtDesc(Long itemId);

    @Query("""
            select coalesce(sum(
                case
                    when sh.type = com.example.mes.stock.domain.StockType.IN then sh.quantity
                    else -sh.quantity
                end
            ), 0)
            from StockHistory sh
            where sh.item.id = :itemId
            """)
    Integer calculateCurrentStock(@Param("itemId") Long itemId);

    @Query("""
            select coalesce(sum(sh.quantity), 0)
            from StockHistory sh
            where sh.type = :type
              and sh.createdAt >= :from
              and sh.createdAt < :to
            """)
    Integer sumQuantityByTypeAndPeriod(
            @Param("type") StockType type,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    long countByTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(
            StockType type,
            LocalDateTime from,
            LocalDateTime to
    );
}
