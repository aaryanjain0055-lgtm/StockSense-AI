import {
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  Newspaper,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type SentimentDistribution = {
  positive?: number;
  neutral?: number;
  negative?: number;
};


type SentimentDistributionPercent = {
  positive?: number;
  neutral?: number;
  negative?: number;
};


type SentimentApiResponse = {
  symbol?: string;

  overall_sentiment?: string;

  average_score?: number;

  article_count?: number;

  distribution?: SentimentDistribution;

  distribution_percent?: SentimentDistributionPercent;

  articles?: unknown[];

  summary?: string;

  reason?: string;

  data?: SentimentApiResponse;

  result?: SentimentApiResponse;

  sentiment_data?: SentimentApiResponse;
};


type SentimentData = {
  sentiment: string;

  score: number | null;

  positive: number;

  neutral: number;

  negative: number;

  articleCount: number;

  summary: string;
};


const EMPTY_DATA: SentimentData = {
  sentiment: "NEUTRAL",

  score: null,

  positive: 0,

  neutral: 0,

  negative: 0,

  articleCount: 0,

  summary:
    "News sentiment information is currently unavailable.",
};


function getPayload(
  response: SentimentApiResponse,
): SentimentApiResponse {
  if (response.sentiment_data) {
    return response.sentiment_data;
  }

  if (response.result) {
    return response.result;
  }

  if (response.data) {
    return response.data;
  }

  return response;
}


function parseSentimentData(
  response: SentimentApiResponse,
): SentimentData {
  const data = getPayload(response);


  const positive =
    data.distribution?.positive ?? 0;


  const neutral =
    data.distribution?.neutral ?? 0;


  const negative =
    data.distribution?.negative ?? 0;


  const articleCount =
    data.article_count ??
    data.articles?.length ??
    positive +
      neutral +
      negative;


  const score =
    typeof data.average_score === "number"
      ? data.average_score
      : null;


  const sentiment =
    data.overall_sentiment ??
    "NEUTRAL";


  const scoreText =
    score !== null
      ? score.toFixed(3)
      : "N/A";


  return {
    sentiment,

    score,

    positive,

    neutral,

    negative,

    articleCount,

    summary:
      data.summary ??
      data.reason ??
      `News sentiment analysis completed across ${articleCount} articles. Overall sentiment is ${sentiment.toLowerCase()} with an average normalized score of ${scoreText}.`,
  };
}


function getSentimentColor(
  sentiment: string,
): string {
  const value =
    sentiment.toUpperCase();


  if (
    value.includes("POSITIVE") ||
    value.includes("BULLISH")
  ) {
    return "#22c55e";
  }


  if (
    value.includes("NEGATIVE") ||
    value.includes("BEARISH")
  ) {
    return "#ef4444";
  }


  return "#f59e0b";
}


function getSentimentIcon(
  sentiment: string,
) {
  const value =
    sentiment.toUpperCase();


  if (
    value.includes("POSITIVE") ||
    value.includes("BULLISH")
  ) {
    return (
      <TrendingUp
        size={20}
        color="#22c55e"
      />
    );
  }


  if (
    value.includes("NEGATIVE") ||
    value.includes("BEARISH")
  ) {
    return (
      <TrendingDown
        size={20}
        color="#ef4444"
      />
    );
  }


  return (
    <Activity
      size={20}
      color="#f59e0b"
    />
  );
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


  return score.toFixed(3);
}


export default function NewsSentiment({
  symbol,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<SentimentData>(
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


    async function loadSentiment() {
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
          await api.get<SentimentApiResponse>(
            `/sentiment/${encodeURIComponent(
              cleanSymbol,
            )}`,
          );


        if (cancelled) {
          return;
        }


        const parsedData =
          parseSentimentData(
            response.data,
          );


        setData(parsedData);
      } catch (err) {
        if (cancelled) {
          return;
        }


        console.error(
          "Sentiment request failed:",
          err,
        );


        setData(EMPTY_DATA);


        setError(
          "Unable to load news sentiment analysis.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadSentiment();


    return () => {
      cancelled = true;
    };
  }, [symbol]);


  const totalClassified =
    data.positive +
    data.neutral +
    data.negative;


  function percentage(
    count: number,
  ): number {
    if (totalClassified === 0) {
      return 0;
    }


    return (
      count /
      totalClassified
    ) * 100;
  }


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

          justifyContent:
            "space-between",

          alignItems: "center",

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
              width: 44,

              height: 44,

              display: "grid",

              placeItems: "center",

              borderRadius: 12,

              background:
                "rgba(139, 92, 246, 0.12)",

              color: "#a78bfa",
            }}
          >
            <BrainCircuit
              size={24}
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
              MARKET INTELLIGENCE
            </p>


            <h2
              style={{
                margin: 0,

                color: "#f8fafc",

                fontSize: 22,
              }}
            >
              News Sentiment
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
            display: "flex",

            alignItems: "center",

            gap: 8,

            padding:
              "9px 14px",

            background: "#0f172a",

            border:
              "1px solid #334155",

            borderRadius: 10,
          }}
        >
          {getSentimentIcon(
            data.sentiment,
          )}


          <span
            style={{
              color:
                getSentimentColor(
                  data.sentiment,
                ),

              fontSize: 13,

              fontWeight: 700,
            }}
          >
            {data.sentiment}
          </span>
        </div>
      </div>


      {loading && (
        <div
          style={{
            minHeight: 240,

            display: "grid",

            placeItems: "center",

            color: "#94a3b8",
          }}
        >
          Analyzing news sentiment...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              minHeight: 180,

              display: "grid",

              placeItems: "center",

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
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",

                gap: 16,

                marginBottom: 20,
              }}
            >
              <MetricCard
                icon={
                  <BarChart3
                    size={20}
                  />
                }
                label="Sentiment Score"
                value={formatScore(
                  data.score,
                )}
                color="#60a5fa"
              />


              <MetricCard
                icon={
                  <Newspaper
                    size={20}
                  />
                }
                label="Articles Analyzed"
                value={String(
                  data.articleCount,
                )}
                color="#a78bfa"
              />


              <MetricCard
                icon={
                  <TrendingUp
                    size={20}
                  />
                }
                label="Positive"
                value={String(
                  data.positive,
                )}
                color="#22c55e"
              />


              <MetricCard
                icon={
                  <TrendingDown
                    size={20}
                  />
                }
                label="Negative"
                value={String(
                  data.negative,
                )}
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

                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  color: "#f8fafc",

                  margin:
                    "0 0 18px 0",

                  fontSize: 17,
                }}
              >
                Sentiment Distribution
              </h3>


              <SentimentBar
                label="Positive"
                count={data.positive}
                percentage={percentage(
                  data.positive,
                )}
                barColor="#22c55e"
              />


              <SentimentBar
                label="Neutral"
                count={data.neutral}
                percentage={percentage(
                  data.neutral,
                )}
                barColor="#f59e0b"
              />


              <SentimentBar
                label="Negative"
                count={data.negative}
                percentage={percentage(
                  data.negative,
                )}
                barColor="#ef4444"
              />
            </div>


            <div
              style={{
                background: "#1e293b",

                borderRadius: 14,

                padding: 20,
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
                <AlertTriangle
                  size={19}
                  color="#f59e0b"
                />


                <h3
                  style={{
                    margin: 0,

                    color: "#f8fafc",

                    fontSize: 17,
                  }}
                >
                  Sentiment Interpretation
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
                {data.summary}
              </p>
            </div>


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
                News sentiment is one analytical factor and
                should not be treated as a standalone stock
                price forecast or investment recommendation.
              </p>
            </div>
          </>
        )}
    </section>
  );
}


type MetricCardProps = {
  icon: React.ReactNode;

  label: string;

  value: string;

  color: string;
};


function MetricCard({
  icon,
  label,
  value,
  color,
}: MetricCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",

        border:
          "1px solid #334155",

        borderRadius: 12,

        padding: 18,
      }}
    >
      <div
        style={{
          color,

          marginBottom: 12,
        }}
      >
        {icon}
      </div>


      <p
        style={{
          margin:
            "0 0 8px 0",

          color: "#94a3b8",

          fontSize: 13,
        }}
      >
        {label}
      </p>


      <strong
        style={{
          color,

          fontSize: 24,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


type SentimentBarProps = {
  label: string;

  count: number;

  percentage: number;

  barColor: string;
};


function SentimentBar({
  label,
  count,
  percentage,
  barColor,
}: SentimentBarProps) {
  return (
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: 7,
        }}
      >
        <span
          style={{
            color: "#cbd5e1",

            fontSize: 13,
          }}
        >
          {label}
        </span>


        <span
          style={{
            color: "#94a3b8",

            fontSize: 12,
          }}
        >
          {count} (
          {percentage.toFixed(1)}%)
        </span>
      </div>


      <div
        style={{
          height: 8,

          width: "100%",

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
                percentage,
              ),
            )}%`,

            height: "100%",

            background: barColor,

            borderRadius: 999,

            transition:
              "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}