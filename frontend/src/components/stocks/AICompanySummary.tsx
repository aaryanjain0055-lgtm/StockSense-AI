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


type SentimentArticle = {
  title?: string;
  summary?: string;
  publisher?: string;
  link?: string;

  sentiment?: {
    label?: string;
    raw_score?: number;
    normalized_score?: number;
    confidence?: number;
    positive_keywords?: string[];
    negative_keywords?: string[];
  };
};


type SentimentApiResponse = {
  symbol: string;

  article_count: number;

  overall_sentiment: string;

  average_score: number;

  distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };

  distribution_percent: {
    positive: number;
    negative: number;
    neutral: number;
  };

  articles: SentimentArticle[];
};


type SentimentData = {
  sentiment: string;

  normalizedScore: number | null;

  displayScore: number | null;

  positive: number;

  neutral: number;

  negative: number;

  positivePercent: number;

  neutralPercent: number;

  negativePercent: number;

  articleCount: number;

  summary: string;
};


const EMPTY_DATA: SentimentData = {
  sentiment: "NEUTRAL",

  normalizedScore: null,

  displayScore: null,

  positive: 0,

  neutral: 0,

  negative: 0,

  positivePercent: 0,

  neutralPercent: 0,

  negativePercent: 0,

  articleCount: 0,

  summary:
    "News sentiment information is currently unavailable.",
};


function buildSummary(
  sentiment: string,
  articleCount: number,
  positive: number,
  neutral: number,
  negative: number,
): string {
  if (articleCount === 0) {
    return (
      "No recent news articles were available for sentiment analysis."
    );
  }


  if (sentiment === "POSITIVE") {
    return (
      `News sentiment is positive across ${articleCount} analyzed articles. ` +
      `${positive} articles were classified as positive, ` +
      `${neutral} as neutral, and ${negative} as negative.`
    );
  }


  if (sentiment === "NEGATIVE") {
    return (
      `News sentiment is negative across ${articleCount} analyzed articles. ` +
      `${positive} articles were classified as positive, ` +
      `${neutral} as neutral, and ${negative} as negative.`
    );
  }


  return (
    `News sentiment is neutral across ${articleCount} analyzed articles. ` +
    `${positive} articles were classified as positive, ` +
    `${neutral} as neutral, and ${negative} as negative.`
  );
}


function parseSentimentData(
  response: SentimentApiResponse,
): SentimentData {
  const normalizedScore =
    Number.isFinite(
      response.average_score,
    )
      ? response.average_score
      : null;


  /*
   * Backend average_score range:
   * -1.0 to +1.0
   *
   * Convert to a UI score:
   * -1.0 => 0
   *  0.0 => 50
   * +1.0 => 100
   */
  const displayScore =
    normalizedScore === null
      ? null
      : Math.max(
          0,
          Math.min(
            100,
            (normalizedScore + 1) * 50,
          ),
        );


  const positive =
    response.distribution?.positive ??
    0;


  const neutral =
    response.distribution?.neutral ??
    0;


  const negative =
    response.distribution?.negative ??
    0;


  const articleCount =
    response.article_count ??
    positive +
      neutral +
      negative;


  const sentiment =
    response.overall_sentiment ??
    "NEUTRAL";


  return {
    sentiment,

    normalizedScore,

    displayScore,

    positive,

    neutral,

    negative,

    positivePercent:
      response.distribution_percent
        ?.positive ??
      0,

    neutralPercent:
      response.distribution_percent
        ?.neutral ??
      0,

    negativePercent:
      response.distribution_percent
        ?.negative ??
      0,

    articleCount,

    summary: buildSummary(
      sentiment,
      articleCount,
      positive,
      neutral,
      negative,
    ),
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


  return score.toFixed(2);
}


function formatNormalizedScore(
  score: number | null,
): string {
  if (
    score === null ||
    !Number.isFinite(score)
  ) {
    return "N/A";
  }


  if (score > 0) {
    return `+${score.toFixed(3)}`;
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


        setData(
          parseSentimentData(
            response.data,
          ),
        );
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
                  data.displayScore,
                )}
                color="#60a5fa"
              />


              <MetricCard
                icon={
                  <Activity
                    size={20}
                  />
                }
                label="Normalized Score"
                value={formatNormalizedScore(
                  data.normalizedScore,
                )}
                color="#38bdf8"
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
                  <Activity
                    size={20}
                  />
                }
                label="Neutral"
                value={String(
                  data.neutral,
                )}
                color="#f59e0b"
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
                percentage={
                  data.positivePercent
                }
                barColor="#22c55e"
              />


              <SentimentBar
                label="Neutral"
                count={data.neutral}
                percentage={
                  data.neutralPercent
                }
                barColor="#f59e0b"
              />


              <SentimentBar
                label="Negative"
                count={data.negative}
                percentage={
                  data.negativePercent
                }
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
                The sentiment score converts the backend normalized
                range of -1 to +1 into a display range of 0 to 100.
                A score near 50 represents broadly neutral sentiment.
                News sentiment is one analytical factor and should not
                be treated as a standalone stock price forecast or
                investment recommendation.
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