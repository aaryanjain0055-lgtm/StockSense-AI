import {
  useEffect,
  useState,
} from "react";

import AIWelcome from "../components/ai/AIWelcome";
import DailyMarketBrief from "../components/ai/DailyMarketBrief";
import AIStockAnalyzer from "../components/ai/AIStockAnalyzer";
import AIPortfolioReview from "../components/ai/AIPortfolioReview";
import AIStrategyGenerator from "../components/ai/AIStrategyGenerator";
import AIRiskAlerts from "../components/ai/AIRiskAlerts";
import AIChat from "../components/ai/AIChat";
import NewsSentiment from "../components/ai/NewsSentiment";


const DEFAULT_SYMBOL =
  "RELIANCE.NS";


export default function AIAdvisor() {
  const [
    symbol,
    setSymbol,
  ] = useState(
    DEFAULT_SYMBOL,
  );


  useEffect(() => {
    function handleStockSelection(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          symbol?: string;
        }>;


      const selectedSymbol =
        customEvent.detail
          ?.symbol;


      if (
        typeof selectedSymbol !==
          "string" ||
        !selectedSymbol.trim()
      ) {
        return;
      }


      setSymbol(
        selectedSymbol
          .trim()
          .toUpperCase(),
      );
    }


    window.addEventListener(
      "stock-symbol-selected",
      handleStockSelection,
    );


    return () => {
      window.removeEventListener(
        "stock-symbol-selected",
        handleStockSelection,
      );
    };
  }, []);


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
          AI Advisor
        </h1>


        <p
          style={{
            color: "#94a3b8",

            margin: 0,
          }}
        >
          Explainable market analysis,
          portfolio intelligence, strategy
          research and risk insights.
        </p>


        <div
          style={{
            marginTop: 12,

            display: "inline-flex",

            alignItems: "center",

            gap: 8,

            padding:
              "8px 12px",

            background: "#111827",

            border:
              "1px solid #1e293b",

            borderRadius: 8,

            color: "#60a5fa",

            fontSize: 13,

            fontWeight: 700,
          }}
        >
          Selected stock: {symbol}
        </div>
      </div>


      <AIWelcome />


      <DailyMarketBrief />


      <AIStockAnalyzer />


      <NewsSentiment
        symbol={symbol}
      />


      <AIPortfolioReview />


      <AIStrategyGenerator />


      <AIRiskAlerts />


      <AIChat />
    </div>
  );
}