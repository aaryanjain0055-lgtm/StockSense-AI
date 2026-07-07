import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  TrendingUp,
} from "lucide-react";

type Props = {
  symbol: string;
};

export default function StockOverview({
  symbol,
}: Props) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: "#1e293b",
            }}
          >
            <Building2
              size={26}
              color="#60a5fa"
            />
          </div>

          <div>
            <p
              style={{
                margin: 0,
                marginBottom: 6,
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Selected Stock
            </p>

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: 24,
              }}
            >
              {symbol}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <OverviewMetric
            label="Market"
            value={
              symbol.endsWith(".NS")
                ? "NSE"
                : symbol.endsWith(".BO")
                  ? "BSE"
                  : "GLOBAL"
            }
          />

          <OverviewMetric
            label="Analysis"
            value="Active"
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid #1e293b",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <InfoCard
          icon={
            <TrendingUp
              size={18}
              color="#60a5fa"
            />
          }
          title="Live Analysis"
          description="Market and analytical data for the selected stock."
        />

        <InfoCard
          icon={
            <ArrowUpRight
              size={18}
              color="#22c55e"
            />
          }
          title="Bullish Factors"
          description="Positive signals are evaluated across multiple factors."
        />

        <InfoCard
          icon={
            <ArrowDownRight
              size={18}
              color="#ef4444"
            />
          }
          title="Risk Factors"
          description="Technical weakness and model reliability are monitored."
        />
      </div>
    </div>
  );
}

type OverviewMetricProps = {
  label: string;
  value: string;
};

function OverviewMetric({
  label,
  value,
}: OverviewMetricProps) {
  return (
    <div
      style={{
        minWidth: 110,
        padding: "10px 14px",
        background: "#1e293b",
        borderRadius: 10,
      }}
    >
      <p
        style={{
          margin: 0,
          marginBottom: 5,
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color: "#f8fafc",
          fontSize: 14,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function InfoCard({
  icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "#0f172a",
        border: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        {icon}

        <strong
          style={{
            color: "#ffffff",
            fontSize: 14,
          }}
        >
          {title}
        </strong>
      </div>

      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}