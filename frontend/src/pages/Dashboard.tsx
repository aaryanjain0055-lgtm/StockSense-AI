import Hero from "../components/dashboard/Hero";
import MarketOverview from "../components/dashboard/MarketOverview";
import TopMovers from "../components/dashboard/market/TopMovers";

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <Hero />

      <MarketOverview />

      <TopMovers />
    </div>
  );
}