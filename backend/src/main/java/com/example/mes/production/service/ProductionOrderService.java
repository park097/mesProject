package com.example.mes.production.service;

import com.example.mes.item.domain.Item;
import com.example.mes.item.repository.ItemRepository;
import com.example.mes.production.domain.ProductionOrder;
import com.example.mes.production.domain.ProductionStatus;
import com.example.mes.production.dto.ProductionOrderRequest;
import com.example.mes.production.dto.ProductionOrderResponse;
import com.example.mes.production.repository.ProductionOrderRepository;
import com.example.mes.stock.domain.StockHistory;
import com.example.mes.stock.domain.StockType;
import com.example.mes.stock.repository.StockHistoryRepository;
import com.example.mes.user.domain.User;
import com.example.mes.user.domain.UserRole;
import com.example.mes.user.repository.UserRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductionOrderService {

    private final ProductionOrderRepository productionOrderRepository;
    private final ItemRepository itemRepository;
    private final StockHistoryRepository stockHistoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProductionOrderService(
            ProductionOrderRepository productionOrderRepository,
            ItemRepository itemRepository,
            StockHistoryRepository stockHistoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.productionOrderRepository = productionOrderRepository;
        this.itemRepository = itemRepository;
        this.stockHistoryRepository = stockHistoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<ProductionOrderResponse> getAll() {
        return productionOrderRepository.findAll().stream()
                .map(ProductionOrderResponse::from)
                .toList();
    }

    public ProductionOrderResponse getById(Long id) {
        ProductionOrder order = findOrder(id);
        return ProductionOrderResponse.from(order);
    }

    @Transactional
    public ProductionOrderResponse create(ProductionOrderRequest request) {
        productionOrderRepository.findByOrderNo(request.getOrderNo())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("orderNo already exists: " + request.getOrderNo());
                });

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("item not found: " + request.getItemId()));

        User systemUser = getOrCreateSystemUser();
        ProductionOrder order = new ProductionOrder(
                request.getOrderNo(),
                item,
                request.getPlannedQty(),
                request.getDueDate(),
                systemUser
        );
        Integer producedQty = request.getProducedQty() == null ? 0 : request.getProducedQty();
        ProductionStatus status = request.getStatus() == null ? ProductionStatus.CREATED : request.getStatus();
        order.update(request.getPlannedQty(), producedQty, status, request.getDueDate());

        return ProductionOrderResponse.from(productionOrderRepository.save(order));
    }

    @Transactional
    public ProductionOrderResponse update(Long id, ProductionOrderRequest request, String username) {
        ProductionOrder order = findOrder(id);
        if (order.getStatus() == ProductionStatus.DONE) {
            throw new IllegalArgumentException("completed order cannot be updated");
        }

        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new IllegalArgumentException("item not found: " + request.getItemId()));
        if (!order.getItem().getId().equals(item.getId())) {
            throw new IllegalArgumentException("item cannot be changed");
        }

        if (!order.getOrderNo().equals(request.getOrderNo())) {
            throw new IllegalArgumentException("orderNo cannot be changed");
        }

        Integer nextProducedQty = request.getProducedQty() == null ? order.getProducedQty() : request.getProducedQty();
        ProductionStatus nextStatus = request.getStatus() == null ? order.getStatus() : request.getStatus();

        if (nextProducedQty < order.getProducedQty()) {
            throw new IllegalArgumentException("producedQty cannot be decreased");
        }

        if (nextStatus == ProductionStatus.DONE && nextProducedQty <= 0) {
            throw new IllegalArgumentException("producedQty must be greater than 0 when status is DONE");
        }

        order.update(
                request.getPlannedQty(),
                nextProducedQty,
                nextStatus,
                request.getDueDate()
        );

        if (nextStatus == ProductionStatus.DONE) {
            User user = findUser(username);
            stockHistoryRepository.save(
                    new StockHistory(
                            order.getItem(),
                            StockType.IN,
                            nextProducedQty,
                            "production done: " + order.getOrderNo(),
                            user
                    )
            );
        }

        return ProductionOrderResponse.from(order);
    }

    @Transactional
    public void delete(Long id) {
        ProductionOrder order = findOrder(id);
        productionOrderRepository.delete(order);
    }

    private ProductionOrder findOrder(Long id) {
        return productionOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("production order not found: " + id));
    }

    private User getOrCreateSystemUser() {
        return userRepository.findByUsername("system")
                .orElseGet(() -> userRepository.save(
                        new User("system", passwordEncoder.encode("system1234"), UserRole.ADMIN)
                ));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("user not found: " + username));
    }
}
