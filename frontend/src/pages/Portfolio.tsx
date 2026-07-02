import PageHeader from "../components/common/PageHeader";

import PortfolioOverview from "../components/portfolio/PortfolioOverview";
import PortfolioAllocation from "../components/portfolio/PortfolioAllocation";
import HoldingsTable from "../components/portfolio/HoldingsTable";
import PortfolioPerformance from "../components/portfolio/PortfolioPerformance";
import PortfolioRisk from "../components/portfolio/PortfolioRisk";
import AIPortfolioOptimizer from "../components/portfolio/AIPortfolioOptimizer";
import TransactionHistory from "../components/portfolio/TransactionHistory";

export default function Portfolio() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="💼 Portfolio"
        subtitle="Monitor holdings, allocation, performance and AI optimization."
      />

      <PortfolioOverview />

      <PortfolioAllocation />

      <HoldingsTable />

      <PortfolioPerformance />

      <PortfolioRisk />

      <AIPortfolioOptimizer />

      <TransactionHistory />
    </div>
  );
}