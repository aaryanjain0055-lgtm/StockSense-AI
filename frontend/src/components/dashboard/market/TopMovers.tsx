import { useEffect, useState } from "react";
import {
  getTopGainers,
  getTopLosers,
} from "../../../services/marketService";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
};

function Card({
  title,
  data,
  positive,
}: {
  title: string;
  data: Stock[];
  positive: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#111827",
        borderRadius: 16,
        border: "1px solid #1e293b",
        padding: 20,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        {title}
      </h2>

      {data.map((stock) => (
        <div
          key={stock.symbol}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 0",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div>
            <div
              style={{
                color: "white",
                fontWeight: 600,
              }}
            >
              {stock.name}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              ₹ {stock.price.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <div
              style={{
                color: positive ? "#22c55e" : "#ef4444",
                fontWeight: 700,
              }}
            >
              {positive ? "▲" : "▼"} {stock.change_percent.toFixed(2)}%
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              {stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopMovers() {
  const [gainers, setGainers] = useState<Stock[]>([]);
  const [losers, setLosers] = useState<Stock[]>([]);

  useEffect(() => {
    getTopGainers().then(setGainers).catch(console.error);
    getTopLosers().then(setLosers).catch(console.error);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 24,
      }}
    >
      <Card
        title="📈 Top Gainers"
        data={gainers}
        positive={true}
      />

      <Card
        title="📉 Top Losers"
        data={losers}
        positive={false}
      />
    </div>
  );
}