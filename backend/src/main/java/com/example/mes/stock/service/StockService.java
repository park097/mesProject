package com.example.mes.stock.service;

import com.example.mes.item.domain.Item;
import com.example.mes.item.repository.ItemRepository;
import com.example.mes.stock.domain.StockHistory;
import com.example.mes.stock.domain.StockType;
import com.example.mes.stock.dto.CurrentStockResponse;
import com.example.mes.stock.dto.StockRequest;
import com.example.mes.stock.dto.StockTodaySummaryResponse;
import com.example.mes.stock.dto.StockTransactionResponse;
import com.example.mes.stock.repository.StockHistoryRepository;
import com.example.mes.user.domain.User;
import com.example.mes.user.repository.UserRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StockService {

    private final StockHistoryRepository stockHistoryRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public StockService(
            StockHistoryRepository stockHistoryRepository,
            ItemRepository itemRepository,
            UserRepository userRepository
    ) {
        this.stockHistoryRepository = stockHistoryRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StockTransactionResponse stockIn(StockRequest request, String username) {
        return saveHistory(request, username, StockType.IN);
    }

    @Transactional
    public StockTransactionResponse stockOut(StockRequest request, String username) {
        Integer currentStock = stockHistoryRepository.calculateCurrentStock(request.getItemId());
        if (currentStock < request.getQuantity()) {
            throw new IllegalArgumentException("insufficient stock. current=" + currentStock);
        }
        return saveHistory(request, username, StockType.OUT);
    }

    public CurrentStockResponse getCurrentStock(Long itemId) {
        Item item = findItem(itemId);
        Integer currentStock = stockHistoryRepository.calculateCurrentStock(itemId);
        return CurrentStockResponse.of(item, currentStock);
    }

    public List<StockTransactionResponse> getRecentHistory(Long itemId) {
        findItem(itemId);
        return stockHistoryRepository.findTop20ByItemIdOrderByCreatedAtDesc(itemId).stream()
                .map(StockTransactionResponse::from)
                .toList();
    }

    public StockTodaySummaryResponse getTodaySummary() {
        LocalDateTime from = LocalDate.now().atStartOfDay();
        LocalDateTime to = from.plusDays(1);

        Integer inQty = stockHistoryRepository.sumQuantityByTypeAndPeriod(StockType.IN, from, to);
        Integer outQty = stockHistoryRepository.sumQuantityByTypeAndPeriod(StockType.OUT, from, to);
        long inCount = stockHistoryRepository.countByTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(StockType.IN, from, to);
        long outCount = stockHistoryRepository.countByTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(StockType.OUT, from, to);

        return StockTodaySummaryResponse.of(inQty, outQty, inCount, outCount);
    }

    private StockTransactionResponse saveHistory(StockRequest request, String username, StockType type) {
        Item item = findItem(request.getItemId());
        User user = findUser(username);

        StockHistory saved = stockHistoryRepository.save(
                new StockHistory(item, type, request.getQuantity(), request.getMemo(), user)
        );
        return StockTransactionResponse.from(saved);
    }

    private Item findItem(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("item not found: " + itemId));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("user not found: " + username));
    }
}
