import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
} from "lucide-react";

import type {
  ProductionPredictionResponse,
  RiskFlag,
} from "../../services/predictionService";


type Props = {
  prediction: ProductionPredictionResponse;
};


function getRiskStyle(level: string) {
  const normalizedLevel = level.toUpperCase();

  if (
    normalizedLevel === "CRITICAL" ||
    normalizedLevel === "HIGH"
  ) {
    return {
      color: "#ef4444",
      background: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.25)",
      icon: <ShieldAlert size={21} />,
    };
  }

  if (
    normalizedLevel === "WARNING" ||
    normalizedLevel === "MEDIUM"
  ) {
    return {
      color: "#f59e0b",
      background: "rgba(245, 158, 11, 0.08)",
      border: "rgba(245, 158, 11, 0.25)",
      icon: <AlertTriangle size={21} />,
    };
  }

  if (normalizedLevel === "IMPORTANT") {
    return {
      color: "#60a5fa",
      background: "rgba(59, 130, 246, 0.08)",
      border: "rgba(59, 130, 246, 0.25)",
      icon: <Info size={21} />,
    };
  }

  return {
    color: "#22c55e",
    background: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.25)",
    icon: <ShieldCheck size={21} />,
  };
}


function RiskFlagCard({
  flag,
}: {
  flag: RiskFlag;
}) {
  const style = getRiskStyle(flag.level);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: 17,
        borderRadius: 12,
        background: style.background,
        border: `1px solid ${style.border}`,
      }}
    >
      <div
        style={{
          color: style.color,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {style.icon}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 7,
          }}
        >
          <strong
            style={{
              color: style.color,
              fontSize: 13,
            }}
          >
            {flag.level}
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: 12,
            }}
          >
            {flag.category}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {flag.message}
        </p>
      </div>
    </div>
  );
}


export default function RiskAnalysis({
  prediction,
}: Props) {
  const riskFlags = prediction.risk_flags ?? [];

  const technical =
    prediction.factor_scores.technical;

  const governance =
    prediction.model_governance;

  return (
    <section
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
          gap: 12,
          marginBottom: 8,
        }}
      >
        <ShieldAlert
          size={24}
          color="#f59e0b"
        />

        <h2
          style={{
            margin: 0,
            color: "#f8fafc",
            fontSize: 21,
          }}
        >
          Risk Analysis
        </h2>
      </div>

      <p
        style={{
          margin: "0 0 24px 0",
          color: "#94a3b8",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        Current technical risks and model
        reliability warnings detected by the
        production analysis system.
      </p>


      {riskFlags.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 13,
          }}
        >
          {riskFlags.map(
            (flag: RiskFlag, index: number) => (
              <RiskFlagCard
                key={`${flag.category}-${index}`}
                flag={flag}
              />
            ),
          )}
        </div>
      ) : (
        <div
          style={{
            padding: 18,
            borderRadius: 12,
            background:
              "rgba(34, 197, 94, 0.07)",
            border:
              "1px solid rgba(34, 197, 94, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <ShieldCheck
            size={22}
            color="#22c55e"
          />

          <span
            style={{
              color: "#cbd5e1",
            }}
          >
            No major risk flags are currently
            reported.
          </span>
        </div>
      )}


      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 17,
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Technical Score
          </p>

          <strong
            style={{
              color:
                technical.score >= 60
                  ? "#22c55e"
                  : technical.score >= 45
                    ? "#f59e0b"
                    : "#ef4444",
              fontSize: 24,
            }}
          >
            {technical.score.toFixed(1)}/100
          </strong>
        </div>


        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 17,
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Current Trend
          </p>

          <strong
            style={{
              color: "#f59e0b",
              fontSize: 18,
            }}
          >
            {technical.details?.trend ??
              "NOT AVAILABLE"}
          </strong>
        </div>


        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: 17,
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Signal Confidence
          </p>

          <strong
            style={{
              color: "#60a5fa",
              fontSize: 18,
            }}
          >
            {
              prediction.production_signal
                .confidence
            }
          </strong>
        </div>
      </div>


      <div
        style={{
          marginTop: 22,
          padding: 18,
          borderRadius: 12,
          background:
            "rgba(139, 92, 246, 0.06)",
          border:
            "1px solid rgba(139, 92, 246, 0.2)",
        }}
      >
        <h3
          style={{
            margin: "0 0 12px 0",
            color: "#c4b5fd",
            fontSize: 15,
          }}
        >
          Model Governance
        </h3>

        <p
          style={{
            margin: "0 0 10px 0",
            color: "#cbd5e1",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          Production mode:{" "}
          <strong>
            {governance.production_mode}
          </strong>
        </p>

        <p
          style={{
            margin: 0,
            color: "#94a3b8",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          {governance.reason}
        </p>
      </div>
    </section>
  );
}