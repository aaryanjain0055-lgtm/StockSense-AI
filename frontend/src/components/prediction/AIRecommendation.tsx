import {
  BrainCircuit,
  CheckCircle2,
  Info,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type {
  ProductionPredictionResponse,
} from "../../services/predictionService";


type Props = {
  prediction: ProductionPredictionResponse;
};


function getSignalStyle(signal: string) {
  const normalized = signal.toUpperCase();

  if (
    normalized.includes("POSITIVE") ||
    normalized.includes("BUY") ||
    normalized.includes("BULLISH")
  ) {
    return {
      color: "#22c55e",
      background: "rgba(34, 197, 94, 0.08)",
      border: "rgba(34, 197, 94, 0.24)",
      icon: <TrendingUp size={24} />,
    };
  }

  if (
    normalized.includes("NEGATIVE") ||
    normalized.includes("SELL") ||
    normalized.includes("BEARISH")
  ) {
    return {
      color: "#ef4444",
      background: "rgba(239, 68, 68, 0.08)",
      border: "rgba(239, 68, 68, 0.24)",
      icon: <TrendingDown size={24} />,
    };
  }

  return {
    color: "#f59e0b",
    background: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.24)",
    icon: <Target size={24} />,
  };
}


export default function AIRecommendation({
  prediction,
}: Props) {
  const {
    production_signal,
    factor_agreement,
    explanation,
    model_governance,
    methodology,
    disclaimer,
  } = prediction;

  const signalStyle = getSignalStyle(
    production_signal.signal,
  );


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
        <BrainCircuit
          size={25}
          color="#a78bfa"
        />

        <h2
          style={{
            margin: 0,
            color: "#f8fafc",
            fontSize: 21,
          }}
        >
          AI Analysis Summary
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
        Explainable multi-factor analysis based on
        technical, fundamental, analyst, and news
        sentiment evidence.
      </p>


      <div
        style={{
          padding: 20,
          borderRadius: 14,
          background: signalStyle.background,
          border: `1px solid ${signalStyle.border}`,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                color: signalStyle.color,
                display: "grid",
                placeItems: "center",
              }}
            >
              {signalStyle.icon}
            </div>

            <div>
              <p
                style={{
                  margin: "0 0 5px 0",
                  color: "#94a3b8",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.7,
                }}
              >
                Production Signal
              </p>

              <strong
                style={{
                  color: signalStyle.color,
                  fontSize: 23,
                }}
              >
                {production_signal.signal}
              </strong>
            </div>
          </div>


          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <Metric
              label="Score"
              value={`${production_signal.score.toFixed(
                1,
              )}/100`}
            />

            <Metric
              label="Classification"
              value={
                production_signal.classification
              }
            />

            <Metric
              label="Confidence"
              value={production_signal.confidence}
            />
          </div>
        </div>
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 14,
          marginBottom: 22,
        }}
      >
        <AgreementMetric
          label="Positive Factors"
          value={factor_agreement.positive_factors}
          color="#22c55e"
        />

        <AgreementMetric
          label="Negative Factors"
          value={factor_agreement.negative_factors}
          color="#ef4444"
        />

        <AgreementMetric
          label="Neutral Factors"
          value={factor_agreement.neutral_factors}
          color="#f59e0b"
        />

        <AgreementMetric
          label="Factor Agreement"
          value={factor_agreement.status}
          color="#60a5fa"
        />
      </div>


      <div
        style={{
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 14,
          }}
        >
          <Sparkles
            size={20}
            color="#a78bfa"
          />

          <h3
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: 17,
            }}
          >
            Why the system produced this signal
          </h3>
        </div>


        <div
          style={{
            display: "grid",
            gap: 13,
          }}
        >
          {explanation.map(
            (item, itemIndex: number) => (
              <div
                key={`${item.factor}-${itemIndex}`}
                style={{
                  background: "#0f172a",
                  border:
                    "1px solid #1e293b",
                  borderRadius: 12,
                  padding: 17,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <strong
                    style={{
                      color: "#f8fafc",
                      fontSize: 14,
                    }}
                  >
                    {item.factor}
                  </strong>

                  <span
                    style={{
                      color: "#60a5fa",
                      fontWeight: 700,
                    }}
                  >
                    {item.score.toFixed(1)}/100
                  </span>
                </div>


                <div
                  style={{
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {item.reasons.map(
                    (
                      reason: string,
                      reasonIndex: number,
                    ) => (
                      <div
                        key={reasonIndex}
                        style={{
                          display: "flex",
                          alignItems:
                            "flex-start",
                          gap: 9,
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          color="#64748b"
                          style={{
                            flexShrink: 0,
                            marginTop: 3,
                          }}
                        />

                        <span
                          style={{
                            color: "#cbd5e1",
                            fontSize: 13,
                            lineHeight: 1.6,
                          }}
                        >
                          {reason}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      </div>


      <div
        style={{
          padding: 18,
          borderRadius: 12,
          background:
            "rgba(139, 92, 246, 0.06)",
          border:
            "1px solid rgba(139, 92, 246, 0.2)",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 10,
          }}
        >
          <ShieldAlert
            size={19}
            color="#a78bfa"
          />

          <strong
            style={{
              color: "#c4b5fd",
              fontSize: 14,
            }}
          >
            Model Governance
          </strong>
        </div>

        <p
          style={{
            margin: "0 0 8px 0",
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          Production mode:{" "}
          <strong>
            {model_governance.production_mode}
          </strong>
        </p>

        <p
          style={{
            margin: 0,
            color: "#94a3b8",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          {model_governance.reason}
        </p>
      </div>


      <div
        style={{
          padding: 16,
          borderRadius: 12,
          background:
            "rgba(59, 130, 246, 0.05)",
          border:
            "1px solid rgba(59, 130, 246, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Info
            size={18}
            color="#60a5fa"
            style={{
              flexShrink: 0,
              marginTop: 2,
            }}
          />

          <div>
            <p
              style={{
                margin: "0 0 8px 0",
                color: "#cbd5e1",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {methodology}
            </p>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: 12,
                lineHeight: 1.7,
              }}
            >
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        style={{
          margin: "0 0 5px 0",
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color: "#f8fafc",
          fontSize: 16,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


function AgreementMetric({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
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
          fontSize: 12,
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color,
          fontSize:
            typeof value === "number"
              ? 23
              : 14,
          lineHeight: 1.5,
        }}
      >
        {value}
      </strong>
    </div>
  );
}