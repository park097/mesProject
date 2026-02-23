# Backend (Spring Boot)

## 현재 구현 범위 (1주차)
- Maven + Spring Boot 3.x + Java 17
- Entity 4종
  - `User`
  - `Item`
  - `StockHistory`
  - `ProductionOrder`
- Item CRUD API
- ProductionOrder CRUD API
- 공통 에러 응답 핸들러
- CORS(`http://localhost:5173`) 허용

## 실행 방법
```bash
cd backend
mvn spring-boot:run
```

## DB 설정
`src/main/resources/application.yml`
- 기본값:
  - url: `jdbc:mysql://localhost:3306/mini_mes`
  - username: `root`
  - password: `1234`

필요 시 실제 서버 값으로 수정.

## API 엔드포인트

## Item
- `GET /api/items`
- `GET /api/items/{id}`
- `POST /api/items`
- `PUT /api/items/{id}`
- `DELETE /api/items/{id}`

## Production
- `GET /api/productions`
- `GET /api/productions/{id}`
- `POST /api/productions`
- `PUT /api/productions/{id}`
- `DELETE /api/productions/{id}`

## 샘플 요청

Item 생성:
```json
{
  "itemCode": "ITEM-001",
  "itemName": "완제품A",
  "unit": "EA",
  "safetyStock": 100,
  "active": true
}
```

Production 생성:
```json
{
  "orderNo": "PO-202602-001",
  "itemId": 1,
  "plannedQty": 100,
  "producedQty": 0,
  "status": "CREATED",
  "dueDate": "2026-03-10"
}
```
