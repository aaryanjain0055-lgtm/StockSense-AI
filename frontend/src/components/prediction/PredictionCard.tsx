import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  ShieldAlert,
} from "lucide-react";

import type {
  ProductionPredictionResponse,
} from "../../services/predictionService";


type Props = {
  prediction: ProductionPredictionResponse;
};


function getClassificationColor(
  classification: string,
): string {
  const value =
    classification.toUpperCase();

  if (
    value.includes("BUY") ||
    value.includes("POSITIVE") ||
    value.includes("BULLISH")
  ) {
    return "#22c55e";
  }

  if (
    value.includes("SELL") ||
    value.includes("NEGATIVE") ||
    value.includes("BEARISH")
  ) {
    return "#ef4444";
  }

  return "#f59e0b";
}


function getConfidenceColor(
  confidence: string,
): string {
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


export default function PredictionCard({
  prediction,
}: Props) {
  const {
    symbol,
    production_signal,
    factor_agreement,
    methodology,
  } = prediction;


  const score =
    production_signal.score;


  const classificationColor =
    getClassificationColor(
      production_signal.classification,
    );


  const confidenceColor =
    getConfidenceColor(
      production_signal.confidence,
    );


  return (
    <section
      style={{
        background: "#111827",
        border:
          "1px solid #1e293b",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
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
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              borderRadius: 12,
              background:
                "rgba(59, 130, 246, 0.12)",
              color: "#60a5fa",
            }}
          >
            <BrainCircuit
              size={25}
            />
          </div>


          <div>
            <p
              style={{
                margin:
                  "0 0 5px 0",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing:
                  "0.08em",
              }}
            >
              PRODUCTION ANALYSIS
            </p>


            <h2
              style={{
                margin: 0,
                color: "#f8fafc",
                fontSize: 22,
              }}
            >
              Explainable Stock Signal
            </h2>


            <p
              style={{
                margin:
                  "7px 0 0 0",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              {symbol}
            </p>
          </div>
        </div>


        <div
          style={{
            padding:
              "9px 14px",
            borderRadius: 10,
            background:
              "rgba(59, 130, 246, 0.08)",
            border:
              "1px solid rgba(59, 130, 246, 0.2)",
            color: "#60a5fa",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          EXPLAINABLE MULTI-FACTOR MODEL
        </div>
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Metric
          icon={
            <Gauge size={21} />
          }
          title="Analysis Score"
          value={`${score.toFixed(1)} / 100`}
          color="#60a5fa"
        />


        <Metric
          icon={
            <BarChart3
              size={21}
            />
          }
          title="Classification"
          value={
            production_signal.classification
          }
          color={
            classificationColor
          }
        />


        <Metric
          icon={
            <Activity
              size={21}
            />
          }
          title="Market Signal"
          value={
            production_signal.signal
          }
          color="#a78bfa"
        />


        <Metric
          icon={
            <ShieldAlert
              size={21}
            />
          }
          title="Confidence"
          value={
            production_signal.confidence
          }
          color={
            confidenceColor
          }
        />
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <AgreementMetric
          title="Positive Factors"
          value={
            factor_agreement.positive_factors
          }
          total={
            factor_agreement.total_factors
          }
          color="#22c55e"
        />


        <AgreementMetric
          title="Neutral Factors"
          value={
            factor_agreement.neutral_factors
          }
          total={
            factor_agreement.total_factors
          }
          color="#f59e0b"
        />


        <AgreementMetric
          title="Negative Factors"
          value={
            factor_agreement.negative_factors
          }
          total={
            factor_agreement.total_factors
          }
          color="#ef4444"
        />
      </div>


      <div
        style={{
          background: "#0f172a",
          border:
            "1px solid #1e293b",
          borderRadius: 14,
          padding: 20,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <CheckCircle2
            size={20}
            color="#60a5fa"
          />


          <h3
            style={{
              margin: 0,
              color: "#f8fafc",
              fontSize: 17,
            }}
          >
            Factor Agreement
          </h3>
        </div>


        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            lineHeight: 1.8,
            fontSize: 14,
          }}
        >
          Current factor agreement is{" "}
          <strong
            style={{
              color: "#a78bfa",
            }}
          >
            {
              factor_agreement.status
            }
          </strong>
          . The final score combines
          technical, fundamental, analyst,
          and sentiment evidence rather
          than relying on a single
          forecasting model.
        </p>
      </div>


      <div
        style={{
          background: "#1e293b",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3
          style={{
            margin:
              "0 0 10px 0",
            color: "#f8fafc",
            fontSize: 17,
          }}
        >
          Methodology
        </h3>


        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            lineHeight: 1.8,
            fontSize: 14,
          }}
        >
          {methodology}
        </p>
      </div>
    </section>
  );
}


type MetricProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};


function Metric({
  icon,
  title,
  value,
  color,
}: MetricProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        border:
          "1px solid #334155",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div
        style={{
          color,
          marginBottom: 13,
        }}
      >
        {icon}
      </div>


      <p
        style={{
          margin:
            "0 0 9px 0",
          color: "#94a3b8",
          fontSize: 13,
        }}
      >
        {title}
      </p>


      <strong
        style={{
          display: "block",
          color,
          fontSize: 22,
          lineHeight: 1.3,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


type AgreementMetricProps = {
  title: string;
  value: number;
  total: number;
  color: string;
};


function AgreementMetric({
  title,
  value,
  total,
  color,
}: AgreementMetricProps) {
  const percentage =
    total > 0
      ? (value / total) * 100
      : 0;


  return (
    <div
      style={{
        background: "#0f172a",
        border:
          "1px solid #1e293b",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            color: "#94a3b8",
            fontSize: 13,
          }}
        >
          {title}
        </span>


        <strong
          style={{
            color,
          }}
        >
          {value}/{total}
        </strong>
      </div>


      <div
        style={{
          width: "100%",
          height: 7,
          background: "#1e293b",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}