import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", portfolio: 900000, benchmark: 890000 },
  { month: "Feb", portfolio: 940000, benchmark: 915000 },
  { month: "Mar", portfolio: 980000, benchmark: 950000 },
  { month: "Apr", portfolio: 1050000, benchmark: 1010000 },
  { month: "May", portfolio: 1140000, benchmark: 1095000 },
  { month: "Jun", portfolio: 1248500, benchmark: 1180000 },
];

export default function PortfolioPerformance() {
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
        📈 Portfolio Performance
      </h2>

      <div
        style={{
          width: "100%",
          height: 350,
        }}
      >
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Legend />

            <Line
              dataKey="portfolio"
              stroke="#22c55e"
              strokeWidth={3}
              name="Portfolio"
            />

            <Line
              dataKey="benchmark"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="5 5"
              name="NIFTY 50"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 18,
          marginTop: 24,
        }}
      >
        <Metric title="Portfolio Return" value="+24.8%" color="#22c55e" />
        <Metric title="Benchmark Return" value="+18.0%" color="#3b82f6" />
        <Metric title="Best Performer" value="RELIANCE" color="#22c55e" />
        <Metric title="Worst Performer" value="SBIN" color="#ef4444" />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
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