import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import ItemPage from "./pages/ItemPage";
import StockPage from "./pages/StockPage";
import ProductionPage from "./pages/ProductionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemPage />} />
          <Route path="/stocks" element={<StockPage />} />
          <Route path="/productions" element={<ProductionPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

