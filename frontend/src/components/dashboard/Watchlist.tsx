const watchlist = [
  {
    symbol: "RELIANCE",
    price: "₹3,124",
    change: "+2.54%",
    positive: true,
  },
  {
    symbol: "TCS",
    price: "₹4,082",
    change: "+1.84%",
    positive: true,
  },
  {
    symbol: "INFY",
    price: "₹1,723",
    change: "+0.92%",
    positive: true,
  },
  {
    symbol: "SBIN",
    price: "₹864",
    change: "-0.72%",
    positive: false,
  },
  {
    symbol: "ITC",
    price: "₹432",
    change: "-0.51%",
    positive: false,
  },
];

export default function Watchlist() {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        ⭐ Watchlist
      </h2>

      {watchlist.map((stock) => (
        <div
          key={stock.symbol}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 0",
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
              {stock.symbol}
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {stock.price}
            </div>
          </div>

          <div
            style={{
              color: stock.positive ? "#22c55e" : "#ef4444",
              fontWeight: "bold",
            }}
          >
            {stock.change}
          </div>
        </div>
      ))}
    </div>
  );
}