import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type HistoricalPoint = {
  date: string;
  close: number;
};


type ApiHistoricalPoint = {
  date?: string;
  Date?: string;

  close?: number;
  Close?: number;
};


type HistoricalApiResponse =
  | ApiHistoricalPoint[]
  | {
      data?: ApiHistoricalPoint[];
      history?: ApiHistoricalPoint[];
      prices?: ApiHistoricalPoint[];
    };


const PERIODS = [
  {
    label: "1M",
    value: "1mo",
  },
  {
    label: "3M",
    value: "3mo",
  },
  {
    label: "6M",
    value: "6mo",
  },
  {
    label: "1Y",
    value: "1y",
  },
  {
    label: "5Y",
    value: "5y",
  },
];


function extractHistoricalData(
  response: HistoricalApiResponse,
): HistoricalPoint[] {
  let rows: ApiHistoricalPoint[] = [];

  if (Array.isArray(response)) {
    rows = response;
  } else if (
    response &&
    Array.isArray(response.data)
  ) {
    rows = response.data;
  } else if (
    response &&
    Array.isArray(response.history)
  ) {
    rows = response.history;
  } else if (
    response &&
    Array.isArray(response.prices)
  ) {
    rows = response.prices;
  }


  return rows
    .map((item) => {
      const date =
        item.date ??
        item.Date ??
        "";

      const close =
        item.close ??
        item.Close ??
        0;


      return {
        date,
        close: Number(close),
      };
    })
    .filter(
      (item) =>
        item.date &&
        Number.isFinite(item.close),
    );
}


function formatPrice(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(value);
}


function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
    },
  );
}


export default function StockPriceChart({
  symbol,
}: Props) {
  const [
    period,
    setPeriod,
  ] = useState("6mo");


  const [
    chartData,
    setChartData,
  ] = useState<HistoricalPoint[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;


    async function loadHistoricalData() {
      if (!symbol.trim()) {
        setChartData([]);
        return;
      }


      try {
        setLoading(true);
        setError(null);


        const cleanSymbol =
          symbol
            .trim()
            .toUpperCase();


        const response =
          await api.get<HistoricalApiResponse>(
            `/historical/${encodeURIComponent(
              cleanSymbol,
            )}`,
            {
              params: {
                period,
              },
            },
          );


        if (cancelled) {
          return;
        }


        const parsedData =
          extractHistoricalData(
            response.data,
          );


        setChartData(parsedData);


        if (
          parsedData.length === 0
        ) {
          setError(
            "No historical price data available.",
          );
        }
      } catch (err) {
        if (cancelled) {
          return;
        }


        console.error(
          "Historical chart error:",
          err,
        );


        setChartData([]);

        setError(
          "Unable to load historical price data.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadHistoricalData();


    return () => {
      cancelled = true;
    };
  }, [
    symbol,
    period,
  ]);


  const priceSummary =
    useMemo(() => {
      if (
        chartData.length === 0
      ) {
        return null;
      }


      const firstPrice =
        chartData[0].close;


      const lastPrice =
        chartData[
          chartData.length - 1
        ].close;


      const change =
        lastPrice - firstPrice;


      const changePercent =
        firstPrice !== 0
          ? (
              change /
              firstPrice
            ) * 100
          : 0;


      return {
        firstPrice,
        lastPrice,
        change,
        changePercent,
      };
    }, [chartData]);


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
          alignItems: "flex-start",
          justifyContent:
            "space-between",
          gap: 20,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              color: "#94a3b8",
              fontSize: 13,
              margin: 0,
              marginBottom: 6,
            }}
          >
            PRICE HISTORY
          </p>

          <h2
            style={{
              color: "#f8fafc",
              margin: 0,
              fontSize: 22,
            }}
          >
            {symbol} Price Chart
          </h2>


          {priceSummary && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              <strong
                style={{
                  color: "#f8fafc",
                  fontSize: 22,
                }}
              >
                {formatPrice(
                  priceSummary.lastPrice,
                )}
              </strong>

              <span
                style={{
                  color:
                    priceSummary.change >= 0
                      ? "#22c55e"
                      : "#ef4444",
                  fontWeight: 700,
                }}
              >
                {priceSummary.change >= 0
                  ? "+"
                  : ""}

                {priceSummary.changePercent.toFixed(
                  2,
                )}
                %
              </span>
            </div>
          )}
        </div>


        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {PERIODS.map(
            (item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setPeriod(
                    item.value,
                  )
                }
                style={{
                  border:
                    period ===
                    item.value
                      ? "1px solid #3b82f6"
                      : "1px solid #334155",

                  background:
                    period ===
                    item.value
                      ? "#1d4ed8"
                      : "#1e293b",

                  color: "#f8fafc",

                  borderRadius: 8,

                  padding:
                    "8px 12px",

                  cursor: "pointer",

                  fontWeight: 600,
                }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      </div>


      {loading && (
        <div
          style={{
            height: 360,
            display: "grid",
            placeItems: "center",
            color: "#94a3b8",
          }}
        >
          Loading price history...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              height: 360,
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
        !error &&
        chartData.length > 0 && (
          <div
            style={{
              width: "100%",
              height: 360,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="stockPriceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>


                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />


                <XAxis
                  dataKey="date"
                  tickFormatter={
                    formatDate
                  }
                  stroke="#64748b"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  minTickGap={35}
                />


                <YAxis
                  domain={[
                    "auto",
                    "auto",
                  ]}
                  stroke="#64748b"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                  tickFormatter={(
                    value: number,
                  ) =>
                    `₹${Math.round(
                      value,
                    ).toLocaleString(
                      "en-IN",
                    )}`
                  }
                  width={90}
                />


                <Tooltip
                  labelFormatter={(
                    value,
                  ) =>
                    formatDate(
                      String(value),
                    )
                  }
                  formatter={(
                    value,
                  ) => [
                    formatPrice(
                      Number(value),
                    ),
                    "Close",
                  ]}
                  contentStyle={{
                    background:
                      "#0f172a",
                    border:
                      "1px solid #334155",
                    borderRadius: 10,
                    color: "#f8fafc",
                  }}
                />


                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#stockPriceGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
    </section>
  );
}