import PageHeader from "../components/common/PageHeader";

import AIWelcome from "../components/ai/AIWelcome";
import AIChat from "../components/ai/AIChat";
import AIStockAnalyzer from "../components/ai/AIStockAnalyzer";
import NewsSentiment from "../components/ai/NewsSentiment";
import AIPortfolioReview from "../components/ai/AIPortfolioReview";
import DailyMarketBrief from "../components/ai/DailyMarketBrief";
import AIStrategyGenerator from "../components/ai/AIStrategyGenerator";
import AIRiskAlerts from "../components/ai/AIRiskAlerts";

export default function AIAdvisor() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="🤖 AI Advisor"
        subtitle="Your intelligent investment assistant powered by AI and Machine Learning."
      />

      <AIWelcome />

      <AIChat />

      <AIStockAnalyzer />

      <NewsSentiment />

      <AIPortfolioReview />

      <DailyMarketBrief />

      <AIStrategyGenerator />

      <AIRiskAlerts />
    </div>
  );
}