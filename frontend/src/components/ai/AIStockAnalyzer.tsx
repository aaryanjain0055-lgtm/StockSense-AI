import {
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  LoaderCircle,
  Play,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type FactorScore = {
  score: number;

  reasons: string[];

  details?: {
    trend?: string;

    rsi?: number;

    macd_signal?: string;
  };
};


type PredictionResponse = {
  symbol: string;

  production_signal: {
    score: number;

    classification: string;

    signal: string;

    confidence: string;

    factor_agreement: string;
  };

  factor_agreement: {
    status: string;

    positive_factors: number;

    negative_factors: number;

    neutral_factors: number;

    total_factors: number;
  };

  factor_scores: {
    technical?: FactorScore;

    fundamental?: FactorScore;

    analyst?: FactorScore;

    sentiment?: FactorScore;
  };

  explanation: Array<{
    factor: string;

    score: number;

    reasons: string[];
  }>;

  risk_flags: Array<{
    level: string;

    category: string;

    message: string;
  }>;

  methodology?: string;

  disclaimer?: string;
};


type AnalysisMetric = {
  title: string;

  value: string;

  color: string;

  icon: React.ReactNode;
};


function getSignalColor(
  signal: string,
): string {
  const normalized =
    signal.toUpperCase();


  if (
    normalized.includes("POSITIVE") ||
    normalized.includes("BUY") ||
    normalized.includes("BULL")
  ) {
    return "#22c55e";
  }


  if (
    normalized.includes("NEGATIVE") ||
    normalized.includes("SELL") ||
    normalized.includes("BEAR")
  ) {
    return "#ef4444";
  }


  return "#f59e0b";
}


function getScoreColor(
  score: number,
): string {
  if (score >= 65) {
    return "#22c55e";
  }


  if (score < 45) {
    return "#ef4444";
  }


  return "#f59e0b";
}


function buildAnalysisSummary(
  data: PredictionResponse,
): string {
  const signal =
    data.production_signal?.signal ??
    data.production_signal?.classification ??
    "NEUTRAL";


  const score =
    data.production_signal?.score;


  const confidence =
    data.production_signal?.confidence ??
    "UNKNOWN";


  const agreement =
    data.factor_agreement?.status ??
    data.production_signal
      ?.factor_agreement ??
    "mixed factor agreement";


  const strongestFactor =
    data.explanation
      ?.filter(
        (factor) =>
          Number.isFinite(
            factor.score,
          ),
      )
      .sort(
        (a, b) =>
          b.score - a.score,
      )[0];


  let summary =
    `The explainable multi-factor analysis currently classifies ${data.symbol} as ${signal} with a score of ${score.toFixed(
      1,
    )}/100 and ${confidence.toLowerCase()} confidence. `;


  summary +=
    `The current factor agreement is ${agreement.toLowerCase()}. `;


  if (strongestFactor) {
    summary +=
      `The strongest evaluated factor is ${strongestFactor.factor.toLowerCase()} with a score of ${strongestFactor.score.toFixed(
        1,
      )}/100. `;


    if (
      strongestFactor.reasons?.length
    ) {
      summary +=
        strongestFactor.reasons[0];
    }
  }


  return summary;
}


export default function AIStockAnalyzer({
  symbol,
}: Props) {
  const [
    result,
    setResult,
  ] =
    useState<PredictionResponse | null>(
      null,
    );


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  async function handleAnalyze() {
    const cleanSymbol =
      symbol
        .trim()
        .toUpperCase();


    if (!cleanSymbol) {
      setError(
        "Select a valid stock before running analysis.",
      );

      return;
    }


    try {
      setLoading(true);

      setError(null);


      const response =
        await api.get<PredictionResponse>(
          `/api/v1/prediction/${encodeURIComponent(
            cleanSymbol,
          )}`,
        );


      setResult(response.data);
    } catch (err) {
      console.error(
        "AI stock analysis failed:",
        err,
      );


      setResult(null);


      setError(
        "Unable to complete stock analysis. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }


  const metrics: AnalysisMetric[] =
    result
      ? [
          {
            title:
              "Production Signal",

            value:
              result.production_signal
                .signal,

            color:
              getSignalColor(
                result.production_signal
                  .signal,
              ),

            icon: (
              <TrendingUp
                size={18}
              />
            ),
          },

          {
            title:
              "Analysis Score",

            value:
              `${result.production_signal.score.toFixed(
                1,
              )}/100`,

            color:
              getScoreColor(
                result.production_signal
                  .score,
              ),

            icon: (
              <BarChart3
                size={18}
              />
            ),
          },

          {
            title:
              "Confidence",

            value:
              result.production_signal
                .confidence,

            color: "#60a5fa",

            icon: (
              <BrainCircuit
                size={18}
              />
            ),
          },

          {
            title:
              "Technical Score",

            value:
              result.factor_scores
                .technical
                ? `${result.factor_scores.technical.score.toFixed(
                    1,
                  )}/100`
                : "N/A",

            color:
              result.factor_scores
                .technical
                ? getScoreColor(
                    result
                      .factor_scores
                      .technical
                      .score,
                  )
                : "#94a3b8",

            icon: (
              <Activity
                size={18}
              />
            ),
          },

          {
            title:
              "Sentiment Score",

            value:
              result.factor_scores
                .sentiment
                ? `${result.factor_scores.sentiment.score.toFixed(
                    1,
                  )}/100`
                : "N/A",

            color:
              result.factor_scores
                .sentiment
                ? getScoreColor(
                    result
                      .factor_scores
                      .sentiment
                      .score,
                  )
                : "#94a3b8",

            icon: (
              <TrendingUp
                size={18}
              />
            ),
          },

          {
            title:
              "Risk Flags",

            value: String(
              result.risk_flags
                ?.length ?? 0,
            ),

            color:
              result.risk_flags
                ?.length
                ? "#f59e0b"
                : "#22c55e",

            icon: (
              <ShieldAlert
                size={18}
              />
            ),
          },
        ]
      : [];


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
        <div>
          <p
            style={{
              margin:
                "0 0 6px 0",

              color: "#64748b",

              fontSize: 12,

              fontWeight: 700,

              letterSpacing:
                "0.08em",
            }}
          >
            EXPLAINABLE ANALYSIS
          </p>


          <h2
            style={{
              color: "white",

              margin: 0,

              fontSize: 22,
            }}
          >
            AI Stock Analysis
          </h2>


          <p
            style={{
              color: "#94a3b8",

              margin:
                "8px 0 0 0",

              fontSize: 13,
            }}
          >
            Selected stock:{" "}
            <strong
              style={{
                color: "#60a5fa",
              }}
            >
              {symbol}
            </strong>
          </p>
        </div>


        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            gap: 9,

            minWidth: 150,

            padding:
              "11px 18px",

            border: "none",

            borderRadius: 10,

            background: loading
              ? "#334155"
              : "#2563eb",

            color: "white",

            fontSize: 14,

            fontWeight: 700,

            cursor: loading
              ? "not-allowed"
              : "pointer",

            opacity: loading
              ? 0.75
              : 1,
          }}
        >
          {loading ? (
            <>
              <LoaderCircle
                size={18}
              />

              Analyzing...
            </>
          ) : (
            <>
              <Play
                size={17}
              />

              Analyze Stock
            </>
          )}
        </button>
      </div>


      {!result &&
        !loading &&
        !error && (
          <div
            style={{
              padding: 28,

              background: "#0f172a",

              border:
                "1px solid #1e293b",

              borderRadius: 12,

              textAlign: "center",
            }}
          >
            <BrainCircuit
              size={32}
              color="#60a5fa"
            />


            <h3
              style={{
                color: "#f8fafc",

                margin:
                  "14px 0 8px 0",
              }}
            >
              Ready to Analyze
            </h3>


            <p
              style={{
                margin: 0,

                color: "#94a3b8",

                fontSize: 13,

                lineHeight: 1.7,
              }}
            >
              Click Analyze Stock to run the
              explainable production analysis
              for {symbol}.
            </p>
          </div>
        )}


      {loading && (
        <div
          style={{
            minHeight: 180,

            display: "grid",

            placeItems: "center",

            background: "#0f172a",

            border:
              "1px solid #1e293b",

            borderRadius: 12,

            color: "#94a3b8",
          }}
        >
          Running technical, fundamental,
          analyst and sentiment analysis...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 10,

              padding: 18,

              background:
                "rgba(239, 68, 68, 0.08)",

              border:
                "1px solid rgba(239, 68, 68, 0.25)",

              borderRadius: 12,

              color: "#f87171",
            }}
          >
            <AlertTriangle
              size={20}
            />

            {error}
          </div>
        )}


      {!loading &&
        result && (
          <>
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",

                gap: 18,
              }}
            >
              {metrics.map(
                (item) => (
                  <div
                    key={
                      item.title
                    }
                    style={{
                      background:
                        "#1e293b",

                      border:
                        "1px solid #334155",

                      borderRadius: 12,

                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        color:
                          item.color,

                        marginBottom:
                          10,
                      }}
                    >
                      {item.icon}
                    </div>


                    <p
                      style={{
                        color:
                          "#94a3b8",

                        margin:
                          "0 0 10px 0",

                        fontSize: 13,
                      }}
                    >
                      {item.title}
                    </p>


                    <h3
                      style={{
                        color:
                          item.color,

                        margin: 0,

                        fontSize: 20,
                      }}
                    >
                      {item.value}
                    </h3>
                  </div>
                ),
              )}
            </div>


            <div
              style={{
                marginTop: 24,

                background: "#1e293b",

                borderRadius: 12,

                padding: 20,
              }}
            >
              <h3
                style={{
                  color: "white",

                  margin:
                    "0 0 14px 0",
                }}
              >
                AI Analysis Summary
              </h3>


              <p
                style={{
                  color: "#cbd5e1",

                  lineHeight: 1.8,

                  margin: 0,

                  fontSize: 14,
                }}
              >
                {buildAnalysisSummary(
                  result,
                )}
              </p>
            </div>


            {result.risk_flags
              ?.length > 0 && (
              <div
                style={{
                  marginTop: 18,

                  background:
                    "rgba(245, 158, 11, 0.07)",

                  border:
                    "1px solid rgba(245, 158, 11, 0.25)",

                  borderRadius: 12,

                  padding: 18,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap: 9,

                    marginBottom:
                      12,
                  }}
                >
                  <ShieldAlert
                    size={19}
                    color="#f59e0b"
                  />


                  <strong
                    style={{
                      color:
                        "#f8fafc",
                    }}
                  >
                    Current Risk Flags
                  </strong>
                </div>


                {result.risk_flags.map(
                  (
                    risk,
                    index,
                  ) => (
                    <p
                      key={`${risk.category}-${index}`}
                      style={{
                        color:
                          "#cbd5e1",

                        margin:
                          index === 0
                            ? 0
                            : "10px 0 0 0",

                        lineHeight:
                          1.6,

                        fontSize:
                          13,
                      }}
                    >
                      <strong>
                        {risk.level}
                        {" · "}
                        {risk.category.replaceAll(
                          "_",
                          " ",
                        )}
                        :
                      </strong>{" "}
                      {risk.message}
                    </p>
                  ),
                )}
              </div>
            )}


            <div
              style={{
                marginTop: 18,

                padding: 14,

                borderRadius: 10,

                background:
                  "rgba(59, 130, 246, 0.07)",

                border:
                  "1px solid rgba(59, 130, 246, 0.2)",
              }}
            >
              <p
                style={{
                  margin: 0,

                  color: "#94a3b8",

                  fontSize: 12,

                  lineHeight: 1.7,
                }}
              >
                {result.disclaimer ??
                  "This output is an analytical research signal and is not a guaranteed forecast or investment recommendation."}
              </p>
            </div>
          </>
        )}
    </section>
  );
}