type Props = {
  title: string;
  value: string;
  color?: string;
};

export default function MetricCard({
  title,
  value,
  color = "white",
}: Props) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: 18,
        borderRadius: 12,
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          marginBottom: 10,
        }}
      >
        {title}
      </p>

      <h3
        style={{
          color,
        }}
      >
        {value}
      </h3>
    </div>
  );
}