const events = [
  {
    date: "Jul 02",
    time: "10:00 AM",
    event: "RBI Policy Meeting",
    impact: "High",
  },
  {
    date: "Jul 03",
    time: "08:30 AM",
    event: "India Manufacturing PMI",
    impact: "Medium",
  },
  {
    date: "Jul 04",
    time: "06:00 PM",
    event: "US Non-Farm Payrolls",
    impact: "High",
  },
  {
    date: "Jul 05",
    time: "09:00 AM",
    event: "India Services PMI",
    impact: "Low",
  },
];

function impactColor(level: string) {
  switch (level) {
    case "High":
      return "#ef4444";
    case "Medium":
      return "#f59e0b";
    default:
      return "#22c55e";
  }
}

export default function EconomicCalendar() {
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
        📅 Economic Calendar
      </h2>

      {events.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom:
              index === events.length - 1
                ? "none"
                : "1px solid #1e293b",
          }}
        >
          <div>
            <h3
              style={{
                color: "white",
                marginBottom: 4,
              }}
            >
              {item.event}
            </h3>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {item.date} • {item.time}
            </p>
          </div>

          <span
            style={{
              color: impactColor(item.impact),
              fontWeight: "bold",
            }}
          >
            {item.impact}
          </span>
        </div>
      ))}
    </div>
  );
}