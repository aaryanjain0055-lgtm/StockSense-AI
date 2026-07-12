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
  symbol: string;

  company_name: string;

  currency: string;

  valuation: {
    market_cap: number | null;
    pe_ratio: number | null;
    price_to_book: number | null;
    eps: number | null;
    book_value: number | null;
  };

  profitability: {
    revenue: number | null;
    net_income: number | null;
    operating_margin: number | null;
    profit_margin: number | null;
    roe: number | null;
    roa: number | null;
  };

  balance_sheet: {
    total_cash: number | null;
    total_debt: number | null;
    debt_to_equity: number | null;
    current_ratio: number | null;
  };

  cash_flow: {
    operating_cash_flow: number | null;
    free_cash_flow: number | null;
  };
};


type FinancialData = {
  marketCap: number | null;

  peRatio: number | null;

  priceToBook: number | null;

  eps: number | null;

  bookValue: number | null;

  debtToEquity: number | null;

  returnOnEquity: number | null;

  returnOnAssets: number | null;

  operatingMargin: number | null;

  profitMargin: number | null;

  totalRevenue: number | null;

  netIncome: number | null;

  totalDebt: number | null;

  totalCash: number | null;

  currentRatio: number | null;

  operatingCashFlow: number | null;

  freeCashFlow: number | null;
};


const EMPTY_DATA: FinancialData = {
  marketCap: null,

  peRatio: null,

  priceToBook: null,

  eps: null,

  bookValue: null,

  debtToEquity: null,

  returnOnEquity: null,

  returnOnAssets: null,

  operatingMargin: null,

  profitMargin: null,

  totalRevenue: null,

  netIncome: null,

  totalDebt: null,

  totalCash: null,

  currentRatio: null,

  operatingCashFlow: null,

  freeCashFlow: null,
};


function parseFinancialData(
  response: FinancialApiResponse,
): FinancialData {
  return {
    marketCap:
      response.valuation?.market_cap ??
      null,

    peRatio:
      response.valuation?.pe_ratio ??
      null,

    priceToBook:
      response.valuation?.price_to_book ??
      null,

    eps:
      response.valuation?.eps ??
      null,

    bookValue:
      response.valuation?.book_value ??
      null,

    debtToEquity:
      response.balance_sheet?.debt_to_equity ??
      null,

    returnOnEquity:
      response.profitability?.roe ??
      null,

    returnOnAssets:
      response.profitability?.roa ??
      null,

    operatingMargin:
      response.profitability?.operating_margin ??
      null,

    profitMargin:
      response.profitability?.profit_margin ??
      null,

    totalRevenue:
      response.profitability?.revenue ??
      null,

    netIncome:
      response.profitability?.net_income ??
      null,

    totalDebt:
      response.balance_sheet?.total_debt ??
      null,

    totalCash:
      response.balance_sheet?.total_cash ??
      null,

    currentRatio:
      response.balance_sheet?.current_ratio ??
      null,

    operatingCashFlow:
      response.cash_flow?.operating_cash_flow ??
      null,

    freeCashFlow:
      response.cash_flow?.free_cash_flow ??
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

  return value.toFixed(decimals);
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

  return `${value.toFixed(2)}%`;
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
                title="EPS"
                value={
                  formatNumber(
                    data.eps,
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
                Profitability
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
                  label="Return on Assets"
                  value={
                    formatPercentage(
                      data.returnOnAssets,
                    )
                  }
                  rawValue={
                    data.returnOnAssets
                  }
                />


                <GrowthMetric
                  label="Operating Margin"
                  value={
                    formatPercentage(
                      data.operatingMargin,
                    )
                  }
                  rawValue={
                    data.operatingMargin
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
                  label="Net Income"
                  value={
                    formatLargeCurrency(
                      data.netIncome,
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
                Cash Flow
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
                  label="Operating Cash Flow"
                  value={
                    formatLargeCurrency(
                      data.operatingCashFlow,
                    )
                  }
                />


                <BalanceMetric
                  label="Free Cash Flow"
                  value={
                    formatLargeCurrency(
                      data.freeCashFlow,
                    )
                  }
                />


                <BalanceMetric
                  label="Book Value"
                  value={
                    formatNumber(
                      data.bookValue,
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