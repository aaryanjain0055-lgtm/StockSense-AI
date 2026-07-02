import MetricCard from "../common/MetricCard";

export default function MarketOverview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
      }}
    >
      <MetricCard
        title="NIFTY 50"
        value="25,210"
        color="#22c55e"
      />

      <MetricCard
        title="SENSEX"
        value="82,145"
        color="#22c55e"
      />

      <MetricCard
        title="BANK NIFTY"
        value="57,820"
        color="#3b82f6"
      />

      <MetricCard
        title="GOLD"
        value="₹98,420"
        color="#f59e0b"
      />
    </div>
  );
}