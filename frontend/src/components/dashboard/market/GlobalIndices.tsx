const globalMarkets = [
  {
    name: "NASDAQ",
    country: "USA",
    value: "19,742",
    change: "+1.24%",
    positive: true,
  },
  {
    name: "S&P 500",
    country: "USA",
    value: "6,182",
    change: "+0.92%",
    positive: true,
  },
  {
    name: "DOW JONES",
    country: "USA",
    value: "44,385",
    change: "-0.41%",
    positive: false,
  },
  {
    name: "NIKKEI 225",
    country: "Japan",
    value: "40,810",
    change: "+0.76%",
    positive: true,
  },
  {
    name: "FTSE 100",
    country: "UK",
    value: "8,926",
    change: "-0.18%",
    positive: false,
  },
  {
    name: "DAX",
    country: "Germany",
    value: "24,120",
    change: "+0.64%",
    positive: true,
  },
];

export default function GlobalIndices() {
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
        🌍 Global Indices
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
        }}
      >
        {globalMarkets.map((market) => (
          <div
            key={market.name}
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {market.name}
              </h3>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                {market.country}
              </p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {market.value}
              </div>

              <div
                style={{
                  color: market.positive ? "#22c55e" : "#ef4444",
                  marginTop: 4,
                }}
              >
                {market.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}