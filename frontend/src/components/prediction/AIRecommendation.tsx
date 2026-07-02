export default function AIRecommendation() {
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
        🤖 AI Investment Recommendation
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
          marginBottom: 24,
        }}
      >
        <Card title="Recommendation" value="BUY" color="#22c55e" />

        <Card title="Confidence" value="92%" color="#3b82f6" />

        <Card title="Expected Return" value="+4.8%" color="#22c55e" />

        <Card title="Risk Level" value="LOW" color="#f59e0b" />
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
            marginBottom: 14,
          }}
        >
          AI Analysis
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Based on historical price patterns, technical indicators,
          prediction confidence and overall market sentiment, the AI
          recommends a <strong>BUY</strong> position.
        </p>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
            marginTop: 16,
          }}
        >
          Positive momentum, improving volume profile and strong model
          confidence indicate potential upside during the next trading
          sessions. Investors should still consider their personal
          risk tolerance before investing.
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
        padding: 18,
        borderRadius: 12,
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

      <h2
        style={{
          color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}