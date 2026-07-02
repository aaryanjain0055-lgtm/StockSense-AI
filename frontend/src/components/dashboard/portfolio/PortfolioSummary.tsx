export default function PortfolioSummary() {
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
          fontSize: 22,
          marginBottom: 24,
        }}
      >
        Portfolio Summary
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 20,
        }}
      >
        <div>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            Total Portfolio Value
          </p>

          <h2
            style={{
              color: "white",
              fontSize: 30,
            }}
          >
            ₹12,48,500
          </h2>
        </div>

        <div>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            Today's Gain
          </p>

          <h2
            style={{
              color: "#22c55e",
              fontSize: 30,
            }}
          >
            +₹14,250
          </h2>

          <span
            style={{
              color: "#22c55e",
            }}
          >
            +1.16%
          </span>
        </div>

        <div>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            Total Profit
          </p>

          <h2
            style={{
              color: "#22c55e",
              fontSize: 24,
            }}
          >
            +₹2,48,500
          </h2>
        </div>

        <div>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: 8,
            }}
          >
            Holdings
          </p>

          <h2
            style={{
              color: "white",
              fontSize: 24,
            }}
          >
            12 Stocks
          </h2>
        </div>
      </div>
    </div>
  );
}