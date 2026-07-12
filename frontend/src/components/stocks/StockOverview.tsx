import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
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
    technical?: {
      score: number;
      reasons: string[];
    };

    fundamental?: {
      score: number;
      reasons: string[];
    };

    analyst?: {
      score: number;
      reasons: string[];
    };

    sentiment?: {
      score: number;
      reasons: string[];
    };
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


type OverviewData = {
  score: number | null;

  signal: string;

  confidence: string;

  agreement: string;

  positiveFactors: number;

  negativeFactors: number;

  neutralFactors: number;

  totalFactors: number;

  bullishReasons: string[];

  riskReasons: string[];
};


const EMPTY_DATA: OverviewData = {
  score: null,

  signal: "N/A",

  confidence: "N/A",

  agreement: "N/A",

  positiveFactors: 0,

  negativeFactors: 0,

  neutralFactors: 0,

  totalFactors: 0,

  bullishReasons: [],

  riskReasons: [],
};


function buildBullishReasons(
  response: PredictionResponse,
): string[] {
  const reasons: string[] = [];


  for (
    const factor
    of response.explanation ?? []
  ) {
    if (
      factor.score >= 60 &&
      factor.reasons?.length
    ) {
      for (
        const reason
        of factor.reasons
      ) {
        reasons.push(
          `${factor.factor}: ${reason}`,
        );
      }
    }
  }


  return reasons.slice(0, 4);
}


function buildRiskReasons(
  response: PredictionResponse,
): string[] {
  const risks: string[] = [];


  for (
    const flag
    of response.risk_flags ?? []
  ) {
    risks.push(
      `${flag.category.replaceAll(
        "_",
        " ",
      )}: ${flag.message}`,
    );
  }


  for (
    const factor
    of response.explanation ?? []
  ) {
    if (
      factor.score < 50 &&
      factor.reasons?.length
    ) {
      for (
        const reason
        of factor.reasons
      ) {
        risks.push(
          `${factor.factor}: ${reason}`,
        );
      }
    }
  }


  return risks.slice(0, 4);
}


function parseOverviewData(
  response: PredictionResponse,
): OverviewData {
  return {
    score:
      response.production_signal?.score ??
      null,

    signal:
      response.production_signal?.signal ??
      response.production_signal
        ?.classification ??
      "N/A",

    confidence:
      response.production_signal
        ?.confidence ??
      "N/A",

    agreement:
      response.factor_agreement?.status ??
      response.production_signal
        ?.factor_agreement ??
      "N/A",

    positiveFactors:
      response.factor_agreement
        ?.positive_factors ??
      0,

    negativeFactors:
      response.factor_agreement
        ?.negative_factors ??
      0,

    neutralFactors:
      response.factor_agreement
        ?.neutral_factors ??
      0,

    totalFactors:
      response.factor_agreement
        ?.total_factors ??
      0,

    bullishReasons:
      buildBullishReasons(response),

    riskReasons:
      buildRiskReasons(response),
  };
}


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


function formatScore(
  score: number | null,
): string {
  if (
    score === null ||
    !Number.isFinite(score)
  ) {
    return "N/A";
  }


  return score.toFixed(2);
}


export default function StockOverview({
  symbol,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<OverviewData>(
      EMPTY_DATA,
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


  useEffect(() => {
    let cancelled = false;


    async function loadOverview() {
      const cleanSymbol =
        symbol
          .trim()
          .toUpperCase();


      if (!cleanSymbol) {
        setData(EMPTY_DATA);

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


        if (cancelled) {
          return;
        }


        setData(
          parseOverviewData(
            response.data,
          ),
        );
      } catch (err) {
        if (cancelled) {
          return;
        }


        console.error(
          "Stock overview analysis request failed:",
          err,
        );


        setData(EMPTY_DATA);


        setError(
          "Live multi-factor analysis is temporarily unavailable.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadOverview();


    return () => {
      cancelled = true;
    };
  }, [symbol]);


  const market =
    symbol.endsWith(".NS")
      ? "NSE"
      : symbol.endsWith(".BO")
        ? "BSE"
        : "GLOBAL";


  return (
    <div
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

              justifyContent:
                "center",

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
            value={market}
          />


          <OverviewMetric
            label="Score"
            value={formatScore(
              data.score,
            )}
          />


          <OverviewMetric
            label="Signal"
            value={data.signal}
            valueColor={
              getSignalColor(
                data.signal,
              )
            }
          />


          <OverviewMetric
            label="Confidence"
            value={data.confidence}
          />
        </div>
      </div>


      {loading && (
        <div
          style={{
            marginTop: 24,

            padding: 18,

            background: "#0f172a",

            border:
              "1px solid #1e293b",

            borderRadius: 12,

            color: "#94a3b8",

            textAlign: "center",
          }}
        >
          Loading live multi-factor analysis...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              marginTop: 24,

              padding: 18,

              background: "#0f172a",

              border:
                "1px solid #1e293b",

              borderRadius: 12,

              color: "#f87171",

              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}


      {!loading &&
        !error && (
          <>
            <div
              style={{
                marginTop: 24,

                paddingTop: 20,

                borderTop:
                  "1px solid #1e293b",

                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",

                gap: 16,
              }}
            >
              <AnalysisCard
                icon={
                  <TrendingUp
                    size={18}
                    color="#60a5fa"
                  />
                }
                title="Live Analysis"
                description={
                  data.agreement === "N/A"
                    ? "Multi-factor analysis is unavailable."
                    : `${data.agreement}. ${data.positiveFactors} positive, ${data.neutralFactors} neutral, and ${data.negativeFactors} negative factors across ${data.totalFactors} evaluated factors.`
                }
              />


              <FactorListCard
                icon={
                  <ArrowUpRight
                    size={18}
                    color="#22c55e"
                  />
                }
                title="Bullish Factors"
                items={
                  data.bullishReasons
                }
                emptyText={
                  "No strong bullish factors were identified in the current analysis."
                }
              />


              <FactorListCard
                icon={
                  <ArrowDownRight
                    size={18}
                    color="#ef4444"
                  />
                }
                title="Risk Factors"
                items={
                  data.riskReasons
                }
                emptyText={
                  "No major risk flags were returned by the current analysis."
                }
              />
            </div>


            <div
              style={{
                marginTop: 16,

                display: "flex",

                alignItems: "center",

                gap: 10,

                padding:
                  "12px 14px",

                borderRadius: 10,

                background:
                  "rgba(245, 158, 11, 0.06)",

                border:
                  "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              <ShieldAlert
                size={17}
                color="#f59e0b"
              />


              <p
                style={{
                  margin: 0,

                  color: "#94a3b8",

                  fontSize: 12,

                  lineHeight: 1.6,
                }}
              >
                This overview summarizes the explainable
                multi-factor production analysis. It is an
                analytical research signal, not a guaranteed
                forecast or investment recommendation.
              </p>
            </div>
          </>
        )}
    </div>
  );
}


type OverviewMetricProps = {
  label: string;

  value: string;

  valueColor?: string;
};


function OverviewMetric({
  label,
  value,
  valueColor = "#f8fafc",
}: OverviewMetricProps) {
  return (
    <div
      style={{
        minWidth: 110,

        padding:
          "10px 14px",

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
          color: valueColor,

          fontSize: 14,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


type AnalysisCardProps = {
  icon: React.ReactNode;

  title: string;

  description: string;
};


function AnalysisCard({
  icon,
  title,
  description,
}: AnalysisCardProps) {
  return (
    <div
      style={{
        padding: 16,

        borderRadius: 12,

        background: "#0f172a",

        border:
          "1px solid #1e293b",
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


type FactorListCardProps = {
  icon: React.ReactNode;

  title: string;

  items: string[];

  emptyText: string;
};


function FactorListCard({
  icon,
  title,
  items,
  emptyText,
}: FactorListCardProps) {
  return (
    <div
      style={{
        padding: 16,

        borderRadius: 12,

        background: "#0f172a",

        border:
          "1px solid #1e293b",
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 8,

          marginBottom: 12,
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


      {items.length === 0 ? (
        <p
          style={{
            margin: 0,

            color: "#94a3b8",

            fontSize: 13,

            lineHeight: 1.6,
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: 9,
          }}
        >
          {items.map(
            (
              item,
              index,
            ) => (
              <div
                key={`${title}-${index}`}
                style={{
                  display: "flex",

                  alignItems:
                    "flex-start",

                  gap: 8,
                }}
              >
                <Activity
                  size={13}
                  color="#64748b"
                  style={{
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />


                <p
                  style={{
                    margin: 0,

                    color:
                      "#cbd5e1",

                    fontSize: 12,

                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}