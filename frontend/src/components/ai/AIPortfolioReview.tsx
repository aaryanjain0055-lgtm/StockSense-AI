const review = [
  {
    title: "Portfolio Health",
    value: "91 / 100",
    color: "#22c55e",
  },
  {
    title: "Expected Return",
    value: "+11.8%",
    color: "#22c55e",
  },
  {
    title: "Risk Level",
    value: "Moderate",
    color: "#f59e0b",
  },
  {
    title: "Diversification",
    value: "Good",
    color: "#3b82f6",
  },
];

export default function AIPortfolioReview() {
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
        📊 AI Portfolio Review
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
        }}
      >
        {review.map((item) => (
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
          🤖 AI Portfolio Insights
        </h3>

        <ul
          style={{
            color: "#cbd5e1",
            lineHeight: 2,
            paddingLeft: 20,
          }}
        >
          <li>Your portfolio is outperforming the benchmark.</li>
          <li>Technology and Energy sectors are driving returns.</li>
          <li>Healthcare allocation can be increased for better balance.</li>
          <li>Current portfolio risk is within acceptable limits.</li>
          <li>Overall investment strategy remains positive.</li>
        </ul>
      </div>
    </div>
  );
}