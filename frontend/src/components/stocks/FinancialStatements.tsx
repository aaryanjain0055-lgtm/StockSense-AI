import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CircleDollarSign,
  Landmark,
  Percent,
  Scale,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type FinancialApiResponse = {
  symbol?: string;

  market_cap?: number | null;
  marketCap?: number | null;

  pe_ratio?: number | null;
  trailing_pe?: number | null;
  trailingPE?: number | null;

  forward_pe?: number | null;
  forwardPE?: number | null;

  price_to_book?: number | null;
  priceToBook?: number | null;

  debt_to_equity?: number | null;
  debtToEquity?: number | null;

  return_on_equity?: number | null;
  returnOnEquity?: number | null;

  profit_margin?: number | null;
  profitMargins?: number | null;

  revenue_growth?: number | null;
  revenueGrowth?: number | null;

  earnings_growth?: number | null;
  earningsGrowth?: number | null;

  total_revenue?: number | null;
  totalRevenue?: number | null;

  total_debt?: number | null;
  totalDebt?: number | null;

  total_cash?: number | null;
  totalCash?: number | null;

  current_ratio?: number | null;
  currentRatio?: number | null;

  financial?: FinancialApiResponse;
  fundamentals?: FinancialApiResponse;
  data?: FinancialApiResponse;
};


type FinancialData = {
  marketCap: number | null;

  peRatio: number | null;

  forwardPE: number | null;

  priceToBook: number | null;

  debtToEquity: number | null;

  returnOnEquity: number | null;

  profitMargin: number | null;

  revenueGrowth: number | null;

  earningsGrowth: number | null;

  totalRevenue: number | null;

  totalDebt: number | null;

  totalCash: number | null;

  currentRatio: number | null;
};


const EMPTY_DATA: FinancialData = {
  marketCap: null,

  peRatio: null,

  forwardPE: null,

  priceToBook: null,

  debtToEquity: null,

  returnOnEquity: null,

  profitMargin: null,

  revenueGrowth: null,

  earningsGrowth: null,

  totalRevenue: null,

  totalDebt: null,

  totalCash: null,

  currentRatio: null,
};


function getPayload(
  response: FinancialApiResponse,
): FinancialApiResponse {
  if (response.financial) {
    return response.financial;
  }

  if (response.fundamentals) {
    return response.fundamentals;
  }

  if (response.data) {
    return response.data;
  }

  return response;
}


function parseFinancialData(
  response: FinancialApiResponse,
): FinancialData {
  const data = getPayload(
    response,
  );


  return {
    marketCap:
      data.market_cap ??
      data.marketCap ??
      null,


    peRatio:
      data.pe_ratio ??
      data.trailing_pe ??
      data.trailingPE ??
      null,


    forwardPE:
      data.forward_pe ??
      data.forwardPE ??
      null,


    priceToBook:
      data.price_to_book ??
      data.priceToBook ??
      null,


    debtToEquity:
      data.debt_to_equity ??
      data.debtToEquity ??
      null,


    returnOnEquity:
      data.return_on_equity ??
      data.returnOnEquity ??
      null,


    profitMargin:
      data.profit_margin ??
      data.profitMargins ??
      null,


    revenueGrowth:
      data.revenue_growth ??
      data.revenueGrowth ??
      null,


    earningsGrowth:
      data.earnings_growth ??
      data.earningsGrowth ??
      null,


    totalRevenue:
      data.total_revenue ??
      data.totalRevenue ??
      null,


    totalDebt:
      data.total_debt ??
      data.totalDebt ??
      null,


    totalCash:
      data.total_cash ??
      data.totalCash ??
      null,


    currentRatio:
      data.current_ratio ??
      data.currentRatio ??
      null,
  };
}


function formatNumber(
  value: number | null,
  decimals = 2,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }


  return value.toFixed(
    decimals,
  );
}


function formatPercentage(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }


  const percentage =
    Math.abs(value) <= 1
      ? value * 100
      : value;


  return `${percentage.toFixed(
    2,
  )}%`;
}


function formatLargeCurrency(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }


  const absoluteValue =
    Math.abs(value);


  if (
    absoluteValue >=
    1_00_00_00_00_00_000
  ) {
    return `₹${(
      value /
      1_00_00_00_00_00_000
    ).toFixed(2)} L Cr`;
  }


  if (
    absoluteValue >=
    1_00_00_00_000
  ) {
    return `₹${(
      value /
      1_00_00_00_000
    ).toFixed(2)} Cr`;
  }


  if (
    absoluteValue >=
    1_00_000
  ) {
    return `₹${(
      value /
      1_00_000
    ).toFixed(2)} L`;
  }


  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",

      currency: "INR",

      maximumFractionDigits: 0,
    },
  ).format(value);
}


function getValueColor(
  value: number | null,
): string {
  if (value === null) {
    return "#94a3b8";
  }


  if (value > 0) {
    return "#22c55e";
  }


  if (value < 0) {
    return "#ef4444";
  }


  return "#f59e0b";
}


export default function FinancialStatements({
  symbol,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<FinancialData>(
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


    async function loadFinancialData() {
      const cleanSymbol =
        symbol
          .trim()
          .toUpperCase();


      if (!cleanSymbol) {
        setData(
          EMPTY_DATA,
        );

        return;
      }


      try {
        setLoading(true);

        setError(null);


        const response =
          await api.get<FinancialApiResponse>(
            `/financial/${encodeURIComponent(
              cleanSymbol,
            )}`,
          );


        if (cancelled) {
          return;
        }


        setData(
          parseFinancialData(
            response.data,
          ),
        );
      } catch (err) {
        if (cancelled) {
          return;
        }


        console.error(
          "Financial data request failed:",
          err,
        );


        setData(
          EMPTY_DATA,
        );


        setError(
          "Unable to load financial information for this stock.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadFinancialData();


    return () => {
      cancelled = true;
    };
  }, [symbol]);


  return (
    <section
      style={{
        background:
          "#111827",

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

          alignItems:
            "flex-start",

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

              color:
                "#64748b",

              fontSize: 12,

              fontWeight: 700,

              letterSpacing:
                "0.08em",
            }}
          >
            COMPANY FUNDAMENTALS
          </p>


          <h2
            style={{
              margin: 0,

              color:
                "#f8fafc",

              fontSize: 22,
            }}
          >
            Financial Analysis
          </h2>


          <p
            style={{
              margin:
                "8px 0 0 0",

              color:
                "#94a3b8",
            }}
          >
            {symbol}
          </p>
        </div>


        <div
          style={{
            display: "flex",

            alignItems:
              "center",

            gap: 8,

            padding:
              "9px 14px",

            background:
              "#0f172a",

            border:
              "1px solid #334155",

            borderRadius: 10,

            color:
              "#60a5fa",
          }}
        >
          <Building2
            size={18}
          />

          <span
            style={{
              fontWeight: 700,

              fontSize: 13,
            }}
          >
            FUNDAMENTALS
          </span>
        </div>
      </div>


      {loading && (
        <div
          style={{
            minHeight: 260,

            display: "grid",

            placeItems:
              "center",

            color:
              "#94a3b8",
          }}
        >
          Loading financial data...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              minHeight: 180,

              display: "grid",

              placeItems:
                "center",

              textAlign:
                "center",

              color:
                "#f87171",
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
                  "repeat(auto-fit, minmax(190px, 1fr))",

                gap: 16,
              }}
            >
              <FinancialCard
                icon={
                  <CircleDollarSign
                    size={20}
                  />
                }
                title="Market Cap"
                value={
                  formatLargeCurrency(
                    data.marketCap,
                  )
                }
              />


              <FinancialCard
                icon={
                  <Percent
                    size={20}
                  />
                }
                title="P/E Ratio"
                value={
                  formatNumber(
                    data.peRatio,
                  )
                }
              />


              <FinancialCard
                icon={
                  <TrendingUp
                    size={20}
                  />
                }
                title="Forward P/E"
                value={
                  formatNumber(
                    data.forwardPE,
                  )
                }
              />


              <FinancialCard
                icon={
                  <Scale
                    size={20}
                  />
                }
                title="Price to Book"
                value={
                  formatNumber(
                    data.priceToBook,
                  )
                }
              />


              <FinancialCard
                icon={
                  <Landmark
                    size={20}
                  />
                }
                title="Debt to Equity"
                value={
                  formatNumber(
                    data.debtToEquity,
                  )
                }
              />


              <FinancialCard
                icon={
                  <TrendingUp
                    size={20}
                  />
                }
                title="Current Ratio"
                value={
                  formatNumber(
                    data.currentRatio,
                  )
                }
              />
            </div>


            <div
              style={{
                marginTop: 20,

                background:
                  "#0f172a",

                border:
                  "1px solid #1e293b",

                borderRadius: 12,

                padding: 20,
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 18px 0",

                  color:
                    "#f8fafc",

                  fontSize: 17,
                }}
              >
                Growth & Profitability
              </h3>


              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(170px, 1fr))",

                  gap: 18,
                }}
              >
                <GrowthMetric
                  label="Return on Equity"
                  value={
                    formatPercentage(
                      data.returnOnEquity,
                    )
                  }
                  rawValue={
                    data.returnOnEquity
                  }
                />


                <GrowthMetric
                  label="Profit Margin"
                  value={
                    formatPercentage(
                      data.profitMargin,
                    )
                  }
                  rawValue={
                    data.profitMargin
                  }
                />


                <GrowthMetric
                  label="Revenue Growth"
                  value={
                    formatPercentage(
                      data.revenueGrowth,
                    )
                  }
                  rawValue={
                    data.revenueGrowth
                  }
                />


                <GrowthMetric
                  label="Earnings Growth"
                  value={
                    formatPercentage(
                      data.earningsGrowth,
                    )
                  }
                  rawValue={
                    data.earningsGrowth
                  }
                />
              </div>
            </div>


            <div
              style={{
                marginTop: 20,

                background:
                  "#0f172a",

                border:
                  "1px solid #1e293b",

                borderRadius: 12,

                padding: 20,
              }}
            >
              <h3
                style={{
                  margin:
                    "0 0 18px 0",

                  color:
                    "#f8fafc",

                  fontSize: 17,
                }}
              >
                Balance Sheet Snapshot
              </h3>


              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",

                  gap: 18,
                }}
              >
                <BalanceMetric
                  label="Total Revenue"
                  value={
                    formatLargeCurrency(
                      data.totalRevenue,
                    )
                  }
                />


                <BalanceMetric
                  label="Total Debt"
                  value={
                    formatLargeCurrency(
                      data.totalDebt,
                    )
                  }
                />


                <BalanceMetric
                  label="Total Cash"
                  value={
                    formatLargeCurrency(
                      data.totalCash,
                    )
                  }
                />
              </div>
            </div>
          </>
        )}
    </section>
  );
}


type FinancialCardProps = {
  icon: React.ReactNode;

  title: string;

  value: string;
};


function FinancialCard({
  icon,
  title,
  value,
}: FinancialCardProps) {
  return (
    <div
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
            "#60a5fa",

          marginBottom: 14,
        }}
      >
        {icon}
      </div>


      <p
        style={{
          margin:
            "0 0 8px 0",

          color:
            "#94a3b8",

          fontSize: 13,
        }}
      >
        {title}
      </p>


      <strong
        style={{
          color:
            "#f8fafc",

          fontSize: 21,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


type GrowthMetricProps = {
  label: string;

  value: string;

  rawValue: number | null;
};


function GrowthMetric({
  label,
  value,
  rawValue,
}: GrowthMetricProps) {
  return (
    <div>
      <p
        style={{
          margin:
            "0 0 7px 0",

          color:
            "#64748b",

          fontSize: 12,
        }}
      >
        {label}
      </p>


      <strong
        style={{
          color:
            getValueColor(
              rawValue,
            ),

          fontSize: 18,
        }}
      >
        {value}
      </strong>
    </div>
  );
}


type BalanceMetricProps = {
  label: string;

  value: string;
};


function BalanceMetric({
  label,
  value,
}: BalanceMetricProps) {
  return (
    <div>
      <p
        style={{
          margin:
            "0 0 7px 0",

          color:
            "#64748b",

          fontSize: 12,
        }}
      >
        {label}
      </p>


      <strong
        style={{
          color:
            "#e2e8f0",

          fontSize: 17,
        }}
      >
        {value}
      </strong>
    </div>
  );
}