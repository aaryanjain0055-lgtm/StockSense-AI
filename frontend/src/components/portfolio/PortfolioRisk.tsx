const riskMetrics = [
  {
    title: "Diversification Score",
    value: "86 / 100",
    color: "#22c55e",
  },
  {
    title: "Risk Level",
    value: "Moderate",
    color: "#f59e0b",
  },
  {
    title: "Largest Holding",
    value: "RELIANCE (24%)",
    color: "#3b82f6",
  },
  {
    title: "Portfolio Beta",
    value: "1.08",
    color: "#ffffff",
  },
];

export default function PortfolioRisk() {
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
        ⚖️ Portfolio Diversification & Risk
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
        }}
      >
        {riskMetrics.map((item) => (
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

            <h3 style={{ color: item.color }}>
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
            marginBottom: 12,
          }}
        >
          Portfolio Insights
        </h3>

        <ul
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
            paddingLeft: 20,
          }}
        >
          <li>Your portfolio is reasonably diversified across sectors.</li>
          <li>Banking and IT have the highest allocation.</li>
          <li>Healthcare exposure is relatively low.</li>
          <li>Risk level is moderate based on historical volatility.</li>
        </ul>
      </div>
    </div>
  );
}
