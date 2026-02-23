package com.example.mes.item.service;

import com.example.mes.item.domain.Item;
import com.example.mes.item.dto.ItemRequest;
import com.example.mes.item.dto.ItemResponse;
import com.example.mes.item.repository.ItemRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<ItemResponse> getAll() {
        return itemRepository.findAll().stream()
                .map(ItemResponse::from)
                .toList();
    }

    public ItemResponse getById(Long id) {
        Item item = findItem(id);
        return ItemResponse.from(item);
    }

    @Transactional
    public ItemResponse create(ItemRequest request) {
        itemRepository.findByItemCode(request.getItemCode())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("itemCode already exists: " + request.getItemCode());
                });

        Item item = new Item(
                request.getItemCode(),
                request.getItemName(),
                request.getUnit(),
                request.getSafetyStock()
        );
        if (Boolean.FALSE.equals(request.getActive())) {
            item.update(item.getItemName(), item.getUnit(), item.getSafetyStock(), false);
        }

        return ItemResponse.from(itemRepository.save(item));
    }

    @Transactional
    public ItemResponse update(Long id, ItemRequest request) {
        Item item = findItem(id);

        if (!item.getItemCode().equals(request.getItemCode())) {
            throw new IllegalArgumentException("itemCode cannot be changed");
        }

        item.update(
                request.getItemName(),
                request.getUnit(),
                request.getSafetyStock(),
                request.getActive() == null ? item.getActive() : request.getActive()
        );

        return ItemResponse.from(item);
    }

    @Transactional
    public void delete(Long id) {
        Item item = findItem(id);
        itemRepository.delete(item);
    }

    private Item findItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("item not found: " + id));
    }
}
