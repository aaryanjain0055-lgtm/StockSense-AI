const holdings = [
  {
    symbol: "RELIANCE",
    quantity: 20,
    avgPrice: "₹2,950",
    currentPrice: "₹3,124",
    invested: "₹59,000",
    current: "₹62,480",
    pnl: "+₹3,480",
    positive: true,
  },
  {
    symbol: "TCS",
    quantity: 10,
    avgPrice: "₹3,920",
    currentPrice: "₹4,082",
    invested: "₹39,200",
    current: "₹40,820",
    pnl: "+₹1,620",
    positive: true,
  },
  {
    symbol: "SBIN",
    quantity: 50,
    avgPrice: "₹885",
    currentPrice: "₹864",
    invested: "₹44,250",
    current: "₹43,200",
    pnl: "-₹1,050",
    positive: false,
  },
];

export default function HoldingsTable() {
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
          marginBottom: 20,
        }}
      >
        📋 Portfolio Holdings
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ color: "#94a3b8" }}>
            <th align="left">Stock</th>
            <th align="left">Qty</th>
            <th align="left">Avg Price</th>
            <th align="left">Current</th>
            <th align="left">Invested</th>
            <th align="left">Value</th>
            <th align="left">P/L</th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((stock) => (
            <tr
              key={stock.symbol}
              style={{
                borderTop: "1px solid #1e293b",
              }}
            >
              <td style={{ color: "white", padding: "14px 0" }}>
                {stock.symbol}
              </td>

              <td style={{ color: "white" }}>{stock.quantity}</td>

              <td style={{ color: "white" }}>{stock.avgPrice}</td>

              <td style={{ color: "white" }}>{stock.currentPrice}</td>

              <td style={{ color: "white" }}>{stock.invested}</td>

              <td style={{ color: "white" }}>{stock.current}</td>

              <td
                style={{
                  color: stock.positive ? "#22c55e" : "#ef4444",
                  fontWeight: "bold",
                }}
              >
                {stock.pnl}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}