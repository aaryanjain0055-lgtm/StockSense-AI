interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  positive = true,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 14,
        padding: 20,
        border: "1px solid #1e293b",
        flex: 1,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          color: "white",
          fontSize: 28,
          marginBottom: 8,
        }}
      >
        {value}
      </h2>

      <span
        style={{
          color: positive ? "#22c55e" : "#ef4444",
          fontWeight: 600,
        }}
      >
        {change}
      </span>
    </div>
  );
}