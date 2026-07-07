import {
  useEffect,
  useState,
} from "react";

import {
  BrainCircuit,
  Building2,
  CheckCircle2,
  Info,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import api from "../../services/api";


type Props = {
  symbol: string;
};


type CompanyApiResponse = {
  symbol?: string;

  name?: string;
  company_name?: string;
  longName?: string;

  sector?: string;
  industry?: string;

  description?: string;
  summary?: string;
  long_business_summary?: string;
  longBusinessSummary?: string;

  website?: string;
  country?: string;

  employees?: number;
  full_time_employees?: number;
  fullTimeEmployees?: number;

  strengths?: string[];
  risks?: string[];
  opportunities?: string[];

  company?: CompanyApiResponse;
  profile?: CompanyApiResponse;
  data?: CompanyApiResponse;
};


type CompanyData = {
  name: string;

  sector: string;

  industry: string;

  description: string;

  website: string;

  country: string;

  employees: number | null;

  strengths: string[];

  risks: string[];

  opportunities: string[];
};


const EMPTY_DATA: CompanyData = {
  name: "N/A",

  sector: "N/A",

  industry: "N/A",

  description:
    "Company information is currently unavailable.",

  website: "",

  country: "N/A",

  employees: null,

  strengths: [],

  risks: [],

  opportunities: [],
};


function getPayload(
  response: CompanyApiResponse,
): CompanyApiResponse {
  if (response.company) {
    return response.company;
  }

  if (response.profile) {
    return response.profile;
  }

  if (response.data) {
    return response.data;
  }

  return response;
}


function parseCompanyData(
  response: CompanyApiResponse,
): CompanyData {
  const data = getPayload(response);


  return {
    name:
      data.name ??
      data.company_name ??
      data.longName ??
      "N/A",


    sector:
      data.sector ??
      "N/A",


    industry:
      data.industry ??
      "N/A",


    description:
      data.description ??
      data.summary ??
      data.long_business_summary ??
      data.longBusinessSummary ??
      "Company information is currently unavailable.",


    website:
      data.website ??
      "",


    country:
      data.country ??
      "N/A",


    employees:
      data.employees ??
      data.full_time_employees ??
      data.fullTimeEmployees ??
      null,


    strengths:
      Array.isArray(data.strengths)
        ? data.strengths
        : [],


    risks:
      Array.isArray(data.risks)
        ? data.risks
        : [],


    opportunities:
      Array.isArray(data.opportunities)
        ? data.opportunities
        : [],
  };
}


function formatEmployees(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "N/A";
  }


  return new Intl.NumberFormat(
    "en-IN",
  ).format(value);
}


function generateStrengths(
  data: CompanyData,
): string[] {
  if (data.strengths.length > 0) {
    return data.strengths;
  }


  const strengths: string[] = [];


  if (data.sector !== "N/A") {
    strengths.push(
      `Established presence in the ${data.sector} sector.`,
    );
  }


  if (data.industry !== "N/A") {
    strengths.push(
      `Operates in the ${data.industry} industry.`,
    );
  }


  if (data.employees !== null) {
    strengths.push(
      "Large operational workforce and established business infrastructure.",
    );
  }


  return strengths;
}


function generateOpportunities(
  data: CompanyData,
): string[] {
  if (
    data.opportunities.length > 0
  ) {
    return data.opportunities;
  }


  const opportunities: string[] = [];


  if (data.sector !== "N/A") {
    opportunities.push(
      `Potential growth opportunities linked to developments in the ${data.sector} sector.`,
    );
  }


  opportunities.push(
    "Future performance may benefit from business expansion, operational efficiency, and favorable market conditions.",
  );


  return opportunities;
}


function generateRisks(
  data: CompanyData,
): string[] {
  if (data.risks.length > 0) {
    return data.risks;
  }


  return [
    "Company performance can be affected by market volatility and changing economic conditions.",

    "Investors should evaluate valuation, earnings growth, debt levels, and industry conditions before making decisions.",
  ];
}


export default function AICompanySummary({
  symbol,
}: Props) {
  const [
    data,
    setData,
  ] =
    useState<CompanyData>(
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


    async function loadCompanyData() {
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
          await api.get<CompanyApiResponse>(
            `/company/${encodeURIComponent(
              cleanSymbol,
            )}`,
          );


        if (cancelled) {
          return;
        }


        setData(
          parseCompanyData(
            response.data,
          ),
        );
      } catch (err) {
        if (cancelled) {
          return;
        }


        console.error(
          "Company information request failed:",
          err,
        );


        setData(EMPTY_DATA);


        setError(
          "Unable to load company intelligence.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadCompanyData();


    return () => {
      cancelled = true;
    };
  }, [symbol]);


  const strengths =
    generateStrengths(data);


  const opportunities =
    generateOpportunities(data);


  const risks =
    generateRisks(data);


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
              width: 44,

              height: 44,

              display: "grid",

              placeItems: "center",

              borderRadius: 12,

              background:
                "rgba(59, 130, 246, 0.12)",

              color: "#60a5fa",
            }}
          >
            <BrainCircuit
              size={24}
            />
          </div>


          <div>
            <p
              style={{
                color: "#64748b",

                fontSize: 12,

                fontWeight: 700,

                letterSpacing:
                  "0.08em",

                margin:
                  "0 0 5px 0",
              }}
            >
              COMPANY INTELLIGENCE
            </p>


            <h2
              style={{
                color: "#f8fafc",

                fontSize: 22,

                margin: 0,
              }}
            >
              AI Company Summary
            </h2>
          </div>
        </div>


        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,

            padding:
              "9px 14px",

            borderRadius: 10,

            background: "#0f172a",

            border:
              "1px solid #334155",

            color: "#a78bfa",
          }}
        >
          <Sparkles
            size={17}
          />

          <span
            style={{
              fontSize: 12,

              fontWeight: 700,
            }}
          >
            EXPLAINABLE ANALYSIS
          </span>
        </div>
      </div>


      {loading && (
        <div
          style={{
            minHeight: 250,

            display: "grid",

            placeItems: "center",

            color: "#94a3b8",
          }}
        >
          Loading company intelligence...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              minHeight: 180,

              display: "grid",

              placeItems: "center",

              textAlign: "center",

              color: "#f87171",
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
                background: "#0f172a",

                border:
                  "1px solid #1e293b",

                borderRadius: 14,

                padding: 20,

                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",

                  alignItems:
                    "flex-start",

                  gap: 14,
                }}
              >
                <Building2
                  size={24}
                  color="#60a5fa"
                />


                <div>
                  <h3
                    style={{
                      color:
                        "#f8fafc",

                      fontSize: 20,

                      margin:
                        "0 0 8px 0",
                    }}
                  >
                    {data.name}
                  </h3>


                  <p
                    style={{
                      color:
                        "#94a3b8",

                      margin: 0,

                      fontSize: 14,
                    }}
                  >
                    {symbol}
                  </p>
                </div>
              </div>


              <div
                style={{
                  display: "grid",

                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(170px, 1fr))",

                  gap: 16,

                  marginTop: 20,
                }}
              >
                <CompanyMetric
                  label="Sector"
                  value={data.sector}
                />


                <CompanyMetric
                  label="Industry"
                  value={data.industry}
                />


                <CompanyMetric
                  label="Country"
                  value={data.country}
                />


                <CompanyMetric
                  label="Employees"
                  value={formatEmployees(
                    data.employees,
                  )}
                />
              </div>
            </div>


            <div
              style={{
                background: "#1e293b",

                borderRadius: 14,

                padding: 20,

                marginBottom: 20,
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
                <Info
                  size={19}
                  color="#60a5fa"
                />


                <h3
                  style={{
                    color:
                      "#f8fafc",

                    margin: 0,

                    fontSize: 17,
                  }}
                >
                  Business Overview
                </h3>
              </div>


              <p
                style={{
                  color: "#cbd5e1",

                  lineHeight: 1.8,

                  margin: 0,

                  fontSize: 14,
                }}
              >
                {data.description}
              </p>
            </div>


            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",

                gap: 16,
              }}
            >
              <AnalysisPanel
                icon={
                  <CheckCircle2
                    size={20}
                    color="#22c55e"
                  />
                }
                title="Business Strengths"
                items={strengths}
                emptyText="No specific strengths are currently available."
              />


              <AnalysisPanel
                icon={
                  <TrendingUp
                    size={20}
                    color="#60a5fa"
                  />
                }
                title="Growth Opportunities"
                items={opportunities}
                emptyText="No specific opportunities are currently available."
              />


              <AnalysisPanel
                icon={
                  <ShieldAlert
                    size={20}
                    color="#f59e0b"
                  />
                }
                title="Risk Considerations"
                items={risks}
                emptyText="No specific risk information is currently available."
              />
            </div>


            <div
              style={{
                marginTop: 20,

                padding: 16,

                background:
                  "rgba(59, 130, 246, 0.08)",

                border:
                  "1px solid rgba(59, 130, 246, 0.25)",

                borderRadius: 12,
              }}
            >
              <p
                style={{
                  margin: 0,

                  color: "#94a3b8",

                  fontSize: 13,

                  lineHeight: 1.7,
                }}
              >
                This company summary is provided for
                analytical research and informational
                purposes. It should be considered together
                with financial, technical, sentiment, and
                risk analysis.
              </p>
            </div>
          </>
        )}
    </section>
  );
}


type CompanyMetricProps = {
  label: string;

  value: string;
};


function CompanyMetric({
  label,
  value,
}: CompanyMetricProps) {
  return (
    <div>
      <p
        style={{
          color: "#64748b",

          fontSize: 12,

          margin:
            "0 0 7px 0",
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


type AnalysisPanelProps = {
  icon: React.ReactNode;

  title: string;

  items: string[];

  emptyText: string;
};


function AnalysisPanel({
  icon,
  title,
  items,
  emptyText,
}: AnalysisPanelProps) {
  return (
    <div
      style={{
        background: "#0f172a",

        border:
          "1px solid #1e293b",

        borderRadius: 14,

        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems: "center",

          gap: 10,

          marginBottom: 16,
        }}
      >
        {icon}


        <h3
          style={{
            color: "#f8fafc",

            fontSize: 16,

            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>


      {items.length === 0 ? (
        <p
          style={{
            color: "#64748b",

            fontSize: 13,

            lineHeight: 1.6,

            margin: 0,
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 12,
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

                  gap: 9,
                }}
              >
                <span
                  style={{
                    color:
                      "#60a5fa",

                    marginTop: 2,
                  }}
                >
                  •
                </span>


                <p
                  style={{
                    color:
                      "#cbd5e1",

                    fontSize: 13,

                    lineHeight: 1.6,

                    margin: 0,
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