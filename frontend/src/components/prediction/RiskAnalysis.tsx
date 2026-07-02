const metrics = [
  {
    title: "Risk Level",
    value: "LOW",
    color: "#22c55e",
  },
  {
    title: "Volatility",
    value: "12.8%",
    color: "#3b82f6",
  },
  {
    title: "Sharpe Ratio",
    value: "1.92",
    color: "#f59e0b",
  },
  {
    title: "Maximum Drawdown",
    value: "-6.4%",
    color: "#ef4444",
  },
  {
    title: "Suggested Position",
    value: "15%",
    color: "#22c55e",
  },
  {
    title: "Risk Score",
    value: "24 / 100",
    color: "#22c55e",
  },
];

export default function RiskAnalysis() {
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
        ⚠️ Risk Analysis
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        {metrics.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#1e293b",
              borderRadius: 12,
              padding: 20,
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

            <h2
              style={{
                color: item.color,
              }}
            >
              {item.value}
            </h2>
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
            marginBottom: 12,
          }}
        >
          AI Risk Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Based on historical volatility, trend strength and technical
          indicators, the current investment risk appears to be low.
          Price momentum remains positive while downside volatility is
          limited under current market conditions.
        </p>
      </div>
    </div>
  );
}