import {
  lazy,
  Suspense,
} from "react";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import Loading from "../components/common/Loading";


const Dashboard = lazy(
  () => import("../pages/Dashboard")
);

const Market = lazy(
  () => import("../pages/Market")
);

const Stocks = lazy(
  () => import("../pages/Stocks")
);

const Prediction = lazy(
  () => import("../pages/Prediction")
);

const Portfolio = lazy(
  () => import("../pages/Portfolio")
);

const AIAdvisor = lazy(
  () => import("../pages/AIAdvisor")
);

const NotFound = lazy(
  () => import("../pages/NotFound")
);


export default function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/market"
            element={<Market />}
          />

          <Route
            path="/stocks"
            element={<Stocks />}
          />

          <Route
            path="/prediction"
            element={<Prediction />}
          />

          <Route
            path="/portfolio"
            element={<Portfolio />}
          />

          <Route
            path="/ai-advisor"
            element={<AIAdvisor />}
          />
        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Suspense>
  );
}