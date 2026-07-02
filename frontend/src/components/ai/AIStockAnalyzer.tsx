const analysis = [
  {
    title: "Trend",
    value: "Bullish",
    color: "#22c55e",
  },
  {
    title: "ML Prediction",
    value: "BUY",
    color: "#22c55e",
  },
  {
    title: "Confidence",
    value: "92%",
    color: "#3b82f6",
  },
  {
    title: "News Sentiment",
    value: "Positive",
    color: "#22c55e",
  },
  {
    title: "Risk",
    value: "Moderate",
    color: "#f59e0b",
  },
  {
    title: "Expected Return",
    value: "+4.8%",
    color: "#22c55e",
  },
];

export default function AIStockAnalyzer() {
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
        📊 AI Stock Analysis
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        {analysis.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <p
              style={{
                color: "#94a3b8",
                marginBottom: 10,
              }}
            >
              {item.title}
            </p>

            <h3
              style={{
                color: item.color,
              }}
            >
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          background: "#1e293b",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3
          style={{
            color: "white",
            marginBottom: 14,
          }}
        >
          AI Analysis Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Based on historical price data, technical indicators, prediction
          confidence and recent news sentiment, the AI identifies a bullish
          outlook for the selected stock. Positive momentum and healthy trading
          volume support the current BUY recommendation, while investors should
          continue monitoring quarterly earnings and broader market conditions.
        </p>
      </div>
    </div>
  );
}