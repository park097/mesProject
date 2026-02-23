# 주차별 개발 계획 (4주)

## Week 1: DB 설계 및 백엔드 기초
목표: 도메인/테이블/CRUD API 골격 완성

체크리스트:
- [ ] ERD 설계 완료 (`User`, `Item`, `StockHistory`, `ProductionOrder`)
- [ ] Spring Boot 프로젝트 생성
- [ ] Entity/Repository/Service/Controller 분리
- [ ] Item/ProductionOrder CRUD API 구현
- [ ] MySQL 연동(`application.yml`) 및 JPA 동작 확인

완료 기준:
- Postman에서 기본 CRUD 성공
- DB 테이블 자동 생성 또는 마이그레이션 성공

## Week 2: 인증/권한 + 재고 로직
목표: 로그인/인가 및 재고 흐름 구현

체크리스트:
- [ ] Spring Security + JWT 로그인 구현
- [ ] 비밀번호 BCrypt 암호화
- [ ] `ADMIN` / `USER` 권한 분리
- [ ] 입고(`IN`) / 출고(`OUT`) API 구현
- [ ] StockHistory 기반 현재고 계산 API 구현
- [ ] Postman 인증 포함 통합 테스트 완료

완료 기준:
- 권한 없는 사용자 접근 차단 확인
- 입출고 후 현재고 계산 정확성 검증

## Week 3: React 프론트엔드 및 연동
목표: 업무형 UI 완성 + 백엔드 API 연동

체크리스트:
- [ ] 로그인 화면 구현
- [ ] 레이아웃 구현(TopBar/Sidebar/Main)
- [ ] 대시보드 카드 + 최근 내역 테이블
- [ ] 품목 관리(목록/등록/수정/삭제)
- [ ] 재고 관리(품목 선택, 입고/출고, 현재고 표시)
- [ ] 생산 관리(작업지시/완료/이력)
- [ ] Axios 인터셉터(JWT) 적용

완료 기준:
- 주요 업무 플로우(로그인 -> 품목 -> 재고 -> 생산) 브라우저에서 정상 수행

## Week 4: 온프레미스 배포 및 운영
목표: 실제 서버 배포/외부 접속/보안 정책/장애 복구

체크리스트:
- [ ] `./gradlew build`로 JAR 빌드
- [ ] 서버 업로드 후 `nohup java -jar ...` 실행
- [ ] Nginx 리버스 프록시 연결
- [ ] UFW 정책 적용(`80 allow`, `8080 deny`, `3306 deny`)
- [ ] 외부 공인 IP 접속 테스트
- [ ] 장애 대응 실습 및 복구 기록

완료 기준:
- 외부에서 로그인/업무 처리 가능
- 장애 시나리오별 복구 절차와 로그 증적 확보
