# Mini MES (재고/생산 관리) - 4주 개발/배포 프로젝트

Spring Boot + React 기반 Mini MES를 온프레미스(Ubuntu + Nginx + MySQL) 환경에 배포/운영하는 프로젝트입니다.

## 1) 목표
- 인증/권한 기반 업무 시스템 구현
- 재고 입출고 흐름 및 생산 반영 로직 구현
- React 업무형 UI 연동
- 온프레미스 서버 배포 + 리버스 프록시 + 방화벽 정책 적용
- 장애 대응 및 복구 문서화

최종 목표 문장:
`Spring Boot 기반 MES 시스템을 설계/개발하고, React와 연동하여 온프레미스 서버에 직접 배포 및 운영했습니다.`

## 2) 아키텍처
`Client Browser -> Nginx(80) -> Spring Boot(8080 내부) -> MySQL(3306 내부)`

보안 정책:
- 외부 허용: `80`
- 외부 차단: `8080`, `3306`

## 3) 기술 스택
- Backend: Java 17, Spring Boot, Spring Data JPA, Spring Security(JWT), MySQL
- Frontend: React(Typescript), Axios, MUI 또는 Ant Design
- Infra: Ubuntu Server, Nginx, UFW

## 4) 주차별 계획
- 1주차: DB 설계 + 백엔드 기본 구조/CRUD
- 2주차: 인증/권한 + 재고 흐름 로직
- 3주차: React 업무형 UI + API 연동
- 4주차: 온프레미스 배포 + 보안 정책 + 장애 대응

자세한 체크리스트는 아래 문서 참고:
- `docs/WEEKLY_PLAN.md`
- `docs/DEFINITION_OF_DONE.md`

## 5) 문서
- 아키텍처/ERD: `docs/ARCHITECTURE_AND_ERD.md`
- API 명세 초안: `docs/API_SPEC.md`
- 배포 가이드: `docs/DEPLOY_ONPREM_UBUNTU.md`
- 장애 대응 가이드: `docs/INCIDENT_RESPONSE.md`

## 6) 권장 저장소 구조
```text
mes/
  backend/      # Spring Boot
  frontend/     # React + TS
  docs/         # 설계/운영 문서
```

## 7) 진행 원칙
- 단순 CRUD가 아닌 실제 업무 흐름 중심으로 구현
- 화면은 화려함보다 업무 효율(테이블/폼/상태 가시성) 우선
- 배포 후 반드시 장애 복구 시나리오를 실제로 수행하고 로그 근거를 남김
