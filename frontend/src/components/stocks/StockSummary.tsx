import MetricCard from "../common/MetricCard";

export default function StockSummary() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
      }}
    >
      <MetricCard
        title="Listed Stocks"
        value="5,284"
        color="#3b82f6"
      />

      <MetricCard
        title="Top Gainers"
        value="342"
        color="#22c55e"
      />

      <MetricCard
        title="Top Losers"
        value="198"
        color="#ef4444"
      />

      <MetricCard
        title="Avg Volume"
        value="12.4M"
        color="#f59e0b"
      />
    </div>
  );
}