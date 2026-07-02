const strategies = [
  {
    title: "Investment Style",
    value: "Growth Investing",
    color: "#22c55e",
  },
  {
    title: "Investment Horizon",
    value: "6 - 12 Months",
    color: "#3b82f6",
  },
  {
    title: "Recommended Cash",
    value: "15%",
    color: "#f59e0b",
  },
  {
    title: "Risk Profile",
    value: "Moderate",
    color: "#ef4444",
  },
];

export default function AIStrategyGenerator() {
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
        🎯 AI Investment Strategy
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
        }}
      >
        {strategies.map((item) => (
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
          🤖 AI Strategy Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Based on your current portfolio, market outlook and machine learning
          predictions, the recommended strategy is to maintain a growth-focused
          portfolio while keeping approximately 15% cash available for new
          opportunities. Increase exposure to technology and healthcare sectors,
          maintain existing energy holdings and avoid over-concentration in any
          single stock.
        </p>
      </div>
    </div>
  );
}