const metrics = [
  {
    title: "Model Accuracy",
    value: "94.2%",
    color: "#22c55e",
  },
  {
    title: "MAE",
    value: "1.84",
    color: "#3b82f6",
  },
  {
    title: "RMSE",
    value: "2.63",
    color: "#f59e0b",
  },
  {
    title: "MAPE",
    value: "3.12%",
    color: "#ef4444",
  },
  {
    title: "R² Score",
    value: "0.95",
    color: "#22c55e",
  },
  {
    title: "Best Model",
    value: "LSTM",
    color: "#a855f7",
  },
];

export default function HistoricalAccuracy() {
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
        📊 Historical Model Performance
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
          Performance Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Historical backtesting shows that the LSTM model consistently
          outperforms the other models with the highest accuracy and
          lowest prediction error across previous market data.
        </p>
      </div>
    </div>
  );
}