package com.example.mes.production.controller;

import com.example.mes.production.dto.ProductionOrderRequest;
import com.example.mes.production.dto.ProductionOrderResponse;
import com.example.mes.production.service.ProductionOrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/productions")
public class ProductionOrderController {

    private final ProductionOrderService productionOrderService;

    public ProductionOrderController(ProductionOrderService productionOrderService) {
        this.productionOrderService = productionOrderService;
    }

    @GetMapping
    public List<ProductionOrderResponse> getOrders() {
        return productionOrderService.getAll();
    }

    @GetMapping("/{id}")
    public ProductionOrderResponse getOrder(@PathVariable Long id) {
        return productionOrderService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductionOrderResponse createOrder(@Valid @RequestBody ProductionOrderRequest request) {
        return productionOrderService.create(request);
    }

    @PutMapping("/{id}")
    public ProductionOrderResponse updateOrder(@PathVariable Long id, @Valid @RequestBody ProductionOrderRequest request) {
        return productionOrderService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable Long id) {
        productionOrderService.delete(id);
    }
}
