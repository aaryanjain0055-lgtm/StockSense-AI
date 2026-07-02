const indicators = [
  {
    name: "RSI (14)",
    value: "63.42",
    signal: "BUY",
    color: "#22c55e",
  },
  {
    name: "MACD",
    value: "1.84",
    signal: "BUY",
    color: "#22c55e",
  },
  {
    name: "20-Day EMA",
    value: "₹3,087",
    signal: "BULLISH",
    color: "#22c55e",
  },
  {
    name: "50-Day EMA",
    value: "₹3,012",
    signal: "BULLISH",
    color: "#22c55e",
  },
  {
    name: "Volume",
    value: "5.62M",
    signal: "HIGH",
    color: "#3b82f6",
  },
  {
    name: "Trend",
    value: "Uptrend",
    signal: "STRONG",
    color: "#22c55e",
  },
];

export default function TechnicalIndicators() {
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
        📊 Technical Indicators
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
        }}
      >
        {indicators.map((item) => (
          <div
            key={item.name}
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              {item.name}
            </p>

            <h3
              style={{
                color: "white",
                marginBottom: 10,
              }}
            >
              {item.value}
            </h3>

            <span
              style={{
                color: item.color,
                fontWeight: "bold",
              }}
            >
              {item.signal}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}