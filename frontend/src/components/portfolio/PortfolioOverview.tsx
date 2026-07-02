const portfolio = [
  {
    title: "Portfolio Value",
    value: "₹12,48,500",
    color: "#ffffff",
  },
  {
    title: "Today's Gain",
    value: "+₹18,420",
    color: "#22c55e",
  },
  {
    title: "Overall Profit",
    value: "+₹2,16,320",
    color: "#22c55e",
  },
  {
    title: "Holdings",
    value: "12",
    color: "#3b82f6",
  },
];

export default function PortfolioOverview() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 20,
      }}
    >
      {portfolio.map((item) => (
        <div
          key={item.title}
          style={{
            background: "#111827",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              marginBottom: 12,
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
  );
}