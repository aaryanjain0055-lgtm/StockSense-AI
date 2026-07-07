import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  ProductionPredictionResponse,
  RiskFlag,
} from "../../types/stock";

import {
  getProductionPrediction,
} from "../../services/predictionService";


type Props = {
  symbol: string;
};


export default function StockScore({
  symbol,
}: Props) {
  const [data, setData] =
    useState<ProductionPredictionResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    let active = true;


    async function loadScore() {
      try {
        setLoading(true);
        setError(null);


        const result =
          await getProductionPrediction(
            symbol,
          );


        if (active) {
          setData(result);
        }
      } catch (err) {
        console.error(
          "Stock score error:",
          err,
        );


        if (active) {
          setError(
            "Unable to load stock score.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }


    if (symbol.trim()) {
      loadScore();
    }


    return () => {
      active = false;
    };
  }, [symbol]);


  if (loading) {
    return (
      <Card>
        <p
          style={{
            margin: 0,
            color: "#94a3b8",
          }}
        >
          Loading analytical stock score...
        </p>
      </Card>
    );
  }


  if (error || !data) {
    return (
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <AlertTriangle
            size={20}
            color="#f59e0b"
          />

          <p
            style={{
              margin: 0,
              color: "#fbbf24",
            }}
          >
            {error ??
              "Stock score is unavailable."}
          </p>
        </div>
      </Card>
    );
  }


  const production =
    data.production_signal;


  return (
    <Card>
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <Brain
              size={22}
              color="#60a5fa"
            />

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: 22,
              }}
            >
              StockSense Score
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
            }}
          >
            Explainable multi-factor analysis
            for {data.symbol}
          </p>
        </div>


        <SignalBadge
          signal={production.signal}
        />
      </div>


      {/* MAIN SCORE */}

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <Metric
          label="Overall Score"
          value={`${production.score}/100`}
          color={getScoreColor(
            production.score,
          )}
        />

        <Metric
          label="Classification"
          value={production.classification}
          color={getClassificationColor(
            production.classification,
          )}
        />

        <Metric
          label="Confidence"
          value={production.confidence}
          color={getConfidenceColor(
            production.confidence,
          )}
        />

        <Metric
          label="Factor Agreement"
          value={
            production.factor_agreement
          }
          color="#a78bfa"
        />
      </div>


      {/* SCORE BAR */}

      <div
        style={{
          marginTop: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Composite analytical score
          </span>

          <span
            style={{
              color: "#ffffff",
              fontWeight: 700,
            }}
          >
            {production.score}%
          </span>
        </div>


        <div
          style={{
            width: "100%",
            height: 10,
            background: "#1e293b",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  production.score,
                ),
              )}%`,
              height: "100%",
              background:
                getScoreColor(
                  production.score,
                ),
              borderRadius: 999,
              transition:
                "width 0.4s ease",
            }}
          />
        </div>
      </div>


      {/* FACTOR SCORES */}

      <div
        style={{
          marginTop: 28,
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            color: "#ffffff",
            fontSize: 17,
          }}
        >
          Factor Scores
        </h3>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {Object.entries(
            data.factor_scores,
          ).map(
            ([factor, factorData]) => (
              <FactorCard
                key={factor}
                name={factor}
                score={factorData.score}
              />
            ),
          )}
        </div>
      </div>


      {/* FACTOR AGREEMENT */}

      <div
        style={{
          marginTop: 28,
          padding: 18,
          background: "#0f172a",
          border:
            "1px solid #1e293b",
          borderRadius: 12,
        }}
      >
        <h3
          style={{
            margin: "0 0 14px",
            color: "#ffffff",
            fontSize: 16,
          }}
        >
          Factor Agreement
        </h3>


        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <AgreementItem
            label="Positive"
            value={
              data.factor_agreement
                .positive_factors
            }
            color="#22c55e"
          />

          <AgreementItem
            label="Neutral"
            value={
              data.factor_agreement
                .neutral_factors
            }
            color="#f59e0b"
          />

          <AgreementItem
            label="Negative"
            value={
              data.factor_agreement
                .negative_factors
            }
            color="#ef4444"
          />
        </div>
      </div>


      {/* RISK FLAGS */}

      {data.risk_flags.length > 0 && (
        <div
          style={{
            marginTop: 28,
          }}
        >
          <h3
            style={{
              margin: "0 0 14px",
              color: "#ffffff",
              fontSize: 17,
            }}
          >
            Risk Flags
          </h3>


          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {data.risk_flags.map(
              (
                flag: RiskFlag,
                index: number,
              ) => (
                <RiskFlagCard
                  key={`${flag.category}-${index}`}
                  flag={flag}
                />
              ),
            )}
          </div>
        </div>
      )}


      {/* GOVERNANCE */}

      <div
        style={{
          marginTop: 28,
          padding: 18,
          borderRadius: 12,
          background:
            "rgba(59, 130, 246, 0.08)",
          border:
            "1px solid rgba(59, 130, 246, 0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <ShieldAlert
            size={20}
            color="#60a5fa"
            style={{
              flexShrink: 0,
              marginTop: 2,
            }}
          />

          <div>
            <strong
              style={{
                color: "#ffffff",
              }}
            >
              {
                data.model_governance
                  .production_mode
              }
            </strong>

            <p
              style={{
                margin:
                  "7px 0 0",
                color: "#94a3b8",
                lineHeight: 1.6,
                fontSize: 13,
              }}
            >
              {
                data.model_governance
                  .reason
              }
            </p>
          </div>
        </div>
      </div>


      <p
        style={{
          margin:
            "20px 0 0",
          color: "#64748b",
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        {data.disclaimer}
      </p>
    </Card>
  );
}


function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
      }}
    >
      {children}
    </div>
  );
}


function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "#0f172a",
        border:
          "1px solid #1e293b",
        borderRadius: 12,
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color,
          fontSize: 19,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


function FactorCard({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "#0f172a",
        border:
          "1px solid #1e293b",
        borderRadius: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            color: "#cbd5e1",
            textTransform:
              "capitalize",
            fontWeight: 600,
          }}
        >
          {name}
        </span>

        <strong
          style={{
            color:
              getScoreColor(score),
          }}
        >
          {score}
        </strong>
      </div>


      <div
        style={{
          height: 7,
          background: "#1e293b",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(
              100,
              Math.max(0, score),
            )}%`,
            height: "100%",
            background:
              getScoreColor(score),
          }}
        />
      </div>
    </div>
  );
}


function AgreementItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        background: "#1e293b",
        borderRadius: 8,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
        }}
      />

      <span
        style={{
          color: "#cbd5e1",
          fontSize: 13,
        }}
      >
        {label}: {value}
      </span>
    </div>
  );
}


function RiskFlagCard({
  flag,
}: {
  flag: RiskFlag;
}) {
  const important =
    flag.level === "IMPORTANT";


  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 14,
        borderRadius: 10,
        background: important
          ? "rgba(239, 68, 68, 0.08)"
          : "rgba(245, 158, 11, 0.08)",
        border: important
          ? "1px solid rgba(239, 68, 68, 0.25)"
          : "1px solid rgba(245, 158, 11, 0.25)",
      }}
    >
      <AlertTriangle
        size={18}
        color={
          important
            ? "#ef4444"
            : "#f59e0b"
        }
        style={{
          flexShrink: 0,
          marginTop: 2,
        }}
      />

      <div>
        <strong
          style={{
            color:
              important
                ? "#f87171"
                : "#fbbf24",
            fontSize: 13,
          }}
        >
          {flag.category}
        </strong>

        <p
          style={{
            margin: "5px 0 0",
            color: "#cbd5e1",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {flag.message}
        </p>
      </div>
    </div>
  );
}


function SignalBadge({
  signal,
}: {
  signal: string;
}) {
  const upper =
    signal.toUpperCase();


  const positive =
    upper.includes("POSITIVE") ||
    upper.includes("BUY");


  const negative =
    upper.includes("NEGATIVE") ||
    upper.includes("SELL");


  const color = positive
    ? "#22c55e"
    : negative
      ? "#ef4444"
      : "#f59e0b";


  const Icon = positive
    ? TrendingUp
    : negative
      ? TrendingDown
      : CheckCircle2;


  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 13px",
        borderRadius: 999,
        background: `${color}18`,
        border:
          `1px solid ${color}55`,
        color,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      <Icon size={17} />

      {signal}
    </div>
  );
}


function getScoreColor(
  score: number,
) {
  if (score >= 70) {
    return "#22c55e";
  }

  if (score >= 50) {
    return "#f59e0b";
  }

  return "#ef4444";
}


function getClassificationColor(
  classification: string,
) {
  const value =
    classification.toUpperCase();

  if (
    value.includes("BUY") ||
    value.includes("POSITIVE")
  ) {
    return "#22c55e";
  }

  if (
    value.includes("SELL") ||
    value.includes("NEGATIVE")
  ) {
    return "#ef4444";
  }

  return "#f59e0b";
}


function getConfidenceColor(
  confidence: string,
) {
  const value =
    confidence.toUpperCase();

  if (value === "HIGH") {
    return "#22c55e";
  }

  if (value === "MEDIUM") {
    return "#f59e0b";
  }

  return "#ef4444";
}