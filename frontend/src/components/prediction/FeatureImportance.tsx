const features = [
  {
    feature: "Previous Closing Price",
    importance: 92,
  },
  {
    feature: "20-Day EMA",
    importance: 86,
  },
  {
    feature: "RSI (14)",
    importance: 79,
  },
  {
    feature: "Trading Volume",
    importance: 74,
  },
  {
    feature: "MACD",
    importance: 67,
  },
  {
    feature: "News Sentiment",
    importance: 58,
  },
];

export default function FeatureImportance() {
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
        📊 Feature Importance
      </h2>

      {features.map((item) => (
        <div
          key={item.feature}
          style={{
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "white",
              marginBottom: 8,
            }}
          >
            <span>{item.feature}</span>

            <span>{item.importance}%</span>
          </div>

          <div
            style={{
              width: "100%",
              height: 10,
              background: "#1e293b",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: `${item.importance}%`,
                height: "100%",
                borderRadius: 10,
                background: "#3b82f6",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}