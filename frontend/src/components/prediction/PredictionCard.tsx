export default function PredictionCard() {
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
        🤖 ML Prediction Result
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
        }}
      >
        <Metric title="Predicted Price" value="₹3,168.25" color="#ffffff" />

        <Metric title="Expected Change" value="+1.40%" color="#22c55e" />

        <Metric title="Confidence" value="92%" color="#3b82f6" />

        <Metric title="Recommendation" value="BUY" color="#22c55e" />
      </div>

      <div
        style={{
          marginTop: 30,
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
          Model Explanation
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          The prediction indicates a bullish movement based on historical prices,
          moving averages and momentum indicators.
        </p>
      </div>
    </div>
  );
}

function Metric({
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
        padding: 20,
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
          fontSize: 28,
        }}
      >
        {value}
      </h2>
    </div>
  );
}