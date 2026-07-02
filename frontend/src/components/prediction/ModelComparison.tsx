const models = [
  {
    model: "LSTM",
    accuracy: "94.2%",
    mae: "1.84",
    rmse: "2.63",
    status: "Best",
  },
  {
    model: "XGBoost",
    accuracy: "92.8%",
    mae: "2.05",
    rmse: "2.91",
    status: "Good",
  },
  {
    model: "Random Forest",
    accuracy: "90.6%",
    mae: "2.42",
    rmse: "3.18",
    status: "Average",
  },
  {
    model: "Prophet",
    accuracy: "88.9%",
    mae: "2.78",
    rmse: "3.64",
    status: "Baseline",
  },
];

export default function ModelComparison() {
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
          marginBottom: 20,
        }}
      >
        🧠 Model Comparison
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ color: "#94a3b8" }}>
            <th align="left">Model</th>
            <th align="left">Accuracy</th>
            <th align="left">MAE</th>
            <th align="left">RMSE</th>
            <th align="left">Status</th>
          </tr>
        </thead>

        <tbody>
          {models.map((item) => (
            <tr
              key={item.model}
              style={{
                borderTop: "1px solid #1e293b",
              }}
            >
              <td style={{ color: "white", padding: "14px 0" }}>
                {item.model}
              </td>

              <td style={{ color: "#22c55e" }}>
                {item.accuracy}
              </td>

              <td style={{ color: "white" }}>
                {item.mae}
              </td>

              <td style={{ color: "white" }}>
                {item.rmse}
              </td>

              <td style={{ color: "#3b82f6" }}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}