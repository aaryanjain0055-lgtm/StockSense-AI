import { useState } from "react";

import StockSearch from "../components/common/StockSearch";

import StockOverview from "../components/stocks/StockOverview";
import StockPriceChart from "../components/stocks/StockPriceChart";
import TechnicalIndicators from "../components/stocks/TechnicalIndicators";
import FinancialStatements from "../components/stocks/FinancialStatements";
import AICompanySummary from "../components/stocks/AICompanySummary";
import NewsSentiment from "../components/ai/NewsSentiment";
import StockScore from "../components/stocks/StockScore";


export default function Stocks() {
  // ====================================================
  // SELECTED STOCK
  // ====================================================

  const [selectedSymbol, setSelectedSymbol] =
    useState<string>("RELIANCE.NS");


  // ====================================================
  // HANDLE STOCK CHANGE
  // ====================================================

  const handleStockSelect = (symbol: string) => {
    const cleanedSymbol = symbol
      .trim()
      .toUpperCase();

    if (!cleanedSymbol) {
      return;
    }

    setSelectedSymbol(cleanedSymbol);
  };


  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* ============================================= */}
      {/* PAGE HEADER */}
      {/* ============================================= */}

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
            lineHeight: 1.6,
          }}
        >
          Analyze company fundamentals, technical indicators,
          company intelligence, explainable stock scoring,
          and news sentiment.
        </p>
      </div>


      {/* ============================================= */}
      {/* STOCK SEARCH */}
      {/* ============================================= */}

      <StockSearch
        onSelect={handleStockSelect}
      />


      {/* ============================================= */}
      {/* SELECTED STOCK INFO */}
      {/* ============================================= */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: "14px 18px",
        }}
      >
        <div>
          <p
            style={{
              color: "#64748b",
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            Currently analyzing
          </p>

          <h3
            style={{
              color: "white",
              margin: 0,
            }}
          >
            {selectedSymbol}
          </h3>
        </div>

        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            color: "#60a5fa",
            padding: "8px 14px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Live Analysis
        </div>
      </div>


      {/* ============================================= */}
      {/* STOCK OVERVIEW */}
      {/* ============================================= */}

      <StockOverview
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* EXPLAINABLE STOCK SCORE */}
      {/* ============================================= */}

      <StockScore
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* PRICE CHART */}
      {/* ============================================= */}

      <StockPriceChart
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* TECHNICAL ANALYSIS */}
      {/* ============================================= */}

      <TechnicalIndicators
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* FUNDAMENTAL ANALYSIS */}
      {/* ============================================= */}

      <FinancialStatements
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* COMPANY INTELLIGENCE */}
      {/* ============================================= */}

      <AICompanySummary
        symbol={selectedSymbol}
      />


      {/* ============================================= */}
      {/* NEWS SENTIMENT */}
      {/* ============================================= */}

      <NewsSentiment
        symbol={selectedSymbol}
      />
    </div>
  );
}