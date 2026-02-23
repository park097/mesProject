# API 명세서 (v0.1 초안)

Base URL: `/api`

## Auth

## POST `/auth/login`
설명: 로그인 후 JWT 발급

Request:
```json
{
  "username": "admin",
  "password": "password"
}
```

Response 200:
```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "username": "admin",
  "role": "ADMIN"
}
```

## Item

## GET `/items`
설명: 품목 목록 조회

## POST `/items` (ADMIN)
설명: 품목 등록

Request:
```json
{
  "itemCode": "ITEM-001",
  "itemName": "완제품A",
  "unit": "EA",
  "safetyStock": 100
}
```

## PUT `/items/{id}` (ADMIN)
설명: 품목 수정

## DELETE `/items/{id}` (ADMIN)
설명: 품목 비활성 또는 삭제

## Stock

## POST `/stocks/in`
설명: 입고 처리

Request:
```json
{
  "itemId": 1,
  "quantity": 50,
  "memo": "원자재 입고"
}
```

## POST `/stocks/out`
설명: 출고 처리

Request:
```json
{
  "itemId": 1,
  "quantity": 20,
  "memo": "생산 투입"
}
```

## GET `/stocks/current/{itemId}`
설명: 현재고 조회 (IN 합계 - OUT 합계)

Response 200:
```json
{
  "itemId": 1,
  "currentStock": 30
}
```

## GET `/stocks/history`
설명: 재고 이력 조회

Query:
- `itemId` (optional)
- `from` (optional, yyyy-MM-dd)
- `to` (optional, yyyy-MM-dd)

## Production

## POST `/productions`
설명: 작업지시 생성

Request:
```json
{
  "itemId": 1,
  "plannedQty": 100,
  "dueDate": "2026-03-10"
}
```

## POST `/productions/{id}/complete`
설명: 생산 완료 처리 + 재고 입고 반영

Request:
```json
{
  "producedQty": 95
}
```

## GET `/productions`
설명: 생산 이력 조회

## 공통 에러 포맷
```json
{
  "timestamp": "2026-02-23T14:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "quantity must be greater than 0",
  "path": "/api/stocks/in"
}
```
