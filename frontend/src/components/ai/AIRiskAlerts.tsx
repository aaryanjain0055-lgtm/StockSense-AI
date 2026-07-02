const alerts = [
  {
    level: "HIGH",
    title: "SBIN volatility increased",
    action: "Consider reducing exposure.",
    color: "#ef4444",
  },
  {
    level: "MEDIUM",
    title: "Banking sector sentiment weakening",
    action: "Monitor closely over the next few sessions.",
    color: "#f59e0b",
  },
  {
    level: "LOW",
    title: "Reliance remains fundamentally strong",
    action: "Current position can be maintained.",
    color: "#22c55e",
  },
];

export default function AIRiskAlerts() {
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
        🚨 AI Risk Alert Center
      </h2>

      {alerts.map((alert, index) => (
        <div
          key={index}
          style={{
            background: "#1e293b",
            borderLeft: `5px solid ${alert.color}`,
            borderRadius: 12,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3 style={{ color: "white" }}>
              {alert.title}
            </h3>

            <span
              style={{
                color: alert.color,
                fontWeight: "bold",
              }}
            >
              {alert.level}
            </span>
          </div>

          <p
            style={{
              color: "#cbd5e1",
            }}
          >
            {alert.action}
          </p>
        </div>
      ))}

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
          🤖 AI Risk Summary
        </h3>

        <p
          style={{
            color: "#cbd5e1",
            lineHeight: 1.8,
          }}
        >
          Overall portfolio risk remains within acceptable limits. Current
          alerts suggest monitoring the banking sector for short-term
          volatility while maintaining exposure to fundamentally strong
          companies. No critical portfolio-wide action is required at this
          time.
        </p>
      </div>
    </div>
  );
}