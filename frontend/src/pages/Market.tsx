import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";

import MarketIndices from "../components/dashboard/market/MarketIndices";
import SectorPerformance from "../components/dashboard/market/SectorPerformance";
import TopMovers from "../components/dashboard/market/TopMovers";

export default function Market() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="📈 Market Analysis"
        subtitle="Live market indices, sector performance and top movers."
      />

      <SearchBar placeholder="Search stocks..." />

      <MarketIndices />

      <SectorPerformance />

      <TopMovers />
    </div>
  );
}