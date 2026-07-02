export default function AIPortfolioOptimizer() {
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
        🤖 AI Portfolio Optimizer
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <Card title="Portfolio Health" value="91 / 100" color="#22c55e" />

        <Card title="Risk Score" value="Moderate" color="#f59e0b" />

        <Card title="Expected Return" value="+11.8%" color="#3b82f6" />

        <Card title="Diversification" value="Good" color="#22c55e" />
      </div>

      <div
        style={{
          background: "#1e293b",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3
          style={{
            color: "white",
            marginBottom: 16,
          }}
        >
          AI Suggestions
        </h3>

        <ul
          style={{
            color: "#cbd5e1",
            lineHeight: 2,
            paddingLeft: 20,
          }}
        >
          <li>Increase Healthcare allocation by 5–8%.</li>
          <li>Reduce Banking exposure slightly to improve diversification.</li>
          <li>Add one defensive FMCG stock to reduce portfolio volatility.</li>
          <li>Continue holding RELIANCE as momentum remains positive.</li>
          <li>Review SBIN if downside continues over the next week.</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: 20,
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
          AI Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Your portfolio is well balanced overall with healthy growth potential.
          Minor sector rebalancing could improve diversification while reducing
          overall portfolio risk without significantly affecting expected returns.
        </p>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
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
        {title}
      </p>

      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}