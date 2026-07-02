import { Search } from "lucide-react";

import StockOverview from "../components/stocks/StockOverview";
import StockPriceChart from "../components/stocks/StockPriceChart";
import TechnicalIndicators from "../components/stocks/TechnicalIndicators";
import FinancialStatements from "../components/stocks/FinancialStatements";
import AICompanySummary from "../components/stocks/AICompanySummary";

export default function Stocks() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <div>
        <h1
          style={{
            color: "white",
            fontSize: 32,
            marginBottom: 10,
          }}
        >
          📊 Stock Analysis
        </h1>

        <p
          style={{
            color: "#94a3b8",
          }}
        >
          Analyze company fundamentals, technical indicators and AI insights.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: "14px 18px",
        }}
      >
        <Search
          size={20}
          color="#94a3b8"
        />

        <input
          placeholder="Search company..."
          style={{
            marginLeft: 12,
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
          }}
        />
      </div>

      <StockOverview />

      <StockPriceChart />

      <TechnicalIndicators />

      <FinancialStatements />

      <AICompanySummary />
    </div>
  );
}