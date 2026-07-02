import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", price: 3025 },
  { day: "Tue", price: 3068 },
  { day: "Wed", price: 3055 },
  { day: "Thu", price: 3092 },
  { day: "Fri", price: 3124 },
];

export default function StockPriceChart() {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 16,
        border: "1px solid #1e293b",
        padding: 24,
      }}
    >
      <h2
        style={{
          color: "white",
          marginBottom: 20,
        }}
      >
        📈 Weekly Price Trend
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
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}