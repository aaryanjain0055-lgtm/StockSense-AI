export default function AIInsight() {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        🤖 AI Investment Suggestions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: 18,
            borderRadius: 12,
          }}
        >
          <h3 style={{ color: "#22c55e" }}>BUY</h3>

          <h2 style={{ color: "white", margin: "10px 0" }}>
            RELIANCE
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Strong momentum with positive earnings outlook.
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: 18,
            borderRadius: 12,
          }}
        >
          <h3 style={{ color: "#f59e0b" }}>HOLD</h3>

          <h2 style={{ color: "white", margin: "10px 0" }}>
            TCS
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Stable trend with moderate upside potential.
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: 18,
            borderRadius: 12,
          }}
        >
          <h3 style={{ color: "#ef4444" }}>SELL</h3>

          <h2 style={{ color: "white", margin: "10px 0" }}>
            ADANIENT
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Weak momentum and increased downside risk.
          </p>
        </div>
      </div>
    </div>
  );
}