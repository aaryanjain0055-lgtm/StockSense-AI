import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 950000 },
  { month: "Feb", value: 990000 },
  { month: "Mar", value: 1040000 },
  { month: "Apr", value: 1090000 },
  { month: "May", value: 1160000 },
  { month: "Jun", value: 1248500 },
];

export default function PortfolioChart() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        border: "1px solid #1e293b",
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 24,
        }}
      >
        Portfolio Performance
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid stroke="#334155" />

            <XAxis dataKey="month" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              fill="#2563eb55"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}