import { useEffect, useState } from "react";

import {
  Activity,
  BarChart3,
  Gauge,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type TechnicalApiResponse = {
  symbol: string;

  current_price: number;

  rsi: {
    value: number;
    signal: string;
  };

  macd: {
    value: number;
    signal_line: number;
    histogram: number;
    signal: string;
  };

  moving_averages: {
    ema20: number;
    ema50: number;
    sma20: number;
    sma50: number;
  };

  bollinger_bands: {
    upper: number;
    middle: number;
    lower: number;
  };

  atr: number;

  support: number;

  resistance: number;

  volume: {
    current: number;
    average_20d: number;
    relative_volume: number;
  };

  trend: string;
};


type TechnicalData = {
  rsi: number | null;
  rsiSignal: string;

  macd: number | null;
  macdSignalLine: number | null;
  macdHistogram: number | null;
  macdSignal: string;

  ema20: number | null;
  ema50: number | null;

  relativeVolume: number | null;

  trend: string;
};


const EMPTY_DATA: TechnicalData = {
  rsi: null,
  rsiSignal: "N/A",

  macd: null,
  macdSignalLine: null,
  macdHistogram: null,
  macdSignal: "N/A",

  ema20: null,
  ema50: null,

  relativeVolume: null,

  trend: "N/A",
};


function parseTechnicalData(
  response: TechnicalApiResponse,
): TechnicalData {
  return {
    rsi:
      response.rsi?.value ??
      null,

    rsiSignal:
      response.rsi?.signal ??
      "N/A",

    macd:
      response.macd?.value ??
      null,

    macdSignalLine:
      response.macd?.signal_line ??
      null,

    macdHistogram:
      response.macd?.histogram ??
      null,

    macdSignal:
      response.macd?.signal ??
      "N/A",

    ema20:
      response.moving_averages?.ema20 ??
      null,

    ema50:
      response.moving_averages?.ema50 ??
      null,

    relativeVolume:
      response.volume?.relative_volume ??
      null,

    trend:
      response.trend ??
      "N/A",
  };
}


function formatNumber(
  value: number | null,
  decimals = 2,
) {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }

  return value.toFixed(decimals);
}


function formatPrice(
  value: number | null,
) {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(value);
}


function getSignalColor(
  signal: string,
) {
  const normalized =
    signal.toUpperCase();

  if (
    normalized.includes("BUY") ||
    normalized.includes("BULL") ||
    normalized.includes("UPTREND") ||
    normalized.includes("OVERSOLD")
  ) {
    return "#22c55e";
  }

  if (
    normalized.includes("SELL") ||
    normalized.includes("BEAR") ||
    normalized.includes("DOWNTREND") ||
    normalized.includes("OVERBOUGHT")
  ) {
    return "#ef4444";
  }

  return "#f59e0b";
}


export default function TechnicalIndicators({
  symbol,
}: Props) {
  const [data, setData] =
    useState<TechnicalData>(
      EMPTY_DATA,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );


  useEffect(() => {
    let cancelled = false;


    async function loadTechnicalData() {
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
          await api.get<TechnicalApiResponse>(
            `/technical/${encodeURIComponent(
              cleanSymbol,
            )}`,
          );

        if (cancelled) {
          return;
        }

        setData(
          parseTechnicalData(
            response.data,
          ),
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Technical indicators request failed:",
          err,
        );

        setData(EMPTY_DATA);

        setError(
          "Unable to load technical indicators.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadTechnicalData();


    return () => {
      cancelled = true;
    };
  }, [symbol]);


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
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "#64748b",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.08em",
              margin: "0 0 6px 0",
            }}
          >
            MARKET TECHNICALS
          </p>

          <h2
            style={{
              color: "#f8fafc",
              fontSize: 22,
              margin: 0,
            }}
          >
            Technical Indicators
          </h2>

          <p
            style={{
              color: "#94a3b8",
              margin: "8px 0 0 0",
            }}
          >
            {symbol}
          </p>
        </div>


        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 14px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: 10,
          }}
        >
          {data.trend
            .toUpperCase()
            .includes("UP") ? (
            <TrendingUp
              size={18}
              color="#22c55e"
            />
          ) : data.trend
              .toUpperCase()
              .includes("DOWN") ? (
            <TrendingDown
              size={18}
              color="#ef4444"
            />
          ) : (
            <Activity
              size={18}
              color="#f59e0b"
            />
          )}

          <span
            style={{
              color: getSignalColor(
                data.trend,
              ),
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {data.trend}
          </span>
        </div>
      </div>


      {loading && (
        <div
          style={{
            minHeight: 220,
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
          }}
        >
          Loading technical indicators...
        </div>
      )}


      {!loading && error && (
        <div
          style={{
            minHeight: 160,
            display: "grid",
            placeItems: "center",
            color: "#f87171",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}


      {!loading && !error && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <IndicatorCard
              icon={<Gauge size={20} />}
              title="RSI (14)"
              value={formatNumber(data.rsi)}
              signal={data.rsiSignal}
            />

            <IndicatorCard
              icon={<BarChart3 size={20} />}
              title="MACD"
              value={formatNumber(data.macd)}
              signal={data.macdSignal}
            />

            <IndicatorCard
              icon={<TrendingUp size={20} />}
              title="EMA 20"
              value={formatPrice(data.ema20)}
              signal="SHORT TERM"
            />

            <IndicatorCard
              icon={<TrendingUp size={20} />}
              title="EMA 50"
              value={formatPrice(data.ema50)}
              signal="MEDIUM TERM"
            />

            <IndicatorCard
              icon={<Activity size={20} />}
              title="Relative Volume"
              value={formatNumber(
                data.relativeVolume,
              )}
              signal={
                data.relativeVolume === null
                  ? "N/A"
                  : data.relativeVolume > 1
                    ? "ABOVE AVERAGE"
                    : "BELOW AVERAGE"
              }
            />
          </div>


          <div
            style={{
              marginTop: 20,
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 12,
              padding: 18,
            }}
          >
            <h3
              style={{
                color: "#f8fafc",
                margin: "0 0 16px 0",
                fontSize: 16,
              }}
            >
              MACD Details
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 16,
              }}
            >
              <SmallMetric
                label="MACD"
                value={formatNumber(
                  data.macd,
                )}
              />

              <SmallMetric
                label="Signal Line"
                value={formatNumber(
                  data.macdSignalLine,
                )}
              />

              <SmallMetric
                label="Histogram"
                value={formatNumber(
                  data.macdHistogram,
                )}
              />

              <SmallMetric
                label="Signal"
                value={data.macdSignal}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
}


type IndicatorCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  signal: string;
};


function IndicatorCard({
  icon,
  title,
  value,
  signal,
}: IndicatorCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div
        style={{
          color: "#60a5fa",
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <p
        style={{
          color: "#94a3b8",
          margin: "0 0 8px 0",
          fontSize: 13,
        }}
      >
        {title}
      </p>

      <strong
        style={{
          display: "block",
          color: "#f8fafc",
          fontSize: 22,
          marginBottom: 8,
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color: getSignalColor(signal),
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {signal}
      </span>
    </div>
  );
}


type SmallMetricProps = {
  label: string;
  value: string;
};


function SmallMetric({
  label,
  value,
}: SmallMetricProps) {
  return (
    <div>
      <p
        style={{
          color: "#64748b",
          margin: "0 0 6px 0",
          fontSize: 12,
        }}
      >
        {label}
      </p>

      <strong
        style={{
          color: "#e2e8f0",
          fontSize: 15,
        }}
      >
        {value}
      </strong>
    </div>
  );
}