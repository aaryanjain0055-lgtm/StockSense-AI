import { useEffect, useState } from "react";
import { getQuote } from "../../services/marketService";
type Quote = {
  symbol: string;
  company_name: string;
  current_price: number;
  previous_close: number;
  open_price: number;
  day_high: number;
  day_low: number;
  volume: number;
  currency: string;
};

export default function StockOverview() {
  const [stock, setStock] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuote("RELIANCE.NS")
      .then((data: Quote) => {
        console.log("Stock Data:", data);
        setStock(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 24,
          color: "white",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!stock) {
    return (
      <div
        style={{
          background: "#111827",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 24,
          color: "red",
        }}
      >
        Failed to load stock.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          fontSize: 28,
          marginBottom: 8,
        }}
      >
        {stock.company_name}
      </h2>

      <p
        style={{
          color: "#22c55e",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 24,
        }}
      >
        ₹ {stock.current_price}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
        <InfoCard title="Previous Close" value={stock.previous_close.toString()} />
        <InfoCard title="Open" value={stock.open_price.toString()} />
        <InfoCard title="Day High" value={stock.day_high.toString()} />
        <InfoCard title="Day Low" value={stock.day_low.toString()} />
        <InfoCard title="Volume" value={stock.volume.toLocaleString()} />
        <InfoCard title="Currency" value={stock.currency} />
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: 18,
        borderRadius: 12,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: 8,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          color: "white",
        }}
      >
        {value}
      </h3>
    </div>
  );
}