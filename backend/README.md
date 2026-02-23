# Backend (Spring Boot)

권장 초기 구성:
- Java 17
- Spring Boot 3.x
- Dependencies:
  - Spring Web
  - Spring Data JPA
  - Spring Security
  - Validation
  - MySQL Driver
  - Lombok

권장 패키지:
```text
com.example.mes
  auth/
  user/
  item/
  stock/
  production/
  common/
  config/
```

초기 작업 순서:
1. Entity/Repository 생성
2. CRUD API 생성
3. JWT 인증/인가 적용
4. 재고/생산 트랜잭션 로직 구현
