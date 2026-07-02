const highlights = [
  {
    title: "Market Trend",
    value: "Bullish",
    color: "#22c55e",
  },
  {
    title: "NIFTY Outlook",
    value: "+0.8%",
    color: "#22c55e",
  },
  {
    title: "Top Sector",
    value: "Information Technology",
    color: "#3b82f6",
  },
  {
    title: "Market Sentiment",
    value: "Positive",
    color: "#22c55e",
  },
];

export default function DailyMarketBrief() {
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
        📅 Daily AI Market Brief
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
        }}
      >
        {highlights.map((item) => (
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
            marginBottom: 14,
          }}
        >
          🤖 Today's AI Market Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Today's market is expected to open with positive momentum supported by
          strong global cues and improving investor sentiment. Information
          Technology and Energy sectors are showing relative strength, while
          banking stocks may remain volatile. Overall, the AI model suggests a
          cautiously optimistic outlook for today's trading session.
        </p>
      </div>
    </div>
  );
}