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
  {
    day: "Mon",
    actual: 3020,
    predicted: 3025,
  },
  {
    day: "Tue",
    actual: 3045,
    predicted: 3040,
  },
  {
    day: "Wed",
    actual: 3060,
    predicted: 3068,
  },
  {
    day: "Thu",
    actual: 3090,
    predicted: 3095,
  },
  {
    day: "Fri",
    actual: 3124,
    predicted: 3168,
  },
];

export default function PredictionChart() {
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
        📈 Historical vs Predicted Price
      </h2>

      <div style={{ width: "100%", height: 380 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip />

            <Legend />

            <Line
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={3}
              name="Actual"
            />

            <Line
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeDasharray="6 6"
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}