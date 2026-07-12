import { useEffect, useState } from "react";
import MetricCard from "../common/MetricCard";
import { getDashboard } from "../../services/marketService";

type IndexData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
};

export default function MarketOverview() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      setIndices(data.indices || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  loadDashboard();

  // Refresh every 60 seconds
  const interval = setInterval(loadDashboard, 60000);

  return () => clearInterval(interval);
}, []);

  

  if (loading) {
    return (
      <div style={{ color: "white" }}>
        Loading Market...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
      }}
    >
      {indices.map((item) => (
        <MetricCard
          key={item.symbol}
          title={item.name}
          value={`${item.price.toLocaleString()} (${item.change >= 0 ? "+" : ""}${item.change_percent.toFixed(2)}%)`}
          color={item.change >= 0 ? "#22c55e" : "#ef4444"}
        />
      ))}
    </div>
  );
}