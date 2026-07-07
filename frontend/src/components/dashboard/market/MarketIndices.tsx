import { useEffect, useState } from "react";
import MetricCard from "../../common/MetricCard";
import { getDashboard } from "../../../services/marketService";

type IndexData = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
};

export default function MarketIndices() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setIndices(data.indices);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ color: "white" }}>Loading market indices...</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
      }}
    >
      {indices.map((index) => (
        <MetricCard
          key={index.symbol}
          title={index.name}
          value={`${index.price.toLocaleString()} (${index.change >= 0 ? "+" : ""}${index.change_percent}%)`}
          color={index.change >= 0 ? "#22c55e" : "#ef4444"}
        />
      ))}
    </div>
  );
}