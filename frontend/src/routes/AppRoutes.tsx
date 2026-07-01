import { Routes, Route } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import Dashboard from "../pages/Dashboard";
import Market from "../pages/Market";
import Stocks from "../pages/Stocks";
import Prediction from "../pages/Prediction";
import Portfolio from "../pages/Portfolio";
import AIAdvisor from "../pages/AIAdvisor";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="market" element={<Market />} />
        <Route path="stocks" element={<Stocks />} />
        <Route path="prediction" element={<Prediction />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="ai-advisor" element={<AIAdvisor />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}