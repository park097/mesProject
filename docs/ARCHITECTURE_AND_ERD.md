# 아키텍처 및 ERD 초안

## 시스템 아키텍처
```text
[Client Browser]
       |
   (HTTP 80)
       |
    [Nginx]
       |
 reverse proxy
       |
[Spring Boot :8080] ---- [MySQL :3306]
```

## 네트워크/보안 원칙
- 외부 오픈: `80`
- 내부만 사용: `8080`, `3306`
- 앱/DB는 내부 통신만 허용

## ERD (초안)

## 1. users
- `id` (PK, bigint)
- `username` (varchar, unique, not null)
- `password_hash` (varchar, not null)
- `role` (varchar, not null)  // ADMIN, USER
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)

## 2. items
- `id` (PK, bigint)
- `item_code` (varchar, unique, not null)
- `item_name` (varchar, not null)
- `unit` (varchar, not null) // EA, KG 등
- `safety_stock` (int, default 0)
- `active` (boolean, default true)
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)

## 3. stock_history
- `id` (PK, bigint)
- `item_id` (FK -> items.id, not null)
- `type` (varchar, not null) // IN, OUT
- `quantity` (int, not null)
- `memo` (varchar, null)
- `created_by` (FK -> users.id, not null)
- `created_at` (datetime, not null)

제약:
- `quantity > 0`

## 4. production_orders
- `id` (PK, bigint)
- `order_no` (varchar, unique, not null)
- `item_id` (FK -> items.id, not null)
- `planned_qty` (int, not null)
- `produced_qty` (int, default 0)
- `status` (varchar, not null) // CREATED, IN_PROGRESS, DONE
- `due_date` (date, null)
- `created_by` (FK -> users.id, not null)
- `created_at` (datetime, not null)
- `updated_at` (datetime, not null)

## 관계
- users 1 : N stock_history
- users 1 : N production_orders
- items 1 : N stock_history
- items 1 : N production_orders
