import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import ItemPage from "./pages/ItemPage";
import StockPage from "./pages/StockPage";
import ProductionPage from "./pages/ProductionPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { isAuthenticated } from "./auth/authStorage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/items" element={<ItemPage />} />
            <Route path="/stocks" element={<StockPage />} />
            <Route path="/productions" element={<ProductionPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

