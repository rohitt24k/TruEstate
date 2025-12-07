import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import SalesPage from "../pages/SalesPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sales" element={<SalesPage />} />
        <Route path="*" element={<Navigate to="/sales" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
