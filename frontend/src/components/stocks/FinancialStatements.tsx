const financialData = [
  {
    title: "Revenue",
    value: "₹10.45 L Cr",
  },
  {
    title: "Net Profit",
    value: "₹82,312 Cr",
  },
  {
    title: "Operating Margin",
    value: "17.4%",
  },
  {
    title: "ROE",
    value: "14.8%",
  },
  {
    title: "Debt to Equity",
    value: "0.38",
  },
  {
    title: "Book Value",
    value: "₹1,486",
  },
];

export default function FinancialStatements() {
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
        📑 Financial Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        {financialData.map((item) => (
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
                color: "white",
              }}
            >
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}