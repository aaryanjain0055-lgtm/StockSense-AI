import {
  BarChart3,
  Building2,
  Newspaper,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

import type {
  ProductionPredictionResponse,
} from "../../services/predictionService";


type Props = {
  prediction: ProductionPredictionResponse;
};


type ContributionItem = {
  key: string;
  label: string;
  score: number;
  contribution: number;
  weight: number;
  icon: React.ReactNode;
};


export default function FeatureImportance({
  prediction,
}: Props) {
  const {
    factor_scores,
    weighted_contributions,
  } = prediction;


  const factors: ContributionItem[] = [
    {
      key: "technical",
      label: "Technical Analysis",
      score: factor_scores.technical.score,
      contribution:
        weighted_contributions.technical,
      weight: 30,
      icon: <TrendingUp size={21} />,
    },
    {
      key: "fundamental",
      label: "Fundamental Analysis",
      score: factor_scores.fundamental.score,
      contribution:
        weighted_contributions.fundamental,
      weight: 30,
      icon: <Building2 size={21} />,
    },
    {
      key: "analyst",
      label: "Analyst Consensus",
      score: factor_scores.analyst.score,
      contribution:
        weighted_contributions.analyst,
      weight: 20,
      icon: <Stethoscope size={21} />,
    },
    {
      key: "sentiment",
      label: "News Sentiment",
      score: factor_scores.sentiment.score,
      contribution:
        weighted_contributions.sentiment,
      weight: 20,
      icon: <Newspaper size={21} />,
    },
  ];


  const maximumContribution = Math.max(
    ...factors.map(
      (factor) => factor.contribution,
    ),
    1,
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
        <BarChart3
          size={24}
          color="#60a5fa"
        />

        <h2
          style={{
            margin: 0,
            color: "#f8fafc",
            fontSize: 21,
          }}
        >
          Production Factor Contributions
        </h2>
      </div>


      <p
        style={{
          margin: "0 0 24px 0",
          color: "#94a3b8",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        Contribution of each explainable factor
        to the final production analysis score.
        These are production scoring factors,
        not experimental ML feature importance.
      </p>


      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {factors.map((factor) => {
          const barWidth =
            (factor.contribution /
              maximumContribution) *
            100;


          return (
            <div
              key={factor.key}
              style={{
                background: "#0f172a",
                border:
                  "1px solid #1e293b",
                borderRadius: 13,
                padding: 18,
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
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background:
                        "rgba(59, 130, 246, 0.10)",
                      color: "#60a5fa",
                    }}
                  >
                    {factor.icon}
                  </div>


                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#f8fafc",
                        fontSize: 15,
                        marginBottom: 4,
                      }}
                    >
                      {factor.label}
                    </strong>


                    <span
                      style={{
                        color: "#64748b",
                        fontSize: 12,
                      }}
                    >
                      Weight: {factor.weight}%
                    </span>
                  </div>
                </div>


                <div
                  style={{
                    textAlign: "right",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#60a5fa",
                      fontSize: 20,
                    }}
                  >
                    +
                    {factor.contribution.toFixed(
                      1,
                    )}
                  </strong>


                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    Factor score:{" "}
                    {factor.score.toFixed(1)}
                  </span>
                </div>
              </div>


              <div
                style={{
                  width: "100%",
                  height: 9,
                  borderRadius: 999,
                  background: "#1e293b",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: "100%",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    transition:
                      "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>


      <div
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 12,
          background:
            "rgba(59, 130, 246, 0.06)",
          border:
            "1px solid rgba(59, 130, 246, 0.18)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#cbd5e1",
            lineHeight: 1.7,
            fontSize: 13,
          }}
        >
          Final production score:{" "}
          <strong
            style={{
              color: "#60a5fa",
            }}
          >
            {prediction.production_signal.score.toFixed(
              1,
            )}
            /100
          </strong>
          . The system combines technical,
          fundamental, analyst, and sentiment
          evidence using explicit weighted
          contributions.
        </p>
      </div>
    </section>
  );
}