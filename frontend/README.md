# Frontend (React + TypeScript)

권장 초기 구성:
- React + TypeScript (Vite 권장)
- Axios
- MUI 또는 Ant Design
- React Router

권장 구조:
```text
src/
  layout/
    TopBar.tsx
    SideBar.tsx
    Layout.tsx
  pages/
    LoginPage.tsx
    Dashboard.tsx
    ItemPage.tsx
    StockPage.tsx
    ProductionPage.tsx
  components/
    DataTable.tsx
    ModalForm.tsx
    CardBox.tsx
  api/
    client.ts
    auth.ts
    item.ts
    stock.ts
    production.ts
```

UI 규칙:
- 흰색/회색 기반
- 파란색 기본 버튼
- 테이블 중심
- 불필요한 애니메이션 금지
