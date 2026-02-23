# React + TypeScript 프론트 초기 세팅 가이드

이 문서는 현재 프로젝트처럼 `Vite + React + TypeScript + MUI`로 시작할 때 필요한 파일, 라이브러리, 실행 순서를 정리한 체크리스트다.

## 1) 필수 런타임/도구
- Node.js LTS (권장: 20 이상)
- npm (Node 포함)
- VS Code + ESLint/Prettier(선택)

## 2) 필수 설치 라이브러리

## 기본
```bash
npm i react react-dom react-router-dom
```

## MUI
```bash
npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## DataGrid
```bash
npm i @mui/x-data-grid
```

## 개발 의존성
```bash
npm i -D typescript vite @vitejs/plugin-react-swc @types/react @types/react-dom
```

## 3) 필수 파일 구조
```text
frontend/
  src/
    main.tsx
    App.tsx
    layout/
      Layout.tsx
      TopBar.tsx
      SideBar.tsx
    pages/
      Dashboard.tsx
      ItemPage.tsx
      StockPage.tsx
      ProductionPage.tsx
    components/
      cards/
        KpiCard.tsx
      tables/
        InventoryDataGrid.tsx
    data/
      mockData.ts
    theme/
      appTheme.ts
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  .gitignore
```

## 4) 핵심 설정 파일 예시

## package.json (scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

## tsconfig.json (핵심)
- `jsx: "react-jsx"` 설정
- `include: ["src", "vite.config.ts"]`

## vite.config.ts
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
});
```

## 5) 라우팅/레이아웃 권장 패턴
- `TopBar`, `SideBar`는 고정
- `Layout.tsx`에서 `Outlet` 사용
- `App.tsx`는 중첩 라우팅 구조 사용

예시:
```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/items" element={<ItemPage />} />
    <Route path="/stocks" element={<StockPage />} />
    <Route path="/productions" element={<ProductionPage />} />
  </Route>
</Routes>
```

## 6) 실행 순서
```bash
cd frontend
npm install
npm run dev
```

접속:
- `http://localhost:5173`

## 7) 자주 생기는 오류와 해결

## `React refers to a UMD global...`
- 원인: `jsx` 설정/TS 서버 캐시 문제
- 해결:
  1. `tsconfig.json`에 `jsx: "react-jsx"` 확인
  2. VS Code `TypeScript: Restart TS Server`

## `tsconfig.app.json not found`
- 원인: `references` 경로 불일치 또는 에디터 캐시
- 해결:
  1. `tsconfig.json` 단일 설정으로 단순화하거나
  2. references 파일 경로/파일명 일치 확인

## `ENOTEMPTY`로 npm install 실패
- 원인: 깨진 `node_modules`
- 해결:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 8) 커밋 제외(.gitignore) 권장
```gitignore
node_modules
dist
*.tsbuildinfo
vite.config.js
vite.config.d.ts
```
