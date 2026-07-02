const stocks = [
  {
    symbol: "RELIANCE",
    price: "₹3,124",
    volume: "5.6M",
    change: "+2.54%",
    positive: true,
  },
  {
    symbol: "TCS",
    price: "₹4,082",
    volume: "2.3M",
    change: "+1.84%",
    positive: true,
  },
  {
    symbol: "INFY",
    price: "₹1,723",
    volume: "4.2M",
    change: "+1.31%",
    positive: true,
  },
  {
    symbol: "SBIN",
    price: "₹864",
    volume: "8.1M",
    change: "-0.72%",
    positive: false,
  },
  {
    symbol: "ITC",
    price: "₹432",
    volume: "9.5M",
    change: "-0.51%",
    positive: false,
  },
];

export default function TrendingStocks() {
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
          marginBottom: 24,
        }}
      >
        🔥 Trending Stocks
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ color: "#94a3b8" }}>
            <th align="left">Symbol</th>
            <th align="left">Price</th>
            <th align="left">Volume</th>
            <th align="left">Change</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              style={{
                borderTop: "1px solid #1e293b",
              }}
            >
              <td
                style={{
                  color: "white",
                  padding: "16px 0",
                  fontWeight: 600,
                }}
              >
                {stock.symbol}
              </td>

              <td style={{ color: "white" }}>
                {stock.price}
              </td>

              <td style={{ color: "#94a3b8" }}>
                {stock.volume}
              </td>

              <td
                style={{
                  color: stock.positive ? "#22c55e" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {stock.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}