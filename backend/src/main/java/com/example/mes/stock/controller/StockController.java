package com.example.mes.stock.controller;

import com.example.mes.stock.dto.CurrentStockResponse;
import com.example.mes.stock.dto.StockRequest;
import com.example.mes.stock.dto.StockTransactionResponse;
import com.example.mes.stock.service.StockService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/in")
    @ResponseStatus(HttpStatus.CREATED)
    public StockTransactionResponse stockIn(@Valid @RequestBody StockRequest request, Principal principal) {
        return stockService.stockIn(request, principal.getName());
    }

    @PostMapping("/out")
    @ResponseStatus(HttpStatus.CREATED)
    public StockTransactionResponse stockOut(@Valid @RequestBody StockRequest request, Principal principal) {
        return stockService.stockOut(request, principal.getName());
    }

    @GetMapping("/{itemId}/current")
    public CurrentStockResponse getCurrentStock(@PathVariable Long itemId) {
        return stockService.getCurrentStock(itemId);
    }

    @GetMapping("/{itemId}/history")
    public List<StockTransactionResponse> getHistory(@PathVariable Long itemId) {
        return stockService.getRecentHistory(itemId);
    }
}
