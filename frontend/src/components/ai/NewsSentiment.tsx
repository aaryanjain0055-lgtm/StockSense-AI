const news = [
  {
    headline: "Reliance announces major renewable energy expansion",
    sentiment: "Positive",
    score: "91%",
    color: "#22c55e",
  },
  {
    headline: "IT sector remains stable despite global uncertainty",
    sentiment: "Neutral",
    score: "67%",
    color: "#f59e0b",
  },
  {
    headline: "Banking stocks witness profit booking",
    sentiment: "Negative",
    score: "74%",
    color: "#ef4444",
  },
];

export default function NewsSentiment() {
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
        📰 News Sentiment Dashboard
      </h2>

      {news.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#1e293b",
            borderRadius: 12,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              color: "white",
              marginBottom: 10,
            }}
          >
            {item.headline}
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: item.color,
                fontWeight: "bold",
              }}
            >
              {item.sentiment}
            </span>

            <span
              style={{
                color: "#94a3b8",
              }}
            >
              Confidence: {item.score}
            </span>
          </div>
        </div>
      ))}

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
          🤖 AI Market Sentiment Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Overall market sentiment is currently positive. Energy and large-cap
          companies continue to receive favorable news coverage, while banking
          stocks show short-term weakness due to profit booking. The AI
          estimates an overall positive sentiment score for the market.
        </p>
      </div>
    </div>
  );
}