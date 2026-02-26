package com.example.mes.stock.dto;

public record StockTodaySummaryResponse(
        Integer inQty,
        Integer outQty,
        Long inCount,
        Long outCount
) {
    public static StockTodaySummaryResponse of(Integer inQty, Integer outQty, Long inCount, Long outCount) {
        return new StockTodaySummaryResponse(inQty, outQty, inCount, outCount);
    }
}
